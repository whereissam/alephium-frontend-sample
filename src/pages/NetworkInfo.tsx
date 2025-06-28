import { useState, useEffect } from "react";
import { useWallet } from "@alephium/web3-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Update the interface to include currentHashrate
// Define more specific interfaces for the API responses
interface NodeInfo {
  buildInfo?: {
    releaseVersion?: string;
    commit?: string;
  };
  externalAddress?: {
    addr?: string;
    port?: number;
  };
  upnp?: boolean;
}

interface NodeVersion {
  version?: string;
}

interface ChainParams {
  networkId?: number;
  groups?: number;
  targetBlockTime?: number;
}

interface SelfClique {
  cliqueId?: string;
  synced?: boolean;
  selfReady?: boolean;
  nodes?: Array<{
    address: string;
    restPort: number;
    wsPort: number;
    minerApiPort: number;
  }>;
}

// Update the CurrentDifficulty interface to match the API response
interface CurrentDifficulty {
  difficulty?: string; // Changed from number to string
}

// Update the interface with more specific types
interface NetworkInfoState {
  nodeInfo: NodeInfo | null;
  version: NodeVersion | null;
  chainParams: ChainParams | null;
  selfClique: SelfClique | null;
  currentDifficulty: CurrentDifficulty | null;
  currentHashrate: { hashrate: string | number } | null;
  loading: boolean;
}

