import { Link, Outlet } from "@tanstack/react-router";
import {
  AlephiumWalletProvider,
  AlephiumConnectButton,
} from "@alephium/web3-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function App() {
  const [network, setNetwork] = useState<"testnet" | "mainnet" | "devnet">(
    "testnet"
  );

  const displayAccount = (account: any) => {
    const address = account.address;
    return `${address?.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleNetworkChange = (
    newNetwork: "testnet" | "mainnet" | "devnet"
  ) => {
    setNetwork(newNetwork);
    // You might want to add additional logic here, like disconnecting wallet when changing networks
  };

  return (
    <AlephiumWalletProvider network={network}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        <nav className="bg-gray-800 dark:bg-gray-950 text-white p-4">
          <div className="container mx-auto flex justify-between items-center max-w-4xl">
            <div className="flex gap-4">
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
              <Link to="/about" className="hover:text-gray-300">
                About
              </Link>
              <Link to="/transaction" className="hover:text-gray-300">
                Transaction
              </Link>
              <Link to="/network-info" className="hover:text-gray-300">
                Network Info
              </Link>
              <Link to="/contract-explorer" className="hover:text-gray-300">
                Contract Explorer
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {/* Network Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 flex items-center gap-2 bg-gray-700 border-gray-500 hover:bg-gray-600 text-white"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        network === "mainnet"
                          ? "bg-green-400"
                          : network === "testnet"
                            ? "bg-yellow-400"
                            : "bg-purple-400"
                      }`}
                    />
                    <span className="capitalize">{network}</span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border border-gray-600 text-white">
                  <DropdownMenuItem
                    onClick={() => handleNetworkChange("mainnet")}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span>Mainnet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNetworkChange("testnet")}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                  >
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span>Testnet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNetworkChange("devnet")}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                    <span>Devnet</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlephiumConnectButton displayAccount={displayAccount} />
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4 max-w-4xl">
          <Outlet />
        </main>
      </div>
    </AlephiumWalletProvider>
  );
}

export default App;
