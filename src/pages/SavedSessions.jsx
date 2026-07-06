// src/pages/SavedSessions.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { theme, styles } from "../theme";

export default function SavedSessions({
  savedSessions,
  handleResumeSession,
  handleDeleteSavedSession,
}) {
  // --- FILTER & SORT STATES ---
  const [filterAgency, setFilterAgency] = useState("");
  const [filterExam, setFilterExam] = useState("");
  const [filterType, setFilterType] = useState(""); // "test", "practice", "mistake"
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest"

  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  // --- DYNAMIC DROPDOWN OPTIONS ---
  // Automatically extracts unique agencies and exams present in saved sessions
  const availableAgencies = useMemo(() => {
    return [
      ...new Set(
        savedSessions
          .map((s) => s.agencyName || "General / Unassigned")
          .filter(Boolean)
      ),
    ];
  }, [savedSessions]);

  const availableExams = useMemo(() => {
    let list = savedSessions;
    if (filterAgency) {
      list = list.filter(
        (s) => (s.agencyName || "General / Unassigned") === filterAgency
      );
    }
    return [...new Set(list.map((s) => s.selectedExamName).filter(Boolean))];
  }, [savedSessions, filterAgency]);

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedSessions = useMemo(() => {
    let result = [...savedSessions];

    // 1. Agency Filter
    if (filterAgency) {
      result = result.filter(
        (s) => (s.agencyName || "General / Unassigned") === filterAgency
      );
    }

    // 2. Exam Filter
    if (filterExam) {
      result = result.filter((s) => s.selectedExamName === filterExam);
    }

    // 3. Exam Mode Type Filter
    if (filterType) {
      result = result.filter((s) => s.examMode === filterType);
    }

    // 4. Sorting
    result.sort((a, b) => {
      const timeA = new Date(a.savedAt).getTime();
      const timeB = new Date(b.savedAt).getTime();
      return sortBy === "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [savedSessions, filterAgency, filterExam, filterType, sortBy]);

  const resetFilters = () => {
    setFilterAgency("");
    setFilterExam("");
    setFilterType("");
    setSortBy("newest");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: theme.textMuted,
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          ← Back to Dashboard
        </Link>
        <h1 style={{ margin: "5px 0 0 0", fontSize: "24px" }}>
          ⏸️ Paused & Saved Tests
        </h1>
      </div>

      {savedSessions.length === 0 ? (
        <div
          style={{
            ...styles.card,
            textAlign: "center",
            padding: "50px 20px",
            color: theme.textMuted,
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
          <h3 style={{ color: theme.textMain, margin: "0 0 8px 0" }}>
            No Saved Test Sessions
          </h3>
          <p style={{ margin: "0 0 20px 0", fontSize: "14px" }}>
            When you leave an active test and choose "Save Progress", it will
            appear here so you can resume later.
          </p>
          <Link
            to="/dashboard"
            style={{
              ...styles.button,
              ...styles.btnPrimary,
              display: "inline-block",
              width: "auto",
              padding: "10px 20px",
              textDecoration: "none",
            }}
          >
            Start a New Practice/Test Session
          </Link>
        </div>
      ) : (
        <>
          {/* ─── FILTER CONTROL PANEL ─── */}
          <div
            style={{
              ...styles.card,
              backgroundColor: "#F9FAFB",
              border: `1px solid ${theme.border}`,
              marginBottom: "24px",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "15px", color: theme.primary }}>
                🔍 Filter Saved Sessions
              </h3>
              {(filterAgency ||
                filterExam ||
                filterType ||
                sortBy !== "newest") && (
                <button
                  onClick={resetFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.danger,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  Reset Filters ✕
                </button>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
              }}
            >
              {/* 1. Filter by Agency Dropdown */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: theme.textMuted,
                  }}
                >
                  Target Agency
                </label>
                <select
                  value={filterAgency}
                  onChange={(e) => {
                    setFilterAgency(e.target.value);
                    setFilterExam(""); // Reset exam when agency changes
                  }}
                  style={{
                    ...styles.input,
                    marginBottom: 0,
                    padding: "6px 10px",
                    fontSize: "13px",
                  }}
                >
                  <option value="">All Agencies</option>
                  {availableAgencies.map((ag) => (
                    <option key={ag} value={ag}>
                      {ag}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Filter by Exam Dropdown */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: theme.textMuted,
                  }}
                >
                  Target Exam
                </label>
                <select
                  value={filterExam}
                  onChange={(e) => setFilterExam(e.target.value)}
                  style={{
                    ...styles.input,
                    marginBottom: 0,
                    padding: "6px 10px",
                    fontSize: "13px",
                  }}
                >
                  <option value="">All Exams</option>
                  {availableExams.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Filter by Exam Mode Type */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: theme.textMuted,
                  }}
                >
                  Session Format
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    ...styles.input,
                    marginBottom: 0,
                    padding: "6px 10px",
                    fontSize: "13px",
                  }}
                >
                  <option value="">All Types</option>
                  <option value="test">Test Mode</option>
                  <option value="practice">Practice Mode</option>
                  <option value="mistake">Mistake Mode</option>
                </select>
              </div>

              {/* 4. Sort Dropdown */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: theme.textMuted,
                  }}
                >
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    ...styles.input,
                    marginBottom: 0,
                    padding: "6px 10px",
                    fontSize: "13px",
                  }}
                >
                  <option value="newest">Newest Saved</option>
                  <option value="oldest">Oldest Saved</option>
                </select>
              </div>
            </div>
          </div>

          {/* ─── SAVED SESSIONS LIST ─── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {filteredAndSortedSessions.length === 0 ? (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: theme.textMuted,
                  border: `1px dashed ${theme.border}`,
                  borderRadius: "8px",
                }}
              >
                No saved sessions match your selected filters.
              </div>
            ) : (
              filteredAndSortedSessions.map((session) => {
                const answeredCount = Object.keys(
                  session.userAnswers || {}
                ).filter((k) => session.userAnswers[k]?.selected).length;
                const totalQuestions = session.questions?.length || 0;
                const progressPercent =
                  totalQuestions > 0
                    ? Math.round((answeredCount / totalQuestions) * 100)
                    : 0;

                return (
                  <div
                    key={session.id}
                    style={{
                      ...styles.card,
                      borderLeft: `6px solid ${
                        session.examMode === "test"
                          ? theme.danger
                          : session.examMode === "mistake"
                            ? "#F59E0B"
                            : theme.success
                      }`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "20px",
                      padding: "20px",
                      marginBottom: 0,
                    }}
                  >
                    {/* Session Info */}
                    <div style={{ flex: "1 1 300px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          marginBottom: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor:
                              session.examMode === "test"
                                ? "#FEE2E2"
                                : session.examMode === "mistake"
                                  ? "#FEF3C7"
                                  : "#D1FAE5",
                            color:
                              session.examMode === "test"
                                ? theme.danger
                                : session.examMode === "mistake"
                                  ? "#92400E"
                                  : theme.success,
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          {session.examMode || "Practice"} Mode
                        </span>
                        <span
                          style={{ fontSize: "12px", color: theme.textMuted }}
                        >
                          Saved on{" "}
                          {new Date(session.savedAt).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      {/* Displaying target exam and structural grouping */}
                      <h3
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "18px",
                          color: theme.textMain,
                        }}
                      >
                        {`${session.agencyName || ""} ${session.title || ""}`.trim() || "General Practice Test"}
                      </h3>


                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          fontSize: "13px",
                          color: theme.textMuted,
                          flexWrap: "wrap",
                        }}
                      >
                        <span>
                          📌 Q{session.currentIndex + 1} / {totalQuestions}
                        </span>
                        <span>
                          ✍️ {answeredCount} Answered ({progressPercent}%)
                        </span>
                        {session.examMode === "test" && (
                          <span
                            style={{
                              color:
                                session.timeLeft < 300
                                  ? theme.danger
                                  : theme.textMuted,
                              fontWeight: "bold",
                            }}
                          >
                            ⏱️ {formatTime(session.timeLeft)} Remaining
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          height: "6px",
                          backgroundColor: theme.bg,
                          borderRadius: "3px",
                          marginTop: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${progressPercent}%`,
                            height: "100%",
                            backgroundColor:
                              session.examMode === "test"
                                ? theme.danger
                                : theme.primary,
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => handleDeleteSavedSession(session.id)}
                        style={{
                          ...styles.button,
                          backgroundColor: "#FFF1F2",
                          color: theme.danger,
                          border: `1px solid #FDA4AF`,
                          padding: "10px 14px",
                          fontSize: "13px",
                          width: "auto",
                        }}
                      >
                        🗑️ Delete
                      </button>

                      <button
                        onClick={() => handleResumeSession(session)}
                        style={{
                          ...styles.button,
                          ...styles.btnPrimary,
                          padding: "10px 20px",
                          fontSize: "14px",
                          width: "auto",
                        }}
                      >
                        ▶️ Resume
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}