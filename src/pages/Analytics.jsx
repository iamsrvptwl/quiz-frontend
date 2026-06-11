// src/pages/Analytics.jsx
import React from "react";
import Latex from "react-latex-next";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ReferenceDot,
} from "recharts";
import { theme, styles, CHART_COLORS } from "../theme";

// Helper component for the colored table cells
const ColorBarCell = ({ value, sub, percent, color }) => (
  <td style={{ ...styles.td, position: "relative", minWidth: "80px" }}>
    <div
      style={{
        position: "absolute",
        top: "10%",
        bottom: "10%",
        right: "10px",
        width: "4px",
        backgroundColor: color,
        borderRadius: "4px",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: `${percent}%`,
        backgroundColor: color,
        opacity: 0.15,
      }}
    />
    <span style={{ position: "relative", zIndex: 1, fontWeight: "bold", fontSize: "15px" }}>
      {value}
    </span>
    {sub && (
      <span style={{ position: "relative", zIndex: 1, fontSize: "11px", color: theme.textMuted, marginLeft: "4px" }}>
        {sub}
      </span>
    )}
  </td>
);

export default function Analytics({
  handleClearHistory,
  peerCompareSubject,
  setPeerCompareSubject,
  fetchPeerStats,
  structure,
  peerStats,
  pastResults,
  missedQuestions,
  // --- NEW PROPS REQUIRED FROM BACKEND ---
  marksDistributionData = [], // Needs array from DB: [{ marks: 10, students: 5 }, ...]
  topRankers = [], // Needs array from DB: [{ name: "Rohit", score: "60/60" }, ...]
  currentRank = "N/A",
  totalStudents = "N/A",
  percentile = "N/A",
  topperStats = null, // Needs object: { score: 60, accuracy: 100, correct: 20, wrong: 0, time: "16:18" }
  averageStats = null // Needs object: { score: 37.5, accuracy: 79, correct: 14, wrong: 4, time: "12:20" }
}) {
  // Grab the user's actual most recent test
  const latestTest = pastResults.length > 0 ? pastResults[0] : null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>My Analytics</h1>
        <button
          onClick={handleClearHistory}
          style={{
            ...styles.button,
            backgroundColor: "#FFF0F0",
            color: theme.danger,
            border: "1px solid " + theme.danger,
            width: "auto",
            padding: "8px 16px",
            fontSize: "14px",
          }}
        >
          🗑️ Clear History
        </button>
      </div>

      {/* ─── LATEST TEST ANALYSIS WIDGET ─── */}
      {latestTest && (
        <div style={{ marginBottom: "40px" }}>
          {/* Top Badges */}
          <div
            style={{
              ...styles.card,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            {[
              { icon: "🏅", label: "Rank", value: currentRank, sub: `/ ${totalStudents}`, color: "#EF4444" },
              { icon: "🏆", label: "Score", value: latestTest.score, sub: "", color: "#8B5CF6" },
              { icon: "📝", label: "Attempted", value: "N/A", sub: "", color: "#06B6D4" }, // Requires DB update to save attempts
              { icon: "🎯", label: "Accuracy", value: `${latestTest.accuracy}%`, sub: "", color: "#10B981" },
              { icon: "👥", label: "Percentile", value: percentile, sub: "", color: "#6366F1" },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    backgroundColor: stat.color,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: theme.textMain }}>
                    {stat.value} <span style={{ fontSize: "12px", color: theme.textMuted, fontWeight: "normal" }}>{stat.sub}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: theme.textMuted, fontWeight: "600" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            <div style={{ flex: "2 1 600px", display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Comparison Table */}
              <div style={{ ...styles.card, padding: 0, overflow: "hidden", marginBottom: 0 }}>
                <div style={{ padding: "15px 20px", borderBottom: "1px solid " + theme.border }}>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>Compare with topper</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ ...styles.table, borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ ...styles.th, backgroundColor: "white" }}></th>
                        <th style={{ ...styles.th, backgroundColor: "white" }}>Score</th>
                        <th style={{ ...styles.th, backgroundColor: "white" }}>Accuracy</th>
                        <th style={{ ...styles.th, backgroundColor: "white" }}>Correct</th>
                        <th style={{ ...styles.th, backgroundColor: "white" }}>Wrong</th>
                        <th style={{ ...styles.th, backgroundColor: "white" }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* YOU (Actual Data from DB) */}
                      <tr>
                        <td style={{ ...styles.td, fontWeight: "bold" }}>You</td>
                        <ColorBarCell value={latestTest.score} sub="" percent={Math.min((latestTest.score / 60) * 100, 100)} color="#C084FC" />
                        <ColorBarCell value={`${latestTest.accuracy}%`} sub="" percent={latestTest.accuracy} color="#4ADE80" />
                        <ColorBarCell value="N/A" sub="" percent={0} color="#4ADE80" /> {/* Requires DB tracking of correct counts */}
                        <ColorBarCell value="N/A" sub="" percent={0} color="#F87171" />
                        <ColorBarCell value="N/A" sub="" percent={0} color="#FACC15" />
                      </tr>
                      
                      {/* TOPPER (Requires new backend data) */}
                      <tr>
                        <td style={{ ...styles.td, fontWeight: "bold" }}>Topper</td>
                        <ColorBarCell value={topperStats?.score || "N/A"} sub="" percent={100} color="#C084FC" />
                        <ColorBarCell value={topperStats?.accuracy ? `${topperStats.accuracy}%` : "N/A"} sub="" percent={100} color="#4ADE80" />
                        <ColorBarCell value={topperStats?.correct || "N/A"} sub="" percent={100} color="#4ADE80" />
                        <ColorBarCell value={topperStats?.wrong || "N/A"} sub="" percent={0} color="#F87171" />
                        <ColorBarCell value={topperStats?.time || "N/A"} sub="" percent={65} color="#FACC15" />
                      </tr>

                      {/* AVG (Requires new backend data) */}
                      <tr>
                        <td style={{ ...styles.td, fontWeight: "bold" }}>Avg</td>
                        <ColorBarCell value={averageStats?.score || "N/A"} sub="" percent={50} color="#C084FC" />
                        <ColorBarCell value={averageStats?.accuracy ? `${averageStats.accuracy}%` : "N/A"} sub="" percent={50} color="#4ADE80" />
                        <ColorBarCell value={averageStats?.correct || "N/A"} sub="" percent={50} color="#4ADE80" />
                        <ColorBarCell value={averageStats?.wrong || "N/A"} sub="" percent={50} color="#F87171" />
                        <ColorBarCell value={averageStats?.time || "N/A"} sub="" percent={50} color="#FACC15" />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marks Distribution Chart */}
              <div style={{ ...styles.card, marginBottom: 0 }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>Marks Distribution</h3>
                {marksDistributionData.length === 0 ? (
                  <p style={{ color: theme.textMuted, textAlign: "center", padding: "40px" }}>No distribution data available for this test yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={marksDistributionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="marks" type="number" tick={{ fontSize: 12, fill: theme.textMuted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: theme.textMuted }} axisLine={false} tickLine={false} label={{ value: "Number of students", angle: -90, position: "insideLeft", fontSize: 12, fill: theme.textMuted }} />
                      <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: theme.shadow }} />
                      <Line type="monotone" dataKey="students" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5, fill: "#06B6D4", strokeWidth: 2, stroke: "white" }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Top Rankers Sidebar */}
            <div style={{ ...styles.card, flex: "1 1 250px", marginBottom: 0, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "15px 20px", borderBottom: "1px solid " + theme.border }}>
                <h3 style={{ margin: 0, fontSize: "16px" }}>Top Rankers</h3>
              </div>
              <div style={{ padding: "10px" }}>
                {topRankers.length === 0 ? (
                  <p style={{ color: theme.textMuted, textAlign: "center", padding: "20px" }}>Leaderboard not available.</p>
                ) : (
                  topRankers.map((ranker, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "15px", padding: "12px 10px", borderBottom: i !== topRankers.length - 1 ? "1px solid " + theme.border : "none" }}>
                      <span style={{ fontWeight: "bold", color: theme.textMuted, width: "20px" }}>{i + 1}.</span>
                      <div style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "#3B82F6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                        👤
                      </div>
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "14px" }}>{ranker.name}</div>
                        <div style={{ fontSize: "12px", color: theme.textMuted }}>{ranker.score}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── EXISTING HISTORICAL DATA & TRENDS BELOW ─── */}
      <hr style={{ border: 0, borderTop: "2px dashed " + theme.border, margin: "40px 0" }} />
      
      {/* ... [Rest of your existing Analytics.jsx file (Global Peer Comparison, Progress Line Chart, Radar Chart, Missed Questions Table, etc.) remains exactly as it was] ... */}
