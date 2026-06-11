// src/pages/TestHistory.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { theme, styles } from "../theme";

export default function TestHistory({ pastResults, handleClearHistory }) {
  // --- FILTER STATES ---
  const [filterExam, setFilterExam] = useState("");
  const [filterType, setFilterType] = useState(""); // "Full Test", "Subject Test", "Chapter Test"
  const [filterSubject, setFilterSubject] = useState("");
  const [filterChapter, setFilterChapter] = useState("");

  // --- DYNAMIC DROPDOWN OPTIONS ---
  // These automatically generate the available options based on the user's actual history
  const availableExams = useMemo(() => {
    return [...new Set(pastResults.map(r => r.exam_name).filter(Boolean))];
  }, [pastResults]);

  const availableSubjects = useMemo(() => {
    let results = pastResults;
    if (filterExam) results = results.filter(r => r.exam_name === filterExam);
    return [...new Set(results.map(r => r.subject_name).filter(Boolean))];
  }, [pastResults, filterExam]);

  const availableChapters = useMemo(() => {
    let results = pastResults;
    if (filterExam) results = results.filter(r => r.exam_name === filterExam);
    if (filterSubject) results = results.filter(r => r.subject_name === filterSubject);
    return [...new Set(results.map(r => r.chapter_name).filter(Boolean))];
  }, [pastResults, filterExam, filterSubject]);

  // --- APPLIED FILTERS ---
  const filteredResults = useMemo(() => {
    return pastResults.filter(test => {
      // 1. Filter by Exam
      if (filterExam && test.exam_name !== filterExam) return false;
      
      // 2. Filter by Test Type (Full vs Subject vs Chapter)
      if (filterType && test.test_type !== filterType) return false;
      
      // 3. Filter by Subject
      if (filterSubject && test.subject_name !== filterSubject) return false;
      
      // 4. Filter by Chapter
      if (filterChapter && test.chapter_name !== filterChapter) return false;

      return true;
    });
  }, [pastResults, filterExam, filterType, filterSubject, filterChapter]);

  const resetFilters = () => {
    setFilterExam("");
    setFilterType("");
    setFilterSubject("");
    setFilterChapter("");
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>My Test Results</h1>
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
        <>
          {/* ─── FILTER CONTROL PANEL ─── */}
          <div style={{ ...styles.card, backgroundColor: "#F9FAFB", border: `1px solid ${theme.border}`, marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", color: theme.primary }}>🔍 Filter Results</h3>
              {(filterExam || filterType || filterSubject || filterChapter) && (
                <button 
                  onClick={resetFilters}
                  style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                >
                  Clear Filters ✕
                </button>
              )}
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
              {/* 1. Exam Filter */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: theme.textMuted }}>Target Exam</label>
                <select 
                  value={filterExam} 
                  onChange={(e) => { setFilterExam(e.target.value); setFilterSubject(""); setFilterChapter(""); }} 
                  style={{ ...styles.input, marginBottom: 0 }}
                >
                  <option value="">All Exams</option>
                  {availableExams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
              </div>

              {/* 2. Test Type Filter */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: theme.textMuted }}>Test Format</label>
                <select 
                  value={filterType} 
                  onChange={(e) => { setFilterType(e.target.value); if (e.target.value === "Full Test") { setFilterSubject(""); setFilterChapter(""); } }} 
                  style={{ ...styles.input, marginBottom: 0 }}
                >
                  <option value="">All Formats</option>
                  <option value="Full Test">Full Tests Only</option>
                  <option value="Subject Test">Subject Tests</option>
                  <option value="Chapter Test">Chapter Tests</option>
                </select>
              </div>

              {/* 3. Subject Filter */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: theme.textMuted }}>Subject</label>
                <select 
                  value={filterSubject} 
                  onChange={(e) => { setFilterSubject(e.target.value); setFilterChapter(""); }} 
                  disabled={filterType === "Full Test"}
                  style={{ ...styles.input, marginBottom: 0, opacity: filterType === "Full Test" ? 0.5 : 1 }}
                >
                  <option value="">All Subjects</option>
                  {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>

              {/* 4. Chapter Filter */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: theme.textMuted }}>Chapter</label>
                <select 
                  value={filterChapter} 
                  onChange={(e) => setFilterChapter(e.target.value)} 
                  disabled={!filterSubject || filterType === "Full Test" || filterType === "Subject Test"}
                  style={{ ...styles.input, marginBottom: 0, opacity: (!filterSubject || filterType === "Full Test" || filterType === "Subject Test") ? 0.5 : 1 }}
                >
                  <option value="">All Chapters</option>
                  {availableChapters.map(chap => <option key={chap} value={chap}>{chap}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ─── RESULTS TABLE ─── */}
          <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
            {filteredResults.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: theme.textMuted }}>
                No tests match your selected filters.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ ...styles.table, minWidth: "800px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Exam / Format</th>
                      <th style={styles.th}>Topic Focus</th>
                      <th style={styles.th}>Score</th>
                      <th style={styles.th}>Accuracy</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((test, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid " + theme.border }}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: "600" }}>{new Date(test.created_at).toLocaleDateString()}</div>
                          <div style={{ fontSize: "12px", color: theme.textMuted }}>
                            {new Date(test.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={{ fontWeight: "bold", color: theme.primary, display: "block" }}>{test.exam_name || "General Practice"}</span>
                          <span style={{ fontSize: "11px", backgroundColor: "#E5E7EB", padding: "2px 6px", borderRadius: "4px", color: theme.textMuted }}>
                            {test.test_type || "Mixed"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {test.test_type === "Full Test" ? (
                            <span style={{ color: theme.textMuted }}>Comprehensive Syllabus</span>
                          ) : (
                            <>
                              <div style={{ fontWeight: "600" }}>{test.subject_name || "Mixed Subjects"}</div>
                              {test.chapter_name && <div style={{ fontSize: "12px", color: theme.textMuted }}>↳ {test.chapter_name}</div>}
                            </>
                          )}
                        </td>
                        <td style={{ ...styles.td, fontWeight: "bold", fontSize: "15px" }}>{test.score}</td>
                        <td style={styles.td}>
                          <span style={{ 
                            color: test.accuracy >= 80 ? theme.success : test.accuracy >= 50 ? theme.warning : theme.danger, 
                            fontWeight: "bold",
                            backgroundColor: test.accuracy >= 80 ? "#D1FAE5" : test.accuracy >= 50 ? "#FEF3C7" : "#FEE2E2",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "13px"
                          }}>
                            {test.accuracy}%
                          </span>
                        </td>
                        <td style={styles.td}>
                          <Link 
                            to={`/analytics/${test.id}`} 
                            style={{ ...styles.button, ...styles.btnPrimary, display: "inline-block", width: "auto", padding: "6px 12px", fontSize: "13px", textDecoration: "none" }}
                          >
                            📊 View Analysis
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