export function NetworkInfo() {
  const { nodeProvider } = useWallet();
  const [info, setInfo] = useState<NetworkInfoState>({
    nodeInfo: null,
    version: null,
    chainParams: null,
    selfClique: null,
    currentDifficulty: null,
    currentHashrate: null,
    loading: true,
  });

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      if (!nodeProvider) return;

      setInfo((prev) => ({ ...prev, loading: true }));

      try {
        // Fetch all the info that doesn't require parameters
        const [
          nodeInfo,
          version,
          chainParams,
          selfClique,
          currentDifficulty,
          currentHashrate,
        ] = await Promise.all([
          nodeProvider.infos.getInfosNode(),
          nodeProvider.infos.getInfosVersion(),
          nodeProvider.infos.getInfosChainParams(),
          nodeProvider.infos.getInfosSelfClique(),
          nodeProvider.infos.getInfosCurrentDifficulty(),
          nodeProvider.infos.getInfosCurrentHashrate(), // No parameter needed
        ]);

        console.log(
          "Node Info:",
          nodeInfo,
          version,
          chainParams,
          selfClique,
          currentDifficulty,
          currentHashrate
        );

        setInfo({
          nodeInfo,
          version,
          chainParams,
          selfClique,
          currentDifficulty,
          currentHashrate,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching network info:", error);
        setInfo((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchNetworkInfo();
  }, [nodeProvider]);

  // Replace the formatHashrate function with this version
  const formatHashrate = (hashrate: string | number): string => {
    // If hashrate is already a formatted string, return it directly
    if (typeof hashrate === 'string' && hashrate.includes('H/s')) {
      return hashrate;
    }
    
    // Otherwise, format it as a number
    const rate = Number(hashrate);
    if (isNaN(rate)) return "N/A";
    
    if (rate >= 1e12) return `${(rate / 1e12).toFixed(2)} TH/s`;
    if (rate >= 1e9) return `${(rate / 1e9).toFixed(2)} GH/s`;
    if (rate >= 1e6) return `${(rate / 1e6).toFixed(2)} MH/s`;
    if (rate >= 1e3) return `${(rate / 1e3).toFixed(2)} KH/s`;
    return `${rate.toFixed(2)} H/s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-600 rounded-3xl mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-50 mb-6">
            Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Status</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Real-time insights into the Alephium blockchain network</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Node Info */}
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-850/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 animate-slide-up shadow-airbnb-dark-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-50">Node Information</h3>
                <p className="text-gray-300">Connected node details</p>
              </div>
            </div>
            {info.loading ? (
              <div className="space-y-4">
                <div className="bg-gray-700/30 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-gray-600/50 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-600/30 rounded w-1/2"></div>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-gray-600/50 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-600/30 rounded w-1/3"></div>
                </div>
              </div>
            ) : info.nodeInfo ? (
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Release Version</span>
                    <span className="font-mono text-blue-400 text-sm font-bold bg-blue-500/10 px-2 py-1 rounded-lg">
                      {info.nodeInfo.buildInfo?.releaseVersion || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">Commit</span>
                    <span className="font-mono text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-lg">
                      {info.nodeInfo.buildInfo?.commit?.substring(0, 8) || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">External Address</span>
                    <span className="font-mono text-purple-400 text-sm font-bold bg-purple-500/10 px-2 py-1 rounded-lg">
                      {info.nodeInfo.externalAddress?.addr || "N/A"}:
                      {info.nodeInfo.externalAddress?.port || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-medium">UPnP</span>
                    <span className={`font-mono text-sm font-bold px-2 py-1 rounded-lg ${
                      info.nodeInfo.upnp 
                        ? "text-green-400 bg-green-500/10" 
                        : "text-red-400 bg-red-500/10"
                    }`}>
                      {info.nodeInfo.upnp ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No node information available</p>
            )}
          </div>
        </div>
        {/* Version */}
        <Card className="bg-dark-bg-tertiary border-dark-border-subtle animate-slide-up hover:bg-dark-bg-elevated transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-dark-text-primary">Version</CardTitle>
            <CardDescription className="text-dark-text-tertiary">Node version information</CardDescription>
          </CardHeader>
          <CardContent>
            {info.loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-dark-bg-secondary" />
                <Skeleton className="h-4 w-3/4 bg-dark-bg-secondary" />
              </div>
            ) : info.version ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-tertiary text-sm">Version</span>
                  <span className="font-mono text-brand-500 text-sm">{info.version.version || "N/A"}</span>
                </div>
              </div>
            ) : (
              <p className="text-dark-text-tertiary text-sm">No version information available</p>
            )}
          </CardContent>
        </Card>
        {/* Chain Parameters */}
        <Card className="bg-dark-bg-tertiary border-dark-border-subtle animate-slide-up hover:bg-dark-bg-elevated transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-dark-text-primary">Chain Parameters</CardTitle>
            <CardDescription className="text-dark-text-tertiary">Key blockchain parameters</CardDescription>
          </CardHeader>
          <CardContent>
            {info.loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-dark-bg-secondary" />
                <Skeleton className="h-4 w-3/4 bg-dark-bg-secondary" />
                <Skeleton className="h-4 w-5/6 bg-dark-bg-secondary" />
              </div>
            ) : info.chainParams ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-tertiary text-sm">Network ID</span>
                  <span className="font-mono text-brand-500 text-sm">{info.chainParams.networkId || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-tertiary text-sm">Groups</span>
                  <span className="font-mono text-brand-500 text-sm">{info.chainParams.groups || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-tertiary text-sm">Target Block Time</span>
                  <span className="font-mono text-brand-500 text-sm">
                    {info.chainParams.targetBlockTime || "N/A"} seconds
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-dark-text-tertiary text-sm">No chain parameters available</p>
            )}
          </CardContent>
        </Card>
        {/* Current Difficulty */}
        <Card className="bg-dark-bg-tertiary border-dark-border-subtle animate-slide-up hover:bg-dark-bg-elevated transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-dark-text-primary">Mining Difficulty</CardTitle>
            <CardDescription className="text-dark-text-tertiary">Current network mining difficulty</CardDescription>
          </CardHeader>
          <CardContent>
            {info.loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-dark-bg-secondary" />
                <Skeleton className="h-4 w-3/4 bg-dark-bg-secondary" />
              </div>
            ) : info.currentDifficulty ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-tertiary text-sm">Difficulty</span>
                  <span className="font-mono text-brand-500 text-sm">{info.currentDifficulty.difficulty || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-tertiary text-sm">Hash Rate</span>
                  <span className="font-mono text-brand-500 text-sm">
                    {info.currentHashrate
                      ? formatHashrate(info.currentHashrate.hashrate)
                      : "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-dark-text-tertiary text-sm">
                No difficulty information available
              </p>
            )}
          </CardContent>
        </Card>
        {/* Self Clique */}
        <Card className="md:col-span-2 bg-dark-bg-tertiary border-dark-border-subtle animate-slide-up hover:bg-dark-bg-elevated transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-dark-text-primary">Clique Information</CardTitle>
            <CardDescription className="text-dark-text-tertiary">
              Information about the node's clique
            </CardDescription>
          </CardHeader>
          <CardContent>
            {info.loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-dark-bg-secondary" />
                <Skeleton className="h-4 w-3/4 bg-dark-bg-secondary" />
                <Skeleton className="h-4 w-5/6 bg-dark-bg-secondary" />
              </div>
            ) : info.selfClique ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-tertiary text-sm">Clique ID</span>
                  <span className="font-mono text-brand-500 text-xs">
                    {info.selfClique.cliqueId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-tertiary text-sm">Status</span>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        info.selfClique.synced
                          ? "bg-brand-500/20 text-brand-500 border border-brand-500/20"
                          : "bg-dark-bg-elevated text-dark-text-tertiary border border-dark-border-default"
                      }`}
                    >
                      {info.selfClique.synced ? "Synced" : "Syncing"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        info.selfClique.selfReady
                          ? "bg-brand-500/20 text-brand-500 border border-brand-500/20"
                          : "bg-dark-bg-elevated text-dark-text-tertiary border border-dark-border-default"
                      }`}
                    >
                      {info.selfClique.selfReady ? "Ready" : "Not Ready"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-tertiary text-sm">Nodes</span>
                  <span className="font-mono text-brand-500 text-sm">{info.selfClique.nodes?.length || 0}</span>
                </div>
                {info.selfClique.nodes && info.selfClique.nodes.length > 0 && (
                  <div>
                    <span className="text-dark-text-tertiary text-sm block mb-3">Node List</span>
                    <div className="bg-dark-bg-secondary border border-dark-border-subtle p-3 rounded-md max-h-40 overflow-y-auto">
                      {info.selfClique.nodes.map((node, index: number) => (
                        <div key={index} className="text-xs font-mono text-dark-text-tertiary mb-2 last:mb-0">
                          {node.address}:{node.restPort} (REST) | {node.wsPort}{" "}
                          (WS) | {node.minerApiPort} (Miner)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-dark-text-tertiary text-sm">No clique information available</p>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}

export default NetworkInfo;