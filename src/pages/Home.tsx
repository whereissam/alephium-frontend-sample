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
      <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-50 mb-4">Connect Your Wallet</h3>
          <p className="text-gray-300 leading-relaxed">
            Connect your wallet to see your balance and start using Alephium
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-50">Wallet Balance</h3>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <p className="text-4xl font-bold text-gray-50 font-mono">
            {balance?.balanceHint || "Loading..."}
          </p>
          <p className="text-gray-300">Available balance</p>
        </div>
      </div>
    </div>
  );
}

// Network configuration card
function NetworkInfo() {
  const { network, addressGroup } = useWalletConfig();

  return (
    <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative">
        <h3 className="text-xl font-bold text-gray-50 mb-6">Network Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-700/30">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300 font-medium">Network</span>
            </div>
            <span className="text-gray-100 font-mono text-sm capitalize px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300">
              {network}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-700/30">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-300 font-medium">Address Group</span>
            </div>
            <span className="text-gray-100 font-mono text-sm px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300">
              {addressGroup !== undefined ? addressGroup : "Any"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom connect button
function CustomConnectButton() {
  return (
    <AlephiumConnectButton.Custom>
      {({ isConnected, disconnect, show, account }) => {
        return isConnected ? (
          <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-50">Connected</h3>
                  <p className="text-gray-300">Wallet is ready to use</p>
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-2xl p-4 mb-6 border border-gray-700/30">
                <p className="text-gray-400 text-sm mb-2">Address</p>
                <p className="font-mono text-gray-100 text-sm break-all">
                  {account
                    ? `${account.address.slice(0, 12)}...${account.address.slice(-12)}`
                    : ""}
                </p>
              </div>
              <Button
                onClick={disconnect}
                variant="destructive"
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-50 mb-4">Connect Wallet</h3>
              <p className="text-gray-300 leading-relaxed">Get started by connecting your Alephium wallet</p>
            </div>
            <Button
              onClick={show}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/6 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/6 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-green-400 rounded-3xl mb-8 shadow-2xl">
              <img
                src="https://avatars.githubusercontent.com/u/38327433?s=280&v=4"
                className="w-16 h-16 rounded-2xl"
                alt="Alephium"
              />
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold text-gray-50 mb-8 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-green-400">Alephium</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The next-generation blockchain powering the future of decentralized applications with unprecedented speed and efficiency.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 text-blue-300 rounded-2xl text-lg font-semibold backdrop-blur-sm">
                ⚡ 10,000+ TPS
              </span>
              <span className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-300 rounded-2xl text-lg font-semibold backdrop-blur-sm">
                🌱 Energy Efficient
              </span>
              <span className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 text-purple-300 rounded-2xl text-lg font-semibold backdrop-blur-sm">
                🔒 Secure by Design
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left Side - Wallet Connection (half height) */}
          <div className="lg:col-span-1">
            <CustomConnectButton />
          </div>
          
          {/* Right Side - Balance and Network Info (full height) */}
          <div className="lg:col-span-1 space-y-8">
            <WalletBalance />
            <NetworkInfo />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-50 mb-4">Lightning Fast</h3>
              <p className="text-gray-300 leading-relaxed">Experience blazing fast transactions with our optimized blockchain technology and BlockFlow sharding architecture.</p>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-50 mb-4">Secure & Reliable</h3>
              <p className="text-gray-300 leading-relaxed">Built with security-first principles and battle-tested cryptographic algorithms ensuring maximum protection.</p>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-50 mb-4">Developer Friendly</h3>
              <p className="text-gray-300 leading-relaxed">Comprehensive tools and documentation to build amazing dApps with Ralph programming language and Alphred VM.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}