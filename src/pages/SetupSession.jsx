import React from "react";
import { theme, styles } from "../theme";

export default function SetupSession({
  examMode,
  examFilterMode,
  setExamFilterMode,
  selectedExamName,
  agencyName,
  loadError,
  relevantSubjectIds,
  subjects,
  selectedSubjects,
  toggleSubject,
  chapters,
  selectedChapters,
  toggleChapter,
  examReferences,
  selectedExamFilters,
  toggleExamFilter,
  selectedTypeFilter,
  setSelectedTypeFilter,
  questionLimit,
  setQuestionLimit,
  marksCorrect,
  setMarksCorrect,
  marksNegative,
  setMarksNegative,
  isLoading,
  startQuiz,
}) {
  return (
    <div style={{ ...styles.card, maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px" }}>Configure Session</h2>
        <span
          style={{
            padding: "4px 10px",
            backgroundColor:
              examMode === "mistake"
                ? "#FEF3C7"
                : examMode === "test"
                  ? "#FEE2E2"
                  : "#D1FAE5",
            color:
              examMode === "mistake"
                ? "#92400E"
                : examMode === "test"
                  ? theme.danger
                  : theme.success,
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {examMode.toUpperCase()} MODE
        </span>
      </div>

      {/* --- Exam Scope Selector (Strict vs Custom/All) --- */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          Question Scope
        </label>
        <div
          style={{
            display: "flex",
            backgroundColor: "#F3F4F6",
            padding: "4px",
            borderRadius: "8px",
            border: "1px solid " + theme.border,
          }}
        >
          <button
            type="button"
            onClick={() => setExamFilterMode && setExamFilterMode("strict")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s ease",
              backgroundColor:
                examFilterMode === "strict" ? theme.primary : "transparent",
              color: examFilterMode === "strict" ? "#FFFFFF" : theme.textMuted,
              boxShadow:
                examFilterMode === "strict"
                  ? "0 1px 3px rgba(0,0,0,0.1)"
                  : "none",
            }}
          >
            Strict ({agencyName ? `${agencyName} ` : ""}{selectedExamName || "Target Exam"})
          </button>
          <button
            type="button"
            onClick={() => setExamFilterMode && setExamFilterMode("mixed")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s ease",
              backgroundColor:
                examFilterMode === "mixed" ? theme.primary : "transparent",
              color: examFilterMode === "mixed" ? "#FFFFFF" : theme.textMuted,
              boxShadow:
                examFilterMode === "mixed"
                  ? "0 1px 3px rgba(0,0,0,0.1)"
                  : "none",
            }}
          >
            All Exams / Custom PYQs
          </button>
        </div>
      </div>

      {/* Active Filter Banner for Strict Mode */}
      {examFilterMode === "strict" && selectedExamName && (
        <div
          style={{
            padding: "10px 14px",
            backgroundColor: "#EFF6FF",
            borderLeft: "4px solid " + theme.primary,
            borderRadius: "4px",
            marginBottom: "20px",
            fontSize: "13px",
            color: theme.primary,
            lineHeight: "1.4",
          }}
        >
          <strong>🔒 Strict Mode Enforced:</strong> Questions are strictly matched against both agency (<b>{agencyName || "Target Agency"}</b>) and exam (<b>{selectedExamName}</b>).
        </div>
      )}

      {loadError && (
        <div
          style={{
            padding: "10px 14px",
            backgroundColor: "#FEE2E2",
            color: theme.danger,
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          {loadError}
        </div>
      )}

      {/* Subject Selection */}
      <label
        style={{
          display: "block",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        Select Subjects
      </label>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#F9FAFB",
          borderRadius: "8px",
          border: "1px solid " + theme.border,
        }}
      >
        {(() => {
          const displayedSubjects =
            examFilterMode === "strict" && relevantSubjectIds
              ? subjects.filter((sub) =>
                  relevantSubjectIds.includes(sub.id.toString())
                )
              : subjects;

          if (subjects.length === 0) {
            return (
              <span style={{ fontSize: "13px", color: theme.textMuted }}>
                Loading curriculum…
              </span>
            );
          }

          if (displayedSubjects.length === 0) {
            return (
              <span style={{ fontSize: "13px", color: theme.danger }}>
                No subjects found containing questions for {selectedExamName}.
              </span>
            );
          }

          return displayedSubjects.map((sub) => (
            <button
              type="button"
              key={sub.id}
              onClick={() => toggleSubject(sub.id.toString())}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "bold",
                cursor: "pointer",
                border:
                  "1px solid " +
                  (selectedSubjects.includes(sub.id.toString())
                    ? theme.primary
                    : theme.border),
                backgroundColor: selectedSubjects.includes(sub.id.toString())
                  ? theme.primary
                  : theme.surface,
                color: selectedSubjects.includes(sub.id.toString())
                  ? "white"
                  : theme.textMuted,
              }}
            >
              {sub.name}
            </button>
          ));
        })()}
      </div>

      {/* Chapter Selection */}
      {selectedSubjects.length > 0 && (
        <>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Select Chapters{" "}
            <span
              style={{
                fontSize: "12px",
                fontWeight: "normal",
                color: theme.textMuted,
              }}
            >
              (Leave blank for all)
            </span>
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "20px",
              maxHeight: "180px",
              overflowY: "auto",
              padding: "10px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              border: "1px solid " + theme.border,
            }}
          >
            {chapters
              .filter((c) => selectedSubjects.includes(c.subject_id.toString()))
              .map((chap) => (
                <button
                  type="button"
                  key={chap.id}
                  onClick={() => toggleChapter(chap.id.toString())}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    border:
                      "1px solid " +
                      (selectedChapters.includes(chap.id.toString())
                        ? theme.primary
                        : theme.border),
                    backgroundColor: selectedChapters.includes(
                      chap.id.toString()
                    )
                      ? theme.primary
                      : theme.surface,
                    color: selectedChapters.includes(chap.id.toString())
                      ? "white"
                      : theme.textMuted,
                  }}
                >
                  {chap.name}
                </button>
              ))}
          </div>
        </>
      )}

      {/* Exam Tags (Only visible when opting out of Strict Mode) */}
      {examFilterMode === "mixed" && (
        <>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Exam Tags{" "}
            <span
              style={{
                fontSize: "12px",
                fontWeight: "normal",
                color: theme.textMuted,
              }}
            >
              (Pick multiple, or leave blank for all PYQs)
            </span>
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "20px",
              padding: "10px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              border: "1px solid " + theme.border,
            }}
          >
            {examReferences.map((ref, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => toggleExamFilter(ref)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  border:
                    "1px solid " +
                    (selectedExamFilters.includes(ref)
                      ? theme.primary
                      : theme.border),
                  backgroundColor: selectedExamFilters.includes(ref)
                    ? theme.primary
                    : theme.surface,
                  color: selectedExamFilters.includes(ref)
                    ? "white"
                    : theme.textMuted,
                }}
              >
                {ref}
              </button>
            ))}
            {examReferences.length === 0 && selectedSubjects.length > 0 && (
              <span style={{ fontSize: "13px", color: theme.textMuted }}>
                No exam tags found…
              </span>
            )}
            {selectedSubjects.length === 0 && (
              <span style={{ fontSize: "13px", color: theme.textMuted }}>
                Select a subject first…
              </span>
            )}
          </div>
        </>
      )}

      {/* Additional Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        <div style={{ flex: "1 1 200px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Question Type
          </label>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            style={styles.input}
          >
            <option value="Both">Both (Theory & Numerical)</option>
            <option value="Theory">Theory Only</option>
            <option value="Numerical">Numerical Only</option>
          </select>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Number of Questions
          </label>
          <input
            type="number"
            min="1"
            placeholder="Leave blank for ALL"
            value={questionLimit}
            onChange={(e) => setQuestionLimit(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* Test Mode Marking Scheme */}
      {examMode === "test" && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#F9FAFB",
            borderRadius: "8px",
            border: "1px solid " + theme.border,
            marginBottom: "16px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: theme.primary }}>
            Marking Scheme
          </h4>
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Correct (+)
              </label>
              <input
                type="number"
                step="0.1"
                value={marksCorrect}
                onChange={(e) => setMarksCorrect(e.target.value)}
                style={{
                  ...styles.input,
                  marginBottom: 0,
                  padding: "8px",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  display: "block",
                  color: theme.danger,
                  marginBottom: "5px",
                }}
              >
                Incorrect (−)
              </label>
              <input
                type="number"
                step="0.1"
                value={marksNegative}
                onChange={(e) => setMarksNegative(e.target.value)}
                style={{
                  ...styles.input,
                  marginBottom: 0,
                  padding: "8px",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={startQuiz}
        disabled={isLoading}
        style={{
          ...styles.button,
          ...styles.btnPrimary,
          marginTop: "10px",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? "Loading questions…" : "Generate & Start"}
      </button>
    </div>
  );
}
