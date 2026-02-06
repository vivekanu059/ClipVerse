import { useEffect, useState } from "react";
import { getCreatorAnalytics } from "../api/analytics.api";

import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getCreatorAnalytics();
      setStats(res.data);
    };
    load();
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  const { totals, insights } = stats;
  // eslint-disable-next-line no-unused-vars
  const healthClass =
    insights.contentHealth === "EXCELLENT"
      ? "excellent"
      : insights.contentHealth === "GOOD"
      ? "good"
      : "low";

  return (
    <div className="dashboard">
      <h2>Creator Dashboard</h2>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Total Views</div>
          <div className="card-value">{totals.VIEW || 0}</div>
        </div>

        <div className="card">
          <div className="card-title">Total Comments</div>
          <div className="card-value">{totals.COMMENT || 0}</div>
        </div>

        <div className="card">
          <div className="card-title">Videos Uploaded</div>
          <div className="card-value">{totals.UPLOAD || 0}</div>
        </div>

        <div className="card">
          <div className="card-title">Engagement Rate</div>
          <div className="card-value">{insights.engagementRate}%</div>
        </div>
      </div>

      <div className={`health ${healthClass}`}>
        Content Health: {insights.contentHealth}
      </div>
    </div>
  );
}