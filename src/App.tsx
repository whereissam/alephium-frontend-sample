import { Outlet } from "@tanstack/react-router";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";

export function App() {
  const [network, setNetwork] = useState<"testnet" | "mainnet" | "devnet">(
    "testnet"
  );

  const displayAccount = (account: any) => {
    const address = account.address;
    return `${address?.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleNetworkChange = (
    newNetwork: "testnet" | "mainnet" | "devnet"
  ) => {
    setNetwork(newNetwork);
  };

  return (
    <AlephiumWalletProvider network={network}>
      <div className="min-h-screen bg-gray-950">
        <Navbar 
          network={network}
          onNetworkChange={handleNetworkChange}
          displayAccount={displayAccount}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </AlephiumWalletProvider>
  );
}

export default App;