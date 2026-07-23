import { useCallback, useEffect, useState } from "react";

import { networkService } from "../services/network";

export function useNetworkTopology() {
  const [topology, setTopology] = useState({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTopology = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setTopology(await networkService.getTopology());
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Unable to load network topology.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTopology();
  }, [loadTopology]);

  return { topology, isLoading, error, loadTopology };
}
