import apiClient from "./apiClient";

function buildAnalyticsParams(filters = {}) {
  const params = {
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    ageGroup: filters.ageGroup || undefined,
    gender: filters.gender && filters.gender !== "All" ? filters.gender : undefined,
    featureName: filters.feature_name || filters.featureName || undefined
  };

  return params;
}

export async function login(payload) {
  const { data } = await apiClient.post("/login", payload);
  return data;
}

export async function getFeatureClicks(filters) {
  const { data } = await apiClient.get("/analytics", {
    params: buildAnalyticsParams(filters)
  });
  return data?.data?.totalClicksByFeature || [];
}

export async function getDateClicks(filters) {
  const { data } = await apiClient.get("/analytics", {
    params: buildAnalyticsParams(filters)
  });

  return (data?.data?.dailyClicks || []).map((row) => ({
    date: row.date,
    click_count: row.click_count ?? row.clicks ?? 0
  }));
}

export async function track(payload) {
  const { data } = await apiClient.post("/track", payload);
  return data;
}
