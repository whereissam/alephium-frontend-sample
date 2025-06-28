export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-50 mb-4 sm:mb-6 px-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Alephium</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">The next-generation blockchain powering decentralized applications</p>
        </div>
        
        <div className="space-y-6 sm:space-y-8">
          {/* Main Introduction */}
          <section className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 animate-slide-up shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-50">What is Alephium?</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                Alephium is a Layer 1 (L1) blockchain designed to address key challenges faced by decentralized applications (dApps), 
                such as scalability, security, and energy efficiency. It builds on Bitcoin's foundational technologies—Proof of Work (PoW) 
                and the Unspent Transaction Output (UTXO) model—while introducing innovative features to enhance performance and usability.
              </p>
            </div>
          </section>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <section className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 animate-slide-up shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-50">BlockFlow Sharding</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  At its core, Alephium uses a sharding technique called BlockFlow, which splits the blockchain into smaller, 
                  manageable segments (shards) to process transactions in parallel. This allows the network to achieve a high throughput, 
                  reportedly supporting over <span className="text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded-lg">10,000+ TPS</span>, far surpassing Bitcoin's capacity.
                </p>
              </div>
            </section>

            <section className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 animate-slide-up shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-50">Proof of Less Work</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Alephium introduces a unique consensus mechanism called Proof of Less Work (PoLW), which reduces energy consumption 
                  significantly—using about <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-1 rounded-lg">1/8th the energy</span> of traditional PoW systems like Bitcoin under similar conditions. 
                  This is achieved by dynamically adjusting mining difficulty based on network conditions.
                </p>
              </div>
            </section>
          </div>

          {/* Technical Details */}
          <section className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 animate-slide-up shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-50">Smart Contracts & Alphred VM</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The platform includes a custom virtual machine called <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded-lg">Alphred</span>, optimized for secure and efficient smart contract execution, 
                supporting decentralized finance (DeFi) and dApps. Its design aims to mitigate common vulnerabilities like reentrancy attacks 
                and flash loan exploits, while fostering a developer-friendly environment with its own programming language, <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded-lg">Ralph</span>.
              </p>
            </div>
          </section>

          {/* Token Information */}
          <section className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 animate-slide-up shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-50">ALPH Token</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Launched in November 2021, Alephium's native token, <span className="text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded-lg">ALPH</span>, has a total supply capped at 
                <span className="text-orange-400 font-bold bg-orange-500/10 px-2 py-1 rounded-lg"> 1 billion</span>, with a portion allocated 
                for mining rewards over approximately 80 years and the rest distributed through presales, ecosystem development, and team allocations. 
                It's positioned as a scalable, secure, and decentralized solution for real-world blockchain applications.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-center animate-fade-in">
          <p className="text-gray-500 text-sm bg-gray-800/30 px-4 py-2 rounded-full inline-block backdrop-blur-sm">Template for Alephium frontend development</p>
        </div>
      </div>
    </div>
  );
}