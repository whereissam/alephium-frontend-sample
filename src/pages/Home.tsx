import { Button } from "@/components/ui/button";
import {
  AlephiumConnectButton,
  useWallet,
  useBalance,
  useWalletConfig,
} from "@alephium/web3-react";

// Wallet balance display component
function WalletBalance() {
  const { connectionStatus } = useWallet();
  const { balance } = useBalance();

  if (connectionStatus !== "connected") {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm text-center">
        <p className="text-gray-500 dark:text-gray-400">Connect wallet to see balance</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Wallet Balance
      </h3>
      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
        {balance?.balanceHint || "Loading..."}
      </p>
    </div>
  );
}

// Network and Address Group Info component
function NetworkInfo() {
  const { network, addressGroup } = useWalletConfig();
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Network Configuration
      </h3>
      <div className="space-y-2">
        <p className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Network:</span>
          <span className="font-medium text-indigo-600 dark:text-indigo-400 capitalize">{network}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Address Group:</span>
          <span className="font-medium text-indigo-600 dark:text-indigo-400">{addressGroup !== undefined ? addressGroup : 'Any'}</span>
        </p>
      </div>
    </div>
  );
}

// Custom connect button component
function CustomConnectButton() {
  return (
    <AlephiumConnectButton.Custom>
      {({ isConnected, disconnect, show, account }) => {
        return isConnected ? (
          <div className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="font-medium dark:text-gray-200">
                Connected:{" "}
                {account
                  ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
                  : ""}
              </p>
            </div>
            <Button
              onClick={disconnect}
              variant="destructive"
              className="w-full mt-2"
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Button
              onClick={show}
              variant="default"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Connect Wallet
            </Button>
          </div>
        );
      }}
    </AlephiumConnectButton.Custom>
  );
}

export function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-center items-center gap-8 mb-8">
        <a
          href="https://alephium.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-110"
        >
          <img
            src={"https://avatars.githubusercontent.com/u/38327433?s=280&v=4"}
            className="h-16 w-16"
            alt="Alephium logo"
          />
        </a>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
        Alephium
      </h1>

      {/* Wallet Connection Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <CustomConnectButton />
        <WalletBalance />
      </div>
      
      {/* Network Info Section */}
      <div className="mb-10">
        <NetworkInfo />
      </div>
    </div>
  );
}
