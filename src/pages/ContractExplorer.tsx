import { useState, useEffect } from "react";
import { useWallet } from "@alephium/web3-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { addressFromContractId } from "@alephium/web3";
import TokenConverter from "../components/TokenConverter";

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

  // Add these new state variables for the converter tab
  const [contractId, setContractId] = useState(
    "9626780058a51b26e020679ecb1117b0d719e10b8cffbdc72384384cb1db7900"
  );
  const [convertedAddress, setConvertedAddress] = useState("");
  const [conversionError, setConversionError] = useState("");

  // Add this new function for the converter
  const convertContractIdToAddress = () => {
    if (!contractId) return;

    try {
      setConversionError("");
      const address = addressFromContractId(contractId);
      setConvertedAddress(address);
    } catch (error) {
      console.error("Error converting contract ID:", error);
      setConversionError("Invalid contract ID format");
      setConvertedAddress("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 center w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-600 rounded-3xl mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-50 mb-6">
            Contract <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Explorer</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Discover and analyze smart contracts on the Alephium blockchain</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl overflow-hidden shadow-airbnb-dark-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-gradient-to-r from-gray-850/80 to-gray-800/80 border-b border-gray-700/50">
            <TabsList className="w-full flex bg-transparent p-0 h-16 overflow-x-auto">
              <TabsTrigger
                value="contract"
                className="relative flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 h-full flex items-center justify-center text-gray-400 data-[state=active]:text-gray-100 font-medium text-sm px-4 transition-all cursor-pointer hover:text-gray-200 hover:bg-white/5 group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity"></div>
                  <span className="truncate">Contract State</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="relative flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 h-full flex items-center justify-center text-gray-400 data-[state=active]:text-gray-100 font-medium text-sm px-4 transition-all cursor-pointer hover:text-gray-200 hover:bg-white/5 group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity"></div>
                  <span className="truncate">Events</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="convert"
                className="relative flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 h-full flex items-center justify-center text-gray-400 data-[state=active]:text-gray-100 font-medium text-sm px-4 transition-all cursor-pointer hover:text-gray-200 hover:bg-white/5 group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity"></div>
                  <span className="truncate">Converter</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="tokens"
                className="relative flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 h-full flex items-center justify-center text-gray-400 data-[state=active]:text-gray-100 font-medium text-sm px-4 transition-all cursor-pointer hover:text-gray-200 hover:bg-white/5 group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity"></div>
                  <span className="truncate">Tokens</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="contract" className="p-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <label className="text-lg font-semibold text-gray-100">
                    Contract Address
                  </label>
                </div>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter contract address..."
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="bg-gray-900/50 border-gray-600/50 h-14 font-mono text-sm text-gray-100 placeholder:text-gray-400 hover:border-purple-500/50 focus:border-purple-500 transition-all duration-300 rounded-xl backdrop-blur-sm flex-1"
                  />
                  <Button
                    onClick={fetchContractState}
                    disabled={loading || !contractAddress}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold px-8 h-14 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      "Fetch Contract"
                    )}
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

          <TabsContent value="convert" className="p-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">
                  Contract ID
                </label>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter contract ID"
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                    className="bg-white dark:bg-[#131825] border-slate-200 dark:border-[#2a3245] text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={convertContractIdToAddress}
                    disabled={!contractId}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    Convert
                  </Button>
                </div>
                {conversionError && (
                  <p className="mt-2 text-red-500 text-sm">{conversionError}</p>
                )}
              </div>

              {convertedAddress && (
                <div className="mt-6 bg-white dark:bg-[#232b3d] p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                    Conversion Result
                  </h3>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Contract Address
                    </span>
                    <div className="flex items-center">
                      <span className="font-mono text-sm bg-slate-50 dark:bg-[#1a2235] p-2 rounded-lg border border-slate-100 dark:border-[#2a3245] flex-grow">
                        {convertedAddress}
                      </span>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(convertedAddress);
                        }}
                        className="ml-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                        size="sm"
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() => {
                          setContractAddress(convertedAddress);
                          setActiveTab("contract");
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Explore This Contract
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 bg-white dark:bg-[#232b3d] p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  About Contract IDs
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Contract IDs are unique identifiers for smart contracts on the
                  Alephium blockchain. They can be converted to contract
                  addresses, which are used to interact with the contracts.
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  The contract address is derived from the contract ID using a
                  deterministic algorithm.
                </p>
              </div>

              {/* Insert the Token Converter component here below the contract ID converter */}
              <TokenConverter />
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="p-6">
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#232b3d] p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Token Explorer
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Browse and search tokens from the official Alephium token
                  list. Convert token IDs to contract addresses.
                </p>

                {/* Add the TokenConverter component in the token tab as well */}
                <TokenConverter />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
