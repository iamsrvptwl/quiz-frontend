// src/pages/TestHistory.jsx
import React from "react";
import { Link } from "react-router-dom";
import { theme, styles } from "../theme";

export default function TestHistory({ pastResults, handleClearHistory }) {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>My Test History</h1>
        <button
          onClick={handleClearHistory}
          style={{ ...styles.button, backgroundColor: "#FFF0F0", color: theme.danger, border: "1px solid " + theme.danger, width: "auto", padding: "8px 16px", fontSize: "14px" }}
        >
          🗑️ Clear History
        </button>
      </div>

      {pastResults.length === 0 ? (
        <div style={{ ...styles.card, textAlign: "center", padding: "40px", color: theme.textMuted }}>
          You haven't taken any timed tests yet. Go to your dashboard to start practicing!
        </div>
      ) : (
        <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ ...styles.table, minWidth: "600px" }}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Score</th>
                  <th style={styles.th}>Accuracy</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pastResults.map((test, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid " + theme.border }}>
                    <td style={styles.td}>{new Date(test.created_at).toLocaleDateString()}</td>
                    <td style={styles.td}><strong>{test.subject_name}</strong></td>
                    <td style={styles.td}>{test.score}</td>
                    <td style={styles.td}>
                      <span style={{ color: test.accuracy >= 70 ? theme.success : theme.danger, fontWeight: "bold" }}>
                        {test.accuracy}%
                      </span>
                    </td>
                    <td style={styles.td}>
                      {/* This links to the specific test ID */}
                      <Link 
                        to={`/analytics/${test.id}`} 
                        style={{ ...styles.button, ...styles.btnPrimary, display: "inline-block", width: "auto", padding: "6px 12px", fontSize: "13px", textDecoration: "none" }}
                      >
                        📊 Show Results
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
