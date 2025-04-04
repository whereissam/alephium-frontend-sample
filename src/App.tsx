import { Link, Outlet } from "@tanstack/react-router";
import {
  AlephiumWalletProvider,
  AlephiumConnectButton,
} from "@alephium/web3-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function App() {
  const displayAccount = (account: any) => {
    const address = account.address;
    return `${address?.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <AlephiumWalletProvider network="testnet">
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
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
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
