import Latex from "react-latex-next";
import { theme, styles } from "../theme";
import QuestionBadges from "../components/QuestionBadges";

export default function Results({
  examMode,
  timeLeft,
  stats,
  marksCorrect,
  marksNegative,
  questions,
  userAnswers,
}) {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ ...styles.card, textAlign: "center", padding: "30px" }}>
        <h1 style={{ fontSize: "28px", margin: "0 0 10px 0" }}>
          Session Complete!
        </h1>
        {examMode === "test" && timeLeft === 0 && (
          <p style={{ color: theme.danger, fontWeight: "bold" }}>
            ⏰ Time ran out!
          </p>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "15px",
            margin: "20px 0",
          }}
        >
          {[
            {
              val: stats.correct,
              label: "CORRECT",
              bg: "#F0FDF4",
              color: theme.success,
              lblColor: "#166534",
            },
            {
              val: stats.incorrect,
              label: "INCORRECT",
              bg: "#FEF2F2",
              color: theme.danger,
              lblColor: "#991B1B",
            },
            ...(examMode === "test"
              ? [
                  {
                    val: (
                      stats.correct * marksCorrect -
                      stats.incorrect * marksNegative
                    ).toFixed(1),
                    label: "FINAL SCORE",
                    bg: "#EEF2FF",
                    color: theme.primary,
                    lblColor: "#3730A3",
                  },
                ]
              : []),
          ].map(({ val, label, bg, color, lblColor }) => (
            <div
              key={label}
              style={{
                padding: "15px",
                backgroundColor: bg,
                borderRadius: theme.radius,
                flex: "1 1 100px",
                minWidth: "100px",
              }}
            >
              <div style={{ fontSize: "28px", fontWeight: "bold", color }}>
                {val}
              </div>
              <div
                style={{
                  color: lblColor,
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ marginBottom: "20px" }}>Detailed Review</h3>
      {questions.map((q, index) => {
        const record = userAnswers[index];
        const isUnanswered = !record?.selected;
        return (
          <div
            key={index}
            style={{
              ...styles.card,
              padding: "20px",
              borderLeft:
                "6px solid " +
                (isUnanswered
                  ? theme.warning
                  : record.isCorrect
                    ? theme.success
                    : theme.danger),
            }}
          >
            <p
              style={{
                margin: "0 0 10px 0",
                fontWeight: "600",
                fontSize: "15px",
                color: theme.textMain,
                textAlign: "left",
              }}
            >
              <span style={{ color: theme.primary, marginRight: "8px" }}>
                Q{index + 1}:
              </span>
              {q.question_text
                .split(/(?=\b\d+\.\s|Which of these|Which of the following)/i)
                .map((part, i) => (
                  <span
                    key={i}
                    style={{
                      display: "block",
                      marginTop: i > 0 ? "8px" : "0",
                      marginLeft: i > 0 ? "28px" : "0",
                    }}
                  >
                    <Latex>{part}</Latex>
                  </span>
                ))}
            </p>
            <QuestionBadges q={q} />
            {q.image_url && (
              <img
                src={q.image_url}
                alt="Diagram"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  marginBottom: "15px",
                }}
              />
            )}
            <div
              style={{
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#F9FAFB",
                fontSize: "14px",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  color: isUnanswered
                    ? theme.warning
                    : record.isCorrect
                      ? theme.success
                      : theme.danger,
                }}
              >
                <strong>Your Answer:</strong>{" "}
                {isUnanswered ? (
                  "Skipped / Time Out"
                ) : (
                  <Latex>{`${record.selected}. ${q[`option_${record.selected.toLowerCase()}`]}`}</Latex>
                )}
              </p>
              {(!record || !record.isCorrect) && (
                <p style={{ margin: 0, color: theme.textMain }}>
                  <strong>Correct Answer:</strong>{" "}
                  <Latex>{`${q.correct_option}. ${q[`option_${q.correct_option.toLowerCase()}`]}`}</Latex>
                </p>
              )}
            </div>
            {q.explanation && (
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
                  <Latex>{q.explanation}</Latex>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}