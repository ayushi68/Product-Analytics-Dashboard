import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function FeatureBarChart({ data, onBarClick }) {
  return (
    <section className="card chart-card">
      <h2>Feature Clicks</h2>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature_name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="total_clicks"
              fill="#2f6fed"
              onClick={(barData) => onBarClick(barData?.feature_name)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default FeatureBarChart;
