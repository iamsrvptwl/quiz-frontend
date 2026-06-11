import Latex from "react-latex-next";
import { theme, styles } from "../theme";
import QuestionBadges from "../components/QuestionBadges";

export default function MistakeReview({
  filterSubject,
  setFilterSubject,
  filterChapter,
  setFilterChapter,
  missedQuestions,
}) {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            margin: "0 0 5px 0",
            color: theme.danger,
            fontSize: "24px",
          }}
        >
          ⚠️ Mistake Review
        </h1>
        <p style={{ margin: 0, color: theme.textMuted, fontSize: "14px" }}>
          Study the questions you frequently get wrong.
        </p>
      </div>
      <div
        style={{
          ...styles.card,
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          backgroundColor: "#FFFBEB",
          border: "1px solid " + theme.warning,
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#92400E",
              fontSize: "14px",
            }}
          >
            Filter by Subject
          </label>
          <select
            value={filterSubject}
            onChange={(e) => {
              setFilterSubject(e.target.value);
              setFilterChapter("");
            }}
            style={{
              ...styles.input,
              marginBottom: 0,
              borderColor: "#FCD34D",
            }}
          >
            <option value="">All Subjects</option>
            {[...new Set(missedQuestions.map((mq) => mq.subject_id))].map(
              (id) => (
                <option key={id} value={id}>
                  {
                    missedQuestions.find((m) => m.subject_id === id)
                      .subject_name
                  }
                </option>
              )
            )}
          </select>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#92400E",
              fontSize: "14px",
            }}
          >
            Filter by Chapter
          </label>
          <select
            value={filterChapter}
            onChange={(e) => setFilterChapter(e.target.value)}
            disabled={!filterSubject}
            style={{
              ...styles.input,
              marginBottom: 0,
              borderColor: "#FCD34D",
            }}
          >
            <option value="">All Chapters</option>
            {[
              ...new Set(
                missedQuestions
                  .filter(
                    (mq) =>
                      mq.subject_id.toString() ===
                      filterSubject.toString()
                  )
                  .map((mq) => mq.chapter_id)
              ),
            ].map((id) => (
              <option key={id} value={id}>
                {
                  missedQuestions.find((m) => m.chapter_id === id)
                    .chapter_name
                }
              </option>
            ))}
          </select>
        </div>
      </div>

      {missedQuestions.length === 0 ? (
        <div
          style={{ ...styles.card, textAlign: "center", padding: "40px" }}
        >
          <h3 style={{ color: theme.success }}>
            You have a perfect record!
          </h3>
          <p>No mistakes logged yet.</p>
        </div>
      ) : (
        missedQuestions
          .filter((mq) =>
            filterSubject
              ? mq.subject_id.toString() === filterSubject.toString()
              : true
          )
          .filter((mq) =>
            filterChapter
              ? mq.chapter_id.toString() === filterChapter.toString()
              : true
          )
          .map((mq, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                borderLeft: "6px solid " + theme.danger,
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                  borderBottom: "1px solid " + theme.border,
                  paddingBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: theme.textMuted,
                    textTransform: "uppercase",
                  }}
                >
                  {mq.subject_name} / {mq.chapter_name}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: theme.danger,
                    backgroundColor: "#FEE2E2",
                    padding: "4px 8px",
                    borderRadius: "12px",
                  }}
                >
                  Missed {mq.error_count} times
                </span>
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  margin: "0 0 10px 0",
                  textAlign: "left",
                }}
              >
                {mq.question_text
                  .split(
                    /(?=\b\d+\.\s|Which of these|Which of the following)/i
                  )
                  .map((part, i) => (
                    <span
                      key={i}
                      style={{
                        display: "block",
                        marginTop: i > 0 ? "8px" : "0",
                      }}
                    >
                      <Latex>{part}</Latex>
                    </span>
                  ))}
              </h3>
              <QuestionBadges q={mq} />
              {mq.image_url && (
                <img
                  src={mq.image_url}
                  alt="Reference"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                  }}
                />
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                {["A", "B", "C", "D"].map((letter) => (
                  <div
                    key={letter}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      backgroundColor:
                        mq.correct_option === letter
                          ? "#D1FAE5"
                          : theme.bg,
                      border:
                        "1px solid " +
                        (mq.correct_option === letter
                          ? theme.success
                          : theme.border),
                      color:
                        mq.correct_option === letter
                          ? "#065F46"
                          : theme.textMuted,
                    }}
                  >
                    <strong style={{ marginRight: "8px" }}>
                      {letter}.
                    </strong>
                    <Latex>{mq[`option_${letter.toLowerCase()}`]}</Latex>
                    {mq.correct_option === letter && (
                      <span style={{ float: "right" }}>✅</span>
                    )}
                  </div>
                ))}
              </div>
              {mq.explanation && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    backgroundColor: "#ECFEFF",
                    borderLeft: "4px solid #06B6D4",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  <strong style={{ color: "#0891B2" }}>
                    💡 Explanation:
                  </strong>
                  <span
                    style={{
                      display: "block",
                      marginTop: "5px",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.5",
                    }}
                  >
                    <Latex>{mq.explanation}</Latex>
                  </span>
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
}