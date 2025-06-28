import { Link } from "@tanstack/react-router";
import { AlephiumConnectButton } from "@alephium/web3-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";

interface NavbarProps {
  network: "testnet" | "mainnet" | "devnet";
  onNetworkChange: (network: "testnet" | "mainnet" | "devnet") => void;
  displayAccount: (account: any) => string;
}

export function Navbar({ network, onNetworkChange, displayAccount }: NavbarProps) {

  return (
    <nav className="w-full bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/20 relative z-50">
      {/* Centered Container - NOT full width */}
      <div className="max-w-5xl mx-auto px-8 py-4">
        <div className="flex items-center justify-start space-x-12 relative pointer-events-auto">
          
          {/* Left Section - Brand Identity */}
          <Link to="/" className="flex items-center group transition-all duration-200 hover:scale-105">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:from-blue-300 group-hover:to-purple-500 transition-all duration-200 shadow-lg">
              <img
                src="https://avatars.githubusercontent.com/u/38327433?s=280&v=4"
                className="w-6 h-6 rounded-lg"
                alt="Alephium"
              />
            </div>
          </Link>

          {/* Center Section - Primary Navigation */}
          <div className="flex items-center space-x-8 relative z-20">
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors hover:bg-gray-800/30 px-3 py-2 rounded"
            >
              About
            </Link>
            <Link 
              to="/transaction" 
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors hover:bg-gray-800/30 px-3 py-2 rounded"
            >
              Send
            </Link>
            <Link 
              to="/network-info" 
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors hover:bg-gray-800/30 px-3 py-2 rounded"
            >
              Network
            </Link>
            <Link 
              to="/contract-explorer" 
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors hover:bg-gray-800/30 px-3 py-2 rounded"
            >
              Explorer
            </Link>
          </div>

          {/* Spacer to push right section to the end */}
          <div className="flex-1"></div>

          {/* Right Section - Utility/External Links */}
          <div className="flex items-center space-x-6">
            {/* Network Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-xs font-medium cursor-pointer transition-colors">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      network === "mainnet"
                        ? "bg-green-500"
                        : network === "testnet"
                          ? "bg-yellow-500"
                          : "bg-purple-500"
                    }`}
                  />
                  <span className="uppercase tracking-wider">{network}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-lg rounded-lg"
              >
                <DropdownMenuItem 
                  onClick={() => onNetworkChange("mainnet")} 
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Mainnet</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onNetworkChange("testnet")} 
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Testnet</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onNetworkChange("devnet")} 
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Devnet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Connection */}
            <div className="text-gray-400 hover:text-gray-300 transition-colors">
              <AlephiumConnectButton 
                displayAccount={displayAccount}
                className="!bg-transparent !border-none !text-gray-400 hover:!text-gray-300 !text-xs !font-medium !p-0 transition-colors cursor-pointer"
              />
            </div>

            {/* Social/Utility Icons */}
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 text-gray-500 hover:text-gray-400 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <svg className="w-4 h-4 text-gray-500 hover:text-gray-400 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>

            {/* Close/X Icon */}
            <button className="text-gray-500 hover:text-gray-400 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}