import { useCallback } from "react";
import { track } from "../services/apiService";

export default function useTracking() {
  return useCallback(async (eventName, metadata = {}) => {
    try {
      await track({
        feature_name: metadata?.feature_name || eventName,
        timestamp: new Date().toISOString()
      });
    } catch {
      // Avoid breaking UX if tracking fails
    }
  }, []);
}
