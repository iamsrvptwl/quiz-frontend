// src/pages/Analytics.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ReferenceDot } from "recharts";
import { theme, styles } from "../theme";

const ColorBarCell = ({ value, sub, percent, color }) => (
  <td style={{ ...styles.td, position: "relative", minWidth: "80px" }}>
    <div style={{ position: "absolute", top: "10%", bottom: "10%", right: "10px", width: "4px", backgroundColor: color, borderRadius: "4px" }} />
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${percent}%`, backgroundColor: color, opacity: 0.15 }} />
    <span style={{ position: "relative", zIndex: 1, fontWeight: "bold", fontSize: "15px" }}>{value}</span>
    {sub && <span style={{ position: "relative", zIndex: 1, fontSize: "11px", color: theme.textMuted, marginLeft: "4px" }}>{sub}</span>}
  </td>
);

export default function Analytics({ pastResults }) {
  // Grab the specific test ID from the URL (e.g., /analytics/123)
  const { testId } = useParams();
  
  // Find the basic test info from your existing pastResults state
  const testInfo = pastResults.find(t => String(t.id) === String(testId));

  // State to hold the detailed backend data for THIS specific test
  const [detailedStats, setDetailedStats] = useState({
    marksDistributionData: [],
    topRankers: [],
    currentRank: "N/A",
    totalStudents: "N/A",
    percentile: "N/A",
    topperStats: null,
    averageStats: null,
    isLoading: true
  });

  
useEffect(() => {
    // If the data is missing, we don't fetch
    if (!testId || !testInfo) return; 

    // Fetch the real analytics from the backend
    fetch(`http://localhost:3000/test-analytics/${testId}`)
      .then(res => res.json())
      .then(data => {
        setDetailedStats({
          marksDistributionData: data.marksDistributionData || [],
          topRankers: data.topRankers || [],
          currentRank: data.currentRank || "N/A",
          totalStudents: data.totalStudents || "N/A",
          percentile: data.percentile || "N/A",
          topperStats: data.topperStats || null,
          averageStats: data.averageStats || null,
          isLoading: false
        });
      })
      .catch(err => {
        console.error("Failed to fetch detailed analytics", err);
        setDetailedStats(prev => ({ ...prev, isLoading: false }));
      });
  }, [testId, testInfo]);

  if (!testInfo) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Test not found.</h2>
        <Link to="/history" style={{ color: theme.primary }}>Return to History</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/history" style={{ textDecoration: "none", color: theme.textMuted, fontWeight: "bold", fontSize: "14px" }}>
          ← Back to All Tests
        </Link>
        <h1 style={{ margin: "10px 0 0 0", fontSize: "24px" }}>Results: {testInfo.subject_name}</h1>
        <p style={{ color: theme.textMuted, margin: "5px 0 20px 0" }}>Taken on {new Date(testInfo.created_at).toLocaleDateString()}</p>
      </div>

      <div style={{ marginBottom: "40px" }}>
        {/* Top Badges */}
        <div style={{ ...styles.card, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "20px", gap: "15px", marginBottom: "20px" }}>
          {[
            { icon: "🏅", label: "Rank", value: detailedStats.currentRank, sub: `/ ${detailedStats.totalStudents}`, color: "#EF4444" },
            { icon: "🏆", label: "Score", value: testInfo.score, sub: "", color: "#8B5CF6" },
            { icon: "📝", label: "Attempted", value: "N/A", sub: "", color: "#06B6D4" },
            { icon: "🎯", label: "Accuracy", value: `${testInfo.accuracy}%`, sub: "", color: "#10B981" },
            { icon: "👥", label: "Percentile", value: detailedStats.percentile, sub: "", color: "#6366F1" },
          ].map((stat, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "45px", height: "45px", borderRadius: "50%", backgroundColor: stat.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: theme.textMain }}>{stat.value} <span style={{ fontSize: "12px", color: theme.textMuted, fontWeight: "normal" }}>{stat.sub}</span></div>
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
                    <tr>
                      <td style={{ ...styles.td, fontWeight: "bold" }}>You</td>
                      <ColorBarCell value={testInfo.score} sub="" percent={Math.min((testInfo.score / 60) * 100, 100)} color="#C084FC" />
                      <ColorBarCell value={`${testInfo.accuracy}%`} sub="" percent={testInfo.accuracy} color="#4ADE80" />
                      <ColorBarCell value="N/A" sub="" percent={0} color="#4ADE80" /> 
                      <ColorBarCell value="N/A" sub="" percent={0} color="#F87171" />
                      <ColorBarCell value="N/A" sub="" percent={0} color="#FACC15" />
                    </tr>
                    <tr>
                      <td style={{ ...styles.td, fontWeight: "bold" }}>Topper</td>
                      <ColorBarCell value={detailedStats.topperStats?.score || "N/A"} sub="" percent={100} color="#C084FC" />
                      <ColorBarCell value={detailedStats.topperStats?.accuracy ? `${detailedStats.topperStats.accuracy}%` : "N/A"} sub="" percent={100} color="#4ADE80" />
                      <ColorBarCell value={detailedStats.topperStats?.correct || "N/A"} sub="" percent={100} color="#4ADE80" />
                      <ColorBarCell value={detailedStats.topperStats?.wrong || "N/A"} sub="" percent={0} color="#F87171" />
                      <ColorBarCell value={detailedStats.topperStats?.time || "N/A"} sub="" percent={65} color="#FACC15" />
                    </tr>
                    <tr>
                      <td style={{ ...styles.td, fontWeight: "bold" }}>Avg</td>
                      <ColorBarCell value={detailedStats.averageStats?.score || "N/A"} sub="" percent={50} color="#C084FC" />
                      <ColorBarCell value={detailedStats.averageStats?.accuracy ? `${detailedStats.averageStats.accuracy}%` : "N/A"} sub="" percent={50} color="#4ADE80" />
                      <ColorBarCell value={detailedStats.averageStats?.correct || "N/A"} sub="" percent={50} color="#4ADE80" />
                      <ColorBarCell value={detailedStats.averageStats?.wrong || "N/A"} sub="" percent={50} color="#F87171" />
                      <ColorBarCell value={detailedStats.averageStats?.time || "N/A"} sub="" percent={50} color="#FACC15" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Marks Distribution Chart */}
            <div style={{ ...styles.card, marginBottom: 0 }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>Marks Distribution</h3>
              {detailedStats.marksDistributionData.length === 0 ? (
                <p style={{ color: theme.textMuted, textAlign: "center", padding: "40px" }}>No distribution data available for this test yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={detailedStats.marksDistributionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
              {detailedStats.topRankers.length === 0 ? (
                <p style={{ color: theme.textMuted, textAlign: "center", padding: "20px" }}>Leaderboard not available.</p>
              ) : (
                detailedStats.topRankers.map((ranker, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "15px", padding: "12px 10px", borderBottom: i !== detailedStats.topRankers.length - 1 ? "1px solid " + theme.border : "none" }}>
                    <span style={{ fontWeight: "bold", color: theme.textMuted, width: "20px" }}>{i + 1}.</span>
                    <div style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "#3B82F6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👤</div>
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
    </div>
  );
}
