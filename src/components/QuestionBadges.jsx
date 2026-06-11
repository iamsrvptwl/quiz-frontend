import { theme } from "../theme";

export default function QuestionBadges({ q }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "20px",
      }}
    >
      {q.difficulty && (
        <span
          style={{
            padding: "4px 10px",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
            backgroundColor:
              q.difficulty === "Hard"
                ? "#FEE2E2"
                : q.difficulty === "Medium"
                  ? "#FEF3C7"
                  : "#D1FAE5",
            color:
              q.difficulty === "Hard"
                ? "#991B1B"
                : q.difficulty === "Medium"
                  ? "#92400E"
                  : "#065F46",
          }}
        >
          ⚡ {q.difficulty}
        </span>
      )}
      {q.question_type && (
        <span
          style={{
            padding: "4px 10px",
            backgroundColor: "#FCE7F3",
            color: "#831843",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        >
          🧠 {q.question_type}
        </span>
      )}
      {q.exam_names &&
        q.exam_names.map((exName, i) => (
          <span
            key={i}
            style={{
              padding: "4px 10px",
              backgroundColor: "#E0E7FF",
              color: theme.primary,
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            🏷️ {exName}
          </span>
        ))}
      {q.exam_reference && (!q.exam_names || q.exam_names.length === 0) && (
        <span
          style={{
            padding: "4px 10px",
            backgroundColor: "#E0E7FF",
            color: theme.primary,
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        >
          🏷️ {q.exam_reference}
        </span>
      )}
    </div>
  );
}