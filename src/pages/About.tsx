export function About() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">About Alephium</h1>
      
      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">What is Alephium?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Alephium is a Layer 1 (L1) blockchain designed to address key challenges faced by decentralized applications (dApps), 
            such as scalability, security, and energy efficiency. It builds on Bitcoin's foundational technologies—Proof of Work (PoW) 
            and the Unspent Transaction Output (UTXO) model—while introducing innovative features to enhance performance and usability.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">BlockFlow Sharding</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At its core, Alephium uses a sharding technique called BlockFlow, which splits the blockchain into smaller, 
              manageable segments (shards) to process transactions in parallel. This allows the network to achieve a high throughput, 
              reportedly supporting over 10,000 transactions per second, far surpassing Bitcoin's capacity.
            </p>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Proof of Less Work (PoLW)</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Alephium introduces a unique consensus mechanism called Proof of Less Work (PoLW), which reduces energy consumption 
              significantly—using about one-eighth the energy of traditional PoW systems like Bitcoin under similar conditions. 
              This is achieved by dynamically adjusting mining difficulty based on network conditions.
            </p>
          </section>
        </div>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Smart Contracts & Alphred VM</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The platform includes a custom virtual machine called Alphred, optimized for secure and efficient smart contract execution, 
            supporting decentralized finance (DeFi) and dApps. Its design aims to mitigate common vulnerabilities like reentrancy attacks 
            and flash loan exploits, while fostering a developer-friendly environment with its own programming language, Ralph.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">ALPH Token</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Launched in November 2021, Alephium's native token, ALPH, has a total supply capped at 1 billion, with a portion allocated 
            for mining rewards over approximately 80 years and the rest distributed through presales, ecosystem development, and team allocations. 
            It's positioned as a scalable, secure, and decentralized solution for real-world blockchain applications.
          </p>
        </section>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>This is a template for Alephium frontend development.</p>
      </div>
    </div>
  );
}
