import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterPanel from "../components/FilterPanel";
import FeatureBarChart from "../components/FeatureBarChart";
import ClickTrendLineChart from "../components/ClickTrendLineChart";
import useFilters from "../hooks/useFilters";
import useTracking from "../hooks/useTracking";
import { getDateClicks, getFeatureClicks } from "../services/apiService";
import { clearToken } from "../services/tokenService";

const fallbackFeatureData = [
  { feature_name: "Search", total_clicks: 120 },
  { feature_name: "Cart", total_clicks: 95 },
  { feature_name: "Wishlist", total_clicks: 73 },
  { feature_name: "Checkout", total_clicks: 54 }
];

const fallbackDateData = [
  { date: "2026-02-14", click_count: 17 },
  { date: "2026-02-15", click_count: 24 },
  { date: "2026-02-16", click_count: 31 },
  { date: "2026-02-17", click_count: 22 },
  { date: "2026-02-18", click_count: 30 },
  { date: "2026-02-19", click_count: 27 },
  { date: "2026-02-20", click_count: 34 }
];

function DashboardPage() {
  const navigate = useNavigate();
  const trackEvent = useTracking();
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFilterTracking = useCallback(
    (latestFilters) => {
      trackEvent("filter_change", {
        feature_name: "Filter Changed",
        filters: latestFilters
      });
    },
    [trackEvent]
  );

  const { filters, setFilters } = useFilters(handleFilterTracking);

  useEffect(() => {
    let active = true;

    async function fetchChartData() {
      setLoading(true);
      try {
        const [featureResult, dateResult] = await Promise.all([
          getFeatureClicks(filters),
          getDateClicks({
            ...filters,
            feature_name: selectedFeature || undefined
          })
        ]);
        if (!active) return;
        setBarData(featureResult || fallbackFeatureData);
        setLineData(dateResult || fallbackDateData);
      } catch {
        if (!active) return;
        setBarData(fallbackFeatureData);
        setLineData(fallbackDateData);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchChartData();
    return () => {
      active = false;
    };
  }, [filters, selectedFeature]);

  async function handleBarClick(featureName) {
    if (!featureName) return;
    setSelectedFeature(featureName);
    await trackEvent("chart_interaction", {
      chart: "bar",
      action: "bar_click",
      feature_name: featureName
    });
  }

  async function handleLineChartClick(dateLabel) {
    await trackEvent("chart_interaction", {
      chart: "line",
      action: "point_click",
      date: dateLabel || null,
      feature_name: selectedFeature || null
    });
  }

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <main className="page">
      <header className="topbar">
        <h1>Product Analytics Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <FilterPanel filters={filters} onChange={setFilters} />

      {loading ? <p className="muted">Loading analytics...</p> : null}

      <section className="chart-grid">
        <FeatureBarChart data={barData} onBarClick={handleBarClick} />
        <ClickTrendLineChart
          data={lineData}
          selectedFeature={selectedFeature}
          onLineChartClick={handleLineChartClick}
        />
      </section>
    </main>
  );
}

export default DashboardPage;
