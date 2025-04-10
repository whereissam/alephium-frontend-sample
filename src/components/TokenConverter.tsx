import { useState, useEffect } from "react";
import { useWallet } from "@alephium/web3-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { addressFromContractId, NetworkId } from "@alephium/web3";
import { Search } from "lucide-react";

interface Token {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  logoURI: string;
}

interface TokenList {
  networkId: number;
  tokens: Token[];
}

export default function TokenConverter() {
  const { account } = useWallet();
  const network = account?.network || "mainnet";

  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenAddresses, setTokenAddresses] = useState<Record<string, string>>(
    {}
  );
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTokenList();
  }, [network]);

  useEffect(() => {
    if (tokens.length > 0 && searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = tokens.filter(
        (token) =>
          token.symbol.toLowerCase().includes(lowercaseQuery) ||
          token.name.toLowerCase().includes(lowercaseQuery) ||
          token.id.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredTokens(filtered);
    } else {
      setFilteredTokens(tokens);
    }
  }, [tokens, searchQuery]);

  const fetchTokenList = async () => {
    setLoading(true);
    setError("");

    try {
      // Use the connected wallet's network to determine which token list to fetch
      const networkName = (network as NetworkId).toLowerCase();
      const url = `https://raw.githubusercontent.com/alephium/token-list/master/tokens/${networkName}.json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch token list: ${response.statusText}`);
      }

      const data = (await response.json()) as TokenList;
      setTokens(data.tokens);

      // Precompute all token addresses
      const addresses: Record<string, string> = {};
      data.tokens.forEach((token) => {
        try {
          addresses[token.id] = addressFromContractId(token.id);
        } catch (e) {
          console.error(`Failed to convert token ID ${token.id}:`, e);
        }
      });

      setTokenAddresses(addresses);
    } catch (error) {
      console.error("Error fetching token list:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
    setSearchQuery(""); // Clear search after selection
  };

  return (
    <div className="mt-6 bg-white dark:bg-[#232b3d] p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Token ID to Address Converter
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
            Search Token ({network} network)
          </Label>
          <Button
            onClick={fetchTokenList}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Refresh Token List
          </Button>
        </div>
        <div className="relative">
          <Input
            id="token-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, symbol or ID..."
            className="bg-white dark:bg-[#131825] border-slate-200 dark:border-[#2a3245] pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3 mt-2">
            <Skeleton className="h-12 w-full rounded-lg bg-slate-200 dark:bg-[#2a3245]" />
            <Skeleton className="h-12 w-full rounded-lg bg-slate-200 dark:bg-[#2a3245]" />
            <Skeleton className="h-12 w-full rounded-lg bg-slate-200 dark:bg-[#2a3245]" />
          </div>
        ) : (
          <div className="mt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex justify-between">
              <span>Token List</span>
              <Badge variant="outline" className="font-normal">
                {filteredTokens.length} tokens
              </Badge>
            </div>
            <div className="max-h-64 overflow-y-auto border border-slate-200 dark:border-[#2a3245] rounded-lg">
              {filteredTokens.length > 0 ? (
                <div className="divide-y divide-slate-200 dark:divide-[#2a3245]">
                  {filteredTokens.map((token) => (
                    <div
                      key={token.id}
                      onClick={() => handleSelectToken(token)}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-[#1a2235] cursor-pointer flex items-center"
                    >
                      {token.logoURI ? (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-6 h-6 mr-3 rounded-full bg-white"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/api/placeholder/24/24";
                          }}
                        />
                      ) : (
                        <div className="w-6 h-6 mr-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-300">
                          {token.symbol.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {token.symbol}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 truncate ml-2">
                            {token.id.substring(0, 8)}...
                            {token.id.substring(token.id.length - 8)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {token.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                  No tokens found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}

        {selectedToken && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-[#1a2235] rounded-lg border border-slate-200 dark:border-[#2a3245]">
            <div className="flex items-center mb-3">
              {selectedToken.logoURI && (
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="w-8 h-8 mr-3 rounded-full bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/api/placeholder/32/32";
                  }}
                />
              )}
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {selectedToken.name}
                  <Badge className="ml-2 font-normal">
                    {selectedToken.symbol}
                  </Badge>
                </h4>
                {selectedToken.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {selectedToken.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                  Token ID
                </Label>
                <div className="flex items-center">
                  <Input
                    readOnly
                    value={selectedToken.id}
                    className="font-mono text-xs bg-white dark:bg-[#131825] border-slate-200 dark:border-[#2a3245]"
                  />
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(selectedToken.id)
                    }
                    className="ml-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                    size="sm"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                  Contract Address
                </Label>
                <div className="flex items-center">
                  <Input
                    readOnly
                    value={
                      tokenAddresses[selectedToken.id] || "Conversion failed"
                    }
                    className="font-mono text-xs bg-white dark:bg-[#131825] border-slate-200 dark:border-[#2a3245]"
                  />
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        tokenAddresses[selectedToken.id] || ""
                      )
                    }
                    className="ml-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                    size="sm"
                    disabled={!tokenAddresses[selectedToken.id]}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                    Decimals
                  </Label>
                  <Input
                    readOnly
                    value={selectedToken.decimals}
                    className="bg-white dark:bg-[#131825] border-slate-200 dark:border-[#2a3245]"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                    Network
                  </Label>
                  <Input
                    readOnly
                    value={network.charAt(0).toUpperCase() + network.slice(1)}
                    className="bg-white dark:bg-[#131825] border-slate-200 dark:border-[#2a3245]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
