import React, { useEffect, useState } from "react";
import "./GrievanceAnalytics.css";

/* CHART IMPORTS */
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GrievanceAnalytics({ onBack }) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0
  });

  useEffect(() => {
    fetch("http://localhost:9090/api/grievances/all")
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        setStats({
          total: data.length,
          pending: data.filter(g => g.status === "PENDING").length,
          progress: data.filter(g => g.status === "IN_PROGRESS").length,
          resolved: data.filter(g => g.status === "RESOLVED").length
        });
      });
  }, []);

  const chartData = {
    labels: ["Pending", "In Progress", "Resolved"],
    datasets: [
      {
        data: [stats.pending, stats.progress, stats.resolved],
        backgroundColor: ["#facc15", "#38bdf8", "#22c55e"]
      }
    ]
  };

  return (
    <div className="analytics-page">

      {/* 🔙 BACK BUTTON */}
      <div className="analytics-back">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
      </div>

      {/* HEADER */}
      <div className="analytics-header">
        <h2>Grievance Analytics</h2>
        <p>Visual overview of grievance status and resolution progress</p>
      </div>

      {/* KPI CARDS */}
      <div className="analytics-stats">
        <div className="analytics-card">
          <span>Total</span>
          <h3>{stats.total}</h3>
        </div>

        <div className="analytics-card pending">
          <span>Pending</span>
          <h3>{stats.pending}</h3>
        </div>

        <div className="analytics-card progress">
          <span>In Progress</span>
          <h3>{stats.progress}</h3>
        </div>

        <div className="analytics-card resolved">
          <span>Resolved</span>
          <h3>{stats.resolved}</h3>
        </div>
      </div>

      {/* CHART */}
      <div className="analytics-chart-card">
        <h3>Grievance Status Distribution</h3>
        <div className="chart-wrapper">
          <Pie data={chartData} />
        </div>
      </div>

    </div>
  );
}
