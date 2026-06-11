import { theme, styles } from "../theme";

export default function ModeSelection({
  examFilterMode,
  selectedExamName,
  agencyName,
  setExamMode,
  setSelectedSubjects,
  setSelectedChapters,
  setSelectedExamFilters,
  setQuestionLimit,
  setSelectedTypeFilter,
  setLoadError,
  setQuizStatus,
}) {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1 style={{ fontSize: "28px", margin: "0 0 10px 0" }}>
        Choose Your Mode
      </h1>
      
      {examFilterMode === "strict" && selectedExamName && (
        <span
          style={{
            padding: "6px 12px",
            backgroundColor: "#E0E7FF",
            color: theme.primary,
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold",
            display: "inline-block",
            marginBottom: "30px",
          }}
        >
          🎯 Target: {agencyName} {selectedExamName}
        </span>
      )}
      
      {examFilterMode === "mixed" && (
        <span
          style={{
            padding: "6px 12px",
            backgroundColor: "#F3F4F6",
            color: theme.textMuted,
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold",
            display: "inline-block",
            marginBottom: "30px",
          }}
        >
          🌍 Mode: Mixed Curriculum
        </span>
      )}
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}
      >
        {[
          {
            mode: "practice",
            color: theme.success,
            icon: "📖",
            label: "Practice Mode",
            desc: "Take your time. No timers, focus on learning and reviewing answers at your own pace.",
          },
          {
            mode: "test",
            color: theme.danger,
            icon: "⏱️",
            label: "Exam Mode",
            desc: "Strict timed conditions (2 minutes per question). Scores are recorded to your dashboard.",
          },
          {
            mode: "mistake",
            color: theme.warning,
            icon: "⚠️",
            label: "Mistake Mode",
            desc: "Practice only the questions you have previously answered incorrectly.",
          },
        ].map(({ mode, color, icon, label, desc }) => (
          <div
            key={mode}
            onClick={() => {
              setExamMode(mode);
              setSelectedSubjects([]);
              setSelectedChapters([]);
              setSelectedExamFilters([]);
              setQuestionLimit("");
              setSelectedTypeFilter("Both");
              setLoadError("");
              setQuizStatus("setup");
            }}
            style={{
              ...styles.card,
              cursor: "pointer",
              borderTop: `6px solid ${color}`,
              transition: "transform 0.2s",
            }}
          >
            <h2 style={{ color, fontSize: "22px", marginBottom: "10px" }}>
              {icon} {label}
            </h2>
            <p style={{ color: theme.textMuted }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}