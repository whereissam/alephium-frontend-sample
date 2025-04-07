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
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
        Send ALPH Tokens
      </h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="receiver-address"
            className="text-gray-700 dark:text-gray-300"
          >
            Receiver Address
          </Label>
          <Input
            id="receiver-address"
            placeholder="Enter receiver address"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600 h-12"
          />
        </div>

        {/* Amount Input - Styled like the images */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">
            Amount (ALPH)
          </Label>
          <div className="rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-16 pl-4 pr-16 text-4xl font-light outline-none border-none bg-transparent dark:text-gray-200"
              />
              <div className="flex items-center pr-4">
                <div className="text-xl text-gray-500 dark:text-gray-400 mr-2">
                  ALPH
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ${amount ? (parseFloat(amount) * 0.12).toFixed(2) : "0"}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {balance?.balanceHint || "0 ALPH"}
              </span>
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
              >
                Max
              </button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSendTransaction}
          disabled={isLoading || !receiverAddress || !amount}
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isLoading ? "Sending..." : "Send Tokens"}
        </Button>
      </div>

      {/* Transaction Status Section */}
      {txDetails && (
        <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Transaction Status</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Transaction ID:
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-sm cursor-help"
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
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Copy transaction ID"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500 dark:text-gray-400"
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
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  txDetails.status === "confirmed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : txDetails.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {txDetails.status.charAt(0).toUpperCase() +
                  txDetails.status.slice(1)}
              </span>
            </div>

            {/* Transaction details remain unchanged */}
            {txDetails.status === "confirmed" && (
              <>
                {txDetails.blockHash && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Block Hash:
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-sm cursor-help"
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
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Copy block hash"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-500 dark:text-gray-400"
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
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Timestamp:
                    </span>
                    <span className="text-sm">
                      {new Date(txDetails.timestamp).toLocaleString()}
                    </span>
                  </div>
                )}

                {txDetails.height !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Block Height:
                    </span>
                    <span className="text-sm">
                      {txDetails.height.toLocaleString()}
                    </span>
                  </div>
                )}

                {txDetails.chainFrom !== undefined &&
                  txDetails.chainTo !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Chain:
                      </span>
                      <span className="text-sm">
                        {txDetails.chainFrom} → {txDetails.chainTo}
                      </span>
                    </div>
                  )}
              </>
            )}

            <div className="mt-2">
              <a
                href={`https://testnet.alephium.org/transactions/${txDetails.txId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View on Explorer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transaction;
