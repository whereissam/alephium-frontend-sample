import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useWallet, useBalance } from "@alephium/web3-react";

type TxStatus = "none" | "pending" | "confirmed" | "failed";

interface TxDetails {
  txId: string;
  status: TxStatus;
  confirmations?: number;
  blockHash?: string;
  timestamp?: number;
  chainFrom?: number;
  chainTo?: number;
  height?: number;
}

export function Transaction() {
  const { toast } = useToast();
  const { signer, account, nodeProvider } = useWallet();
  const { balance, updateBalanceForTx } = useBalance();
  const [receiverAddress, setReceiverAddress] = useState(
    "13wDSTZZLKouRN6ksZx5FYvyghRZC8nrCNQrvC1HRHZL8"
  );
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txDetails, setTxDetails] = useState<TxDetails | null>(null);

  // Poll for transaction status updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (txDetails && txDetails.status === "pending" && nodeProvider) {
      intervalId = setInterval(async () => {
        try {
          // Get transaction status
          const status = await nodeProvider.transactions.getTransactionsStatus({
            txId: txDetails.txId,
          });

          // Check if the status is "Confirmed"
          if (status.type === "Confirmed") {
            const confirmedStatus = status as {
              type: string;
              blockHash: string;
            };

            // Get additional block information
            const blockflowInfo =
              await nodeProvider.blockflow.getBlockflowBlocksBlockHash(
                confirmedStatus.blockHash
              );

            // Update transaction details with block information
            setTxDetails({
              ...txDetails,
              status: "confirmed",
              blockHash: blockflowInfo.hash,
              timestamp: blockflowInfo.timestamp,
              chainFrom: blockflowInfo.chainFrom,
              chainTo: blockflowInfo.chainTo,
              height: blockflowInfo.height,
            });

            const updateinfo = updateBalanceForTx(txDetails.txId);
            console.log("updateinfo", updateinfo);

            toast({
              title: "Transaction confirmed",
              variant: "default",
            });

            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Error checking transaction status:", error);
          // If we can't get the status after multiple attempts, mark as failed
          const errorResponse = error as { status?: number };
          if (errorResponse?.status === 404 && txDetails.status === "pending") {
            setTxDetails({
              ...txDetails,
              status: "failed",
            });

            toast({
              title: "Transaction failed",
              description: "Transaction could not be found on the network",
              variant: "destructive",
            });

            clearInterval(intervalId);
          }
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [txDetails, nodeProvider, toast, updateBalanceForTx]);

  const handleSendTransaction = async () => {
    if (!signer || !account || !nodeProvider) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!receiverAddress) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid receiver address",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Convert amount to BigInt (ALPH has 18 decimals)
      const amountInAttoAlph = BigInt(Math.floor(parseFloat(amount) * 1e18));

      // Use signAndSubmitTransferTx directly instead of building and signing separately
      const result = await signer.signAndSubmitTransferTx({
        signerAddress: account.address,
        destinations: [
          {
            address: receiverAddress,
            attoAlphAmount: amountInAttoAlph,
          },
        ],
      });

      // Set transaction details with pending status
      setTxDetails({
        txId: result.txId,
        status: "pending",
      });

      toast({
        title: "Transaction submitted",
        description: `Transaction ID: ${result.txId}`,
      });

      // Reset form
      setReceiverAddress("");
      setAmount("");
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    console.log("Handle max click, balance:", balance);

    // Direct check of the balanceHint (we know the structure from console log)
    if (balance?.balanceHint) {
      const balanceValue = balance.balanceHint.split(" ")[0]; // "0.552 ALPH" -> "0.552"

      if (balanceValue) {
        try {
          // Subtract a small amount for gas
          const numericBalance = parseFloat(balanceValue);
          const maxWithGas = Math.max(0, numericBalance - 0.01).toFixed(6);
          console.log(
            "Setting max amount:",
            maxWithGas,
            "from balanceHint:",
            balanceValue
          );

          // Directly set the amount state
          setAmount(maxWithGas);
        } catch (err) {
          console.error("Error parsing balance:", err);
          // Fallback: use the raw value
          setAmount(balanceValue);
        }
      }
    } else {
      console.log("No balance hint available");
      // Alternative: try with balance directly if balanceHint is not available
      if (balance?.balance) {
        const rawBalance = balance.balance;
        // Convert from base units (18 decimals)
        const convertedBalance = (parseInt(rawBalance) / 1e18).toFixed(6);
        const maxWithGas = Math.max(
          0,
          parseFloat(convertedBalance) - 0.01
        ).toFixed(6);
        console.log(
          "Using raw balance:",
          rawBalance,
          "converted:",
          convertedBalance,
          "max:",
          maxWithGas
        );
        setAmount(maxWithGas);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-50 mb-4 sm:mb-6">
            Send <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ALPH</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-md mx-auto px-4">Transfer tokens with lightning speed across the Alephium network</p>
          
          {/* Wallet Connection Notice */}
          {!account && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl max-w-sm mx-auto">
              <p className="text-yellow-300 text-sm font-medium">
                💡 Connect your wallet first to send transactions
              </p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-airbnb-dark-lg animate-slide-up">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <Label
                  htmlFor="receiver-address"
                  className="text-gray-100 text-sm font-semibold"
                >
                  Receiver Address
                </Label>
              </div>
              <Input
                id="receiver-address"
                placeholder="Enter wallet address..."
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                className="bg-gray-900/50 border-gray-600/50 h-14 font-mono text-sm text-gray-100 placeholder:text-gray-400 hover:border-blue-500/50 focus:border-blue-500 transition-all duration-300 rounded-xl backdrop-blur-sm"
              />
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <Label htmlFor="amount" className="text-gray-100 text-sm font-semibold">
                  Amount
                </Label>
              </div>
              <div className="relative rounded-xl bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-gray-600/50 hover:border-blue-500/50 focus-within:border-blue-500 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                <div className="relative flex items-center">
                  <input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-20 pl-6 pr-20 text-4xl font-light outline-none border-none bg-transparent text-gray-100 placeholder:text-gray-500"
                  />
                  <div className="absolute right-6 flex items-center">
                    <div className="text-lg text-gray-300 font-bold tracking-wide">
                      ALPH
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 space-y-3 sm:space-y-0">
                <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm text-center sm:text-left">
                  ≈ ${amount ? (parseFloat(amount) * 0.12).toFixed(2) : "0.00"} USD
                </span>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span className="text-sm text-gray-300 font-mono bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm text-center">
                    Balance: {balance?.balanceHint || "0 ALPH"}
                  </span>
                  <button
                    type="button"
                    onClick={handleMaxClick}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer w-full sm:w-auto"
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSendTransaction}
              disabled={isLoading || !receiverAddress || !amount}
              className="relative w-full h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending Transaction...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send Tokens</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Transaction Status Section */}
        {txDetails && (
          <div className="mt-8 bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-airbnb-dark-lg animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-50 mb-6">Transaction Status</h2>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">
                  Transaction ID
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-sm text-blue-400 cursor-help bg-gray-900/50 px-3 py-1 rounded-lg"
                    title={txDetails.txId}
                  >
                    {txDetails.txId.substring(0, 8)}...
                    {txDetails.txId.substring(txDetails.txId.length - 8)}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(txDetails.txId);
                      toast({
                        title: "Copied to clipboard",
                        description: "Transaction ID has been copied",
                        variant: "default",
                      });
                    }}
                    className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title="Copy transaction ID"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">Status</span>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                    txDetails.status === "confirmed"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : txDetails.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {txDetails.status.charAt(0).toUpperCase() +
                    txDetails.status.slice(1)}
                </span>
              </div>

              {/* Transaction details for confirmed transactions */}
              {txDetails.status === "confirmed" && (
                <>
                  {txDetails.blockHash && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        Block Hash
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-xs text-blue-400 cursor-help"
                          title={txDetails.blockHash}
                        >
                          {txDetails.blockHash.substring(0, 8)}...
                          {txDetails.blockHash.substring(
                            txDetails.blockHash.length - 8
                          )}
                        </span>
                        <button
                          onClick={() => {
                            if (txDetails.blockHash) {
                              navigator.clipboard.writeText(txDetails.blockHash);
                              toast({
                                title: "Copied to clipboard",
                                description: "Block hash has been copied",
                                variant: "default",
                              });
                            }
                          }}
                          className="p-1 rounded-md hover:bg-gray-700/50 transition-colors"
                          title="Copy block hash"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {txDetails.timestamp && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        Timestamp
                      </span>
                      <span className="text-sm font-mono text-blue-400">
                        {new Date(txDetails.timestamp).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {txDetails.height !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        Block Height
                      </span>
                      <span className="text-sm font-mono text-blue-400">
                        {txDetails.height.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {txDetails.chainFrom !== undefined &&
                    txDetails.chainTo !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          Chain
                        </span>
                        <span className="text-sm font-mono text-blue-400">
                          {txDetails.chainFrom} → {txDetails.chainTo}
                        </span>
                      </div>
                    )}
                </>
              )}

              <div className="pt-4 border-t border-gray-700/50">
                <a
                  href={`https://testnet.alephium.org/transactions/${txDetails.txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/20"
                >
                  <span>View on Explorer</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transaction;