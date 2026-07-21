import { useCallback, useEffect, useState } from "react";

import { alertService } from "../services/alerts";

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await alertService.list(params);
      setAlerts(data.alerts || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Unable to load SOC alerts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return { alerts, error, isLoading, loadAlerts };
}
