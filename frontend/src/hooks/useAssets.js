import { useCallback, useEffect, useState } from "react";

import { assetService } from "../services/assets";

export function useAssets() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await assetService.list();
      setAssets(data.assets);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Unable to load asset inventory.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  return { assets, error, isLoading, loadAssets, setError };
}
