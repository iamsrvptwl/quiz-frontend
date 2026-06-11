import { theme, styles, API_URL } from "../theme";

export default function ExamSelection({
  selectedAgencyId,
  setSelectedAgencyId,
  selectedExamName,
  setSelectedExamName,
  agencies,
  dbExams,
  optedExams,
  setOptedExams,
  currentUser,
  setQuizStatus,
}) {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "40px",
        maxWidth: "600px",
        margin: "40px auto 0",
      }}
    >
      <h1 style={{ fontSize: "28px", margin: "0 0 10px 0" }}>
        What are you preparing for?
      </h1>
      <p style={{ color: theme.textMuted, marginBottom: "30px" }}>
        Select your target to add it to your dashboard.
      </p>
      <div style={{ ...styles.card, textAlign: "left" }}>
        <label
          style={{
            display: "block",
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          1. Recruitment Agency
        </label>
        <select
          value={selectedAgencyId}
          onChange={(e) => {
            setSelectedAgencyId(e.target.value);
            setSelectedExamName("");
          }}
          style={styles.input}
        >
          <option value="">-- Select Agency (Optional) --</option>
          {agencies.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        
        <label
          style={{
            display: "block",
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          2. Exam Track
        </label>
        <select
          value={selectedExamName}
          onChange={(e) => setSelectedExamName(e.target.value)}
          disabled={!selectedAgencyId}
          style={styles.input}
        >
          <option value="">
            {selectedAgencyId
              ? "-- Select Exam --"
              : "Select an agency first"}
          </option>
          {dbExams
            .filter((e) => String(e.agency_id) === String(selectedAgencyId))
            .map((ex) => (
              <option key={ex.id} value={ex.name}>
                {ex.name}
              </option>
            ))}
        </select>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            disabled={!selectedAgencyId || !selectedExamName}
            onClick={async () => {
              const alreadyOpted = optedExams.some(
                (e) =>
                  String(e.agencyId) === String(selectedAgencyId) &&
                  e.examName === selectedExamName
              );

              if (!alreadyOpted) {
                try {
                  await fetch(`${API_URL}/opt-exam`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      user_id: currentUser.id,
                      agency_id: selectedAgencyId,
                      exam_name: selectedExamName,
                    }),
                  });

                  setOptedExams([
                    ...optedExams,
                    {
                      agencyId: selectedAgencyId,
                      examName: selectedExamName,
                    },
                  ]);
                } catch (err) {
                  alert("Failed to save exam to database.");
                }
              }
              setQuizStatus("home");
            }}
            style={{
              ...styles.button,
              ...styles.btnPrimary,
              opacity: !selectedAgencyId || !selectedExamName ? 0.5 : 1,
            }}
          >
            Opt In & Add to Dashboard
          </button>

          <button
            onClick={() => setQuizStatus("home")}
            style={{
              ...styles.button,
              ...styles.btnOutline,
              backgroundColor: "white",
              width: "auto",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}