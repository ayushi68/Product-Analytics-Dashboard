import { useEffect, useState } from "react";
import { getFiltersFromCookies, saveFiltersToCookies } from "../utils/cookies";
import { getDefaultDateRange } from "../utils/date";

const defaultFilters = {
  ...getDefaultDateRange(),
  ageGroup: "18-40",
  gender: "All"
};

export default function useFilters(onFilterChange) {
  const [filters, setFilters] = useState(() => {
    const saved = getFiltersFromCookies();
    return saved ? { ...defaultFilters, ...saved } : defaultFilters;
  });

  useEffect(() => {
    saveFiltersToCookies(filters);
    if (onFilterChange) onFilterChange(filters);
  }, [filters, onFilterChange]);

  return {
    filters,
    setFilters
  };
}
