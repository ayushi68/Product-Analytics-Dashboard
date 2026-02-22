import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function ClickTrendLineChart({ data, selectedFeature, onLineChartClick }) {
  return (
    <section className="card chart-card">
      <h2>{selectedFeature ? `${selectedFeature} Trend` : "Click Trend by Date"}</h2>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            onClick={(state) => onLineChartClick?.(state?.activeLabel)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="click_count" stroke="#159570" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ClickTrendLineChart;
