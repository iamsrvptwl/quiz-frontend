import { theme, styles } from "../theme";

export default function HomeDashboard({
  optedExams,
  agencies,
  setQuizStatus,
  handleUnoptExam,
  setSelectedAgencyId,
  setSelectedExamName,
  setExamFilterMode,
}) {
  return (
    <div
      style={{
        marginTop: "40px",
        maxWidth: "800px",
        margin: "40px auto 0",
      }}
    >
{/* HEADER WITH HISTORY & SAVED SESSIONS BUTTONS */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "10px" 
        }}
      >
        <h1 style={{ fontSize: "28px", margin: 0 }}>My Dashboard</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* NEW SAVED TESTS BUTTON */}
          <button
            onClick={() => setQuizStatus("savedSessions")}
            style={{
              ...styles.button,
              backgroundColor: "#EEF2FF",
              color: theme.primary,
              border: `1px solid ${theme.primary}`,
              width: "auto",
              padding: "10px 16px",
              fontSize: "14px",
              boxShadow: theme.shadow,
            }}
          >
            ⏸️ Saved Tests
          </button>

          <button
            onClick={() => setQuizStatus("dashboard")}
            style={{
              ...styles.button,
              ...styles.btnSuccess,
              width: "auto",
              padding: "10px 16px",
              fontSize: "14px",
              boxShadow: theme.shadow,
            }}
          >
            📊 View Test History
          </button>
        </div>
      </div>
      <p style={{ color: theme.textMuted, marginBottom: "30px", textAlign: "left" }}>
        Select an exam track to begin your practice session.
      </p>
      

      {/* EXAM LISTING */}
      {optedExams.length === 0 ? (
        <div style={{ ...styles.card, padding: "40px", textAlign: "center" }}>
          <h2 style={{ color: theme.textMuted, marginBottom: "20px" }}>
            No Exam Opted
          </h2>
          <button
            onClick={() => {
              setSelectedAgencyId("");
              setSelectedExamName("");
              setQuizStatus("examSelection");
            }}
            style={{
              ...styles.button,
              ...styles.btnPrimary,
              width: "auto",
              padding: "10px 20px",
            }}
          >
            Start Opt for Exam
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
              textAlign: "left"
            }}
          >
            {optedExams.map((exam, idx) => {
              const agency = agencies.find(
                (a) => String(a.id) === String(exam.agencyId)
              );
              return (
                <div
                  key={idx}
                  style={{
                    ...styles.card,
                    borderTop: `6px solid ${theme.primary}`,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    marginBottom: 0,
                    position: "relative",
                  }}
                  onClick={() => {
                    setSelectedAgencyId(exam.agencyId);
                    setSelectedExamName(exam.examName);
                    setExamFilterMode("strict");
                    setQuizStatus("modeSelection");
                  }}
                >
                  <button
                    onClick={(e) => handleUnoptExam(e, exam.examName)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: theme.textMuted,
                      fontSize: "16px",
                    }}
                    title="Remove from Dashboard"
                  >
                    ✕
                  </button>
                  <h3 style={{ margin: "0 0 10px 0", color: theme.primary }}>
                    {exam.examName}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: theme.textMuted,
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {agency ? agency.name : "Unknown Agency"}
                  </p>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => {
              setSelectedAgencyId("");
              setSelectedExamName("");
              setQuizStatus("examSelection");
            }}
            style={{
              ...styles.button,
              ...styles.btnOutline,
              width: "auto",
              padding: "10px 20px",
              backgroundColor: "white",
            }}
          >
            + Opt for Another Exam
          </button>
        </div>
      )}
    </div>
  );
}