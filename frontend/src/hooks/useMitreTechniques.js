import { useCallback, useEffect, useState } from "react";

import { mitreService } from "../services/mitre";

export function useMitreTechniques() {
  const [techniques, setTechniques] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTechniques = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await mitreService.list(params);
      setTechniques(data.techniques || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Unable to load MITRE ATT&CK techniques.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTechniques();
  }, [loadTechniques]);

  return { techniques, isLoading, error, loadTechniques };
}
