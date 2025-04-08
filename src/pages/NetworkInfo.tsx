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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Alephium Network Information
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Node Info */}
        <Card>
          <CardHeader>
            <CardTitle>Node Information</CardTitle>
            <CardDescription>
              Basic information about the connected node
            </CardDescription>
          </CardHeader>
          <CardContent>
            {info.loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : info.nodeInfo ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Release Version:</span>
                  <span>
                    {info.nodeInfo.buildInfo?.releaseVersion || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Commit:</span>
                  <span className="font-mono text-xs">
                    {info.nodeInfo.buildInfo?.commit?.substring(0, 8) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">External Address:</span>
                  <span>
                    {info.nodeInfo.externalAddress?.addr || "N/A"}:
                    {info.nodeInfo.externalAddress?.port || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">UPnP:</span>
                  <span>{info.nodeInfo.upnp ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No node information available</p>
            )}
          </CardContent>
        </Card>
        {/* Version */}
        <Card>
          <CardHeader>
            <CardTitle>Version</CardTitle>
            <CardDescription>Node version information</CardDescription>
          </CardHeader>
          <CardContent>
            {info.loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : info.version ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Version:</span>
                  <span>{info.version.version || "N/A"}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No version information available</p>
            )}
          </CardContent>
        </Card>
        {/* Chain Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Chain Parameters</CardTitle>
            <CardDescription>Key blockchain parameters</CardDescription>
          </CardHeader>
          <CardContent>
            {info.loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : info.chainParams ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Network ID:</span>
                  <span>{info.chainParams.networkId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Groups:</span>
                  <span>{info.chainParams.groups || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Target Block Time:</span>
                  <span>
                    {info.chainParams.targetBlockTime || "N/A"} seconds
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No chain parameters available</p>
            )}
          </CardContent>
        </Card>
        {/* Current Difficulty */}
        <Card>
          <CardHeader>
            <CardTitle>Mining Difficulty</CardTitle>
            <CardDescription>Current network mining difficulty</CardDescription>
          </CardHeader>
          <CardContent>
            {info.loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : info.currentDifficulty ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Difficulty:</span>
                  <span>{info.currentDifficulty.difficulty || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Hash Rate:</span>
                  <span>
                    {info.currentHashrate
                      ? formatHashrate(info.currentHashrate.hashrate)
                      : "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                No difficulty information available
              </p>
            )}
          </CardContent>
        </Card>
        {/* Self Clique */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Clique Information</CardTitle>
            <CardDescription>
              Information about the node's clique
            </CardDescription>
          </CardHeader>
          <CardContent>
            {info.loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : info.selfClique ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Clique ID:</span>
                  <span className="font-mono text-sm">
                    {info.selfClique.cliqueId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        info.selfClique.synced
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {info.selfClique.synced ? "Synced" : "Syncing"}
                    </span>{" "}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        info.selfClique.selfReady
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {info.selfClique.selfReady ? "Ready" : "Not Ready"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Nodes:</span>
                  <span>{info.selfClique.nodes?.length || 0}</span>
                </div>
                {info.selfClique.nodes && info.selfClique.nodes.length > 0 && (
                  <div>
                    <span className="font-medium block mb-2">Node List:</span>
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md max-h-40 overflow-y-auto">
                      {info.selfClique.nodes.map((node, index: number) => (
                        <div key={index} className="text-sm font-mono mb-1">
                          {node.address}:{node.restPort} (REST) | {node.wsPort}{" "}
                          (WS) | {node.minerApiPort} (Miner)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No clique information available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NetworkInfo;
