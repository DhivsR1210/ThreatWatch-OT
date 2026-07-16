import { useCallback, useEffect, useState } from "react";

import { vulnerabilityService } from "../services/vulnerabilities";

export function useVulnerabilities() {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVulnerabilities = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await vulnerabilityService.list(params);
      setVulnerabilities(data.vulnerabilities || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Unable to load vulnerabilities.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVulnerabilities();
  }, [loadVulnerabilities]);

  return { vulnerabilities, error, isLoading, loadVulnerabilities, setError };
}
