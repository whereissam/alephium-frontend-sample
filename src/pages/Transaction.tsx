import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@alephium/web3-react";

type TxStatus = "none" | "pending" | "confirmed" | "failed";

interface TxDetails {
  txId: string;
  status: TxStatus;
  confirmations?: number;
  blockHash?: string;
  timestamp?: number;
}

export function Transaction() {
  const { toast } = useToast();
  const { signer, account, nodeProvider } = useWallet();
  const [receiverAddress, setReceiverAddress] = useState("");
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

          if (status.type === "Confirmed") {
            setTxDetails({
              ...txDetails,
              status: "confirmed",
            });

            toast({
              title: "Transaction confirmed",
              variant: "default",
            });

            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Error checking transaction status:", error);
          // If we can't get the status after multiple attempts, mark as failed
          if (
            (error as any)?.status === 404 &&
            txDetails.status === "pending"
          ) {
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
  }, [txDetails, nodeProvider, toast]);

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

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
        Send ALPH Tokens
      </h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="receiver-address">Receiver Address</Label>
          <Input
            id="receiver-address"
            placeholder="Enter receiver address"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ALPH)</Label>
          <Input
            id="amount"
            type="number"
            step="0.000001"
            min="0"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <Button
          onClick={handleSendTransaction}
          disabled={isLoading || !receiverAddress || !amount}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
              <span 
                className="font-mono text-sm cursor-help" 
                title={txDetails.txId}
              >
                {txDetails.txId.substring(0, 8)}...{txDetails.txId.substring(txDetails.txId.length - 8)}
              </span>
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
