import { useState, useEffect } from "react";
import { useWallet } from "@alephium/web3-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define the missing types
interface ContractEventsByTxId {
  events: Event[];
}

interface ContractEventsByBlockHash {
  events: Event[];
}

// Update the ContractState interface to match the one from Alephium
interface ContractState {
  address: string;
  bytecode: string;
  codeHash: string;
  initialStateHash: string; // Make sure this isn't optional
  immFields: Array<{
    type: string;
    value: string;
  }>;
  mutFields: Array<{
    type: string;
    value: string;
  }>;
  asset: {
    attoAlphAmount: string;
    tokens: Array<{
      id: string;
      amount: string;
    }>;
  };
}

interface EventField {
  type: string;
  value: string;
}

interface Event {
  txId?: string;
  blockHash?: string;
  contractAddress: string;
  eventIndex: number;
  fields: EventField[];
}

export function ContractExplorer() {
  const { nodeProvider } = useWallet();
  // Remove contractId and only use contractAddress
  const [contractAddress, setContractAddress] = useState(
    "24o5HjYBSbYhnDSw2GmE5JSLm8Djs8P1xKZaxG1bS2Ub9"
  );
  const [txId, setTxId] = useState(
    "228724aa511d408b8734f31f96a602410064323dde14c6362a30011d20b886ee"
  );
  const [blockHash, setBlockHash] = useState(
    "0000004178a4ff62e663dc9226b9ab4a27545bbff285ea86f5bfa9f0545ebb00"
  );
  const [contractState, setContractState] = useState<ContractState | null>(
    null
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("contract");

  // Auto-fetch data when component mounts
  useEffect(() => {
    if (nodeProvider) {
      if (activeTab === "contract" && contractAddress) {
        fetchContractState();
      } else if (activeTab === "events" && txId) {
        fetchEventsByTxId();
      }
    }
  }, [nodeProvider, activeTab]);

  const fetchContractState = async () => {
    if (!nodeProvider || !contractAddress) return;

    setLoading(true);
    try {
      const state =
        await nodeProvider.contracts.getContractsAddressState(contractAddress);

      // Cast the state to our ContractState interface
      setContractState(state as unknown as ContractState);
      console.log("Contract State:", state);
    } catch (error) {
      console.error("Error fetching contract state:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsByTxId = async () => {
    if (!nodeProvider || !txId) return;

    setLoading(true);
    try {
      const response = (await nodeProvider.events.getEventsTxIdTxid(
        txId
      )) as ContractEventsByTxId;
      setEvents(response.events);
      console.log("Events by TxId:", response);
    } catch (error) {
      console.error("Error fetching events by txId:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsByBlockHash = async () => {
    if (!nodeProvider || !blockHash) return;

    setLoading(true);
    try {
      const response = (await nodeProvider.events.getEventsBlockHashBlockhash(
        blockHash
      )) as ContractEventsByBlockHash;
      setEvents(response.events);
      console.log("Events by BlockHash:", response);
    } catch (error) {
      console.error("Error fetching events by blockHash:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatHexString = (hex: string, prefix = true) => {
    if (!hex) return "";
    const formatted = hex.startsWith("0x") ? hex.substring(2) : hex;
    return prefix ? `0x${formatted}` : formatted;
  };

  const decodeHexToString = (hex: string) => {
    if (!hex) return "";
    try {
      const formatted = formatHexString(hex, false);
      const bytes = new Uint8Array(
        formatted.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
      );
      return new TextDecoder().decode(bytes);
    } catch {
      // Fixed the empty catch block by returning the hex
      return hex;
    }
  };

  const renderFieldValue = (field: EventField) => {
    if (field.type === "ByteVec") {
      const hexValue = field.value;
      // Try to decode as string if it looks like text
      try {
        const decoded = decodeHexToString(hexValue);
        if (decoded && /^[\x20-\x7E]*$/.test(decoded)) {
          return (
            <div>
              <span className="font-mono text-xs">
                {formatHexString(hexValue)}
              </span>
              <Badge variant="outline" className="ml-2">
                {decoded}
              </Badge>
            </div>
          );
        }
      } catch {
        // Fixed empty catch block
        return (
          <span className="font-mono text-xs break-all">
            {formatHexString(hexValue)}
          </span>
        );
      }

      return (
        <span className="font-mono text-xs break-all">
          {formatHexString(hexValue)}
        </span>
      );
    }
    return <span>{field.value}</span>;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
        Alephium Explorer
      </h1>

      <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-[#1a2235] border border-slate-200 dark:border-[#2a3245]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-slate-100 dark:bg-[#232b3d]">
            <TabsList className="w-full flex bg-transparent p-0 h-12">
              <TabsTrigger
                value="contract"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2235] h-full flex items-center justify-center"
              >
                Contract Explorer
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2235] h-full flex items-center justify-center"
              >
                Event Explorer
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="contract" className="p-6">
            {/* Contract tab content remains the same */}
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">
                  Contract Address
                </label>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter contract address"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="bg-white dark:bg-[#131825] border-slate-200 dark:border-[#2a3245] text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={fetchContractState}
                    disabled={loading || !contractAddress}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    {loading ? "Loading..." : "Fetch"}
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4 mt-6 p-6 bg-[#232b3d] rounded-xl">
                  <Skeleton className="h-6 w-full rounded-lg bg-[#2a3245]" />
                  <Skeleton className="h-6 w-3/4 rounded-lg bg-[#2a3245]" />
                  <Skeleton className="h-6 w-5/6 rounded-lg bg-[#2a3245]" />
                </div>
              ) : contractState ? (
                <div className="mt-6 space-y-6">
                  <div className="bg-white dark:bg-[#232b3d] p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                      Contract Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Address
                        </span>
                        <span className="font-mono text-sm bg-white dark:bg-gray-700 p-2 rounded-lg">
                          {contractState.address}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Code Hash
                        </span>
                        <span className="font-mono text-sm bg-white dark:bg-gray-700 p-2 rounded-lg">
                          {formatHexString(contractState.codeHash)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Initial State Hash
                        </span>
                        <span className="font-mono text-sm bg-white dark:bg-gray-700 p-2 rounded-lg">
                          {formatHexString(contractState.initialStateHash)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Immutable Fields
                      </h3>
                      {contractState.immFields.length > 0 ? (
                        <div className="space-y-3">
                          {contractState.immFields.map((field, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-700 p-3 rounded-lg"
                            >
                              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                                {field.type} #{index}
                              </span>
                              <div className="font-mono text-sm">
                                {renderFieldValue(field)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          No immutable fields
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Mutable Fields
                      </h3>
                      {contractState.mutFields.length > 0 ? (
                        <div className="space-y-3">
                          {contractState.mutFields.map((field, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-700 p-3 rounded-lg"
                            >
                              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                                {field.type} #{index}
                              </span>
                              <div className="font-mono text-sm">
                                {renderFieldValue(field)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          No mutable fields
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                      Assets
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ALPH
                        </span>
                        <span className="font-medium">
                          {/* Fixed the bigint to ReactNode conversion - convert to string */}
                          {String(
                            BigInt(contractState.asset.attoAlphAmount) /
                              BigInt(10 ** 18)
                          )}{" "}
                          ALPH
                        </span>
                      </div>
                      {contractState.asset.tokens.map((token, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-700 p-3 rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Token ID
                            </span>
                            <span className="font-mono text-xs">
                              {token.id}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Amount
                            </span>
                            <span>{token.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                      Bytecode
                    </h3>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <div className="font-mono text-xs break-all max-h-40 overflow-auto">
                        {formatHexString(contractState.bytecode)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="events" className="p-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">
                  Transaction ID
                </label>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter transaction ID"
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    className="bg-white dark:bg-[#131825] border-slate-200 dark:border-[#2a3245] text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={fetchEventsByTxId}
                    disabled={loading || !txId}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    Fetch
                  </Button>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
                <span className="px-4 text-sm text-slate-500 dark:text-slate-400">
                  OR
                </span>
                <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">
                  Block Hash
                </label>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter block hash"
                    value={blockHash}
                    onChange={(e) => setBlockHash(e.target.value)}
                    className="bg-white dark:bg-[#131825] border-slate-200 dark:border-[#2a3245] text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={fetchEventsByBlockHash}
                    disabled={loading || !blockHash}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    Fetch
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4 mt-6 p-6 bg-slate-100 dark:bg-[#232b3d] rounded-xl">
                  <Skeleton className="h-6 w-full rounded-lg bg-slate-200 dark:bg-[#2a3245]" />
                  <Skeleton className="h-6 w-3/4 rounded-lg bg-slate-200 dark:bg-[#2a3245]" />
                  <Skeleton className="h-6 w-5/6 rounded-lg bg-slate-200 dark:bg-[#2a3245]" />
                </div>
              ) : events.length > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                      Events
                    </h3>
                    <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {events.length}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {events.map((event, eventIdx) => (
                      <div
                        key={eventIdx}
                        className="bg-white dark:bg-[#232b3d] p-6 rounded-xl shadow-sm"
                      >
                        <div className="grid grid-cols-1 gap-3">
                          {event.blockHash && (
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                Block Hash
                              </span>
                              <span className="font-mono text-sm bg-slate-50 dark:bg-[#1a2235] p-2 rounded-lg border border-slate-100 dark:border-[#2a3245]">
                                {event.blockHash}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                              Contract Address
                            </span>
                            <span className="font-mono text-sm bg-slate-50 dark:bg-[#1a2235] p-2 rounded-lg border border-slate-100 dark:border-[#2a3245]">
                              {event.contractAddress}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                              Event Index
                            </span>
                            <span className="font-mono text-sm bg-slate-50 dark:bg-[#1a2235] p-2 rounded-lg border border-slate-100 dark:border-[#2a3245]">
                              {event.eventIndex}
                            </span>
                          </div>

                          <div className="my-4 border-t border-slate-200 dark:border-slate-700"></div>

                          <div>
                            <span className="text-sm font-medium text-slate-700 dark:text-white mb-3 block">
                              Fields
                            </span>
                            <div className="space-y-3">
                              {event.fields.map((field, fieldIdx) => (
                                <div
                                  key={fieldIdx}
                                  className="bg-slate-50 dark:bg-[#1a2235] p-3 rounded-lg border-l-4 border-blue-500"
                                >
                                  <span className="text-sm text-slate-500 dark:text-slate-400 block mb-1">
                                    {field.type} #{fieldIdx}
                                  </span>
                                  <div className="font-mono text-sm text-slate-900 dark:text-slate-200">
                                    {renderFieldValue(field)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-8 bg-white dark:bg-[#232b3d] rounded-xl text-center shadow-sm">
                  <p className="text-slate-600 dark:text-slate-300">
                    No events found
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Try a different transaction ID or block hash
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ContractExplorer;
