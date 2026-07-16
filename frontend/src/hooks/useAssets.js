import { useCallback, useEffect, useState } from "react";

import { assetService } from "../services/assets";
import { demoAssets } from "../data/seedData";

export function useAssets() {
  const [assets, setAssets] = useState(demoAssets);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await assetService.list();
      setAssets((Array.isArray(data.assets) && data.assets.length > 0) ? data.assets : demoAssets);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Unable to load asset inventory.");
      setAssets(demoAssets);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  return { assets, error, isLoading, loadAssets, setError };
}
