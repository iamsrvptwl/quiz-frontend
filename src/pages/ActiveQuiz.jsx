import Latex from "react-latex-next";
import { theme, styles } from "../theme";
import QuestionBadges from "../components/QuestionBadges";

export default function ActiveQuiz({
  questions,
  currentIndex,
  setCurrentIndex,
  userAnswers,
  handleAnswerClick,
  examMode,
  timeLeft,
  formatTime,
  showCalculator,
  setShowCalculator,
  calcInput,
  calcResult,
  handleCalcClick,
  markedForReview,
  toggleMarkForReview,
  reportCurrentQuestion,
  handleEarlySubmit,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      {/* Question panel */}
      <div style={{ ...styles.card, flex: "1 1 500px", margin: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <span
            style={{
              fontWeight: "600",
              color: theme.textMuted,
              fontSize: "14px",
            }}
          >
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setShowCalculator((s) => !s)}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                borderRadius: "20px",
                border: "1px solid " + theme.border,
                backgroundColor: showCalculator ? theme.primary : "#F3F4F6",
                color: showCalculator ? "white" : theme.primary,
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s",
              }}
            >
              🖩 Calculator
            </button>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color:
                  examMode === "test"
                    ? timeLeft < 30
                      ? theme.danger
                      : theme.textMain
                    : theme.success,
              }}
            >
              {examMode === "test"
                ? `⏱️ ${formatTime(timeLeft)}`
                : "📖 Active"}
            </span>
          </div>
        </div>

        <h2
          style={{
            fontSize: "20px",
            lineHeight: "1.5",
            marginBottom: "10px",
            color: theme.textMain,
            textAlign: "left",
          }}
        >
          {questions[currentIndex].question_text
            .split(/(?=\b\d+\.\s|Which of these|Which of the following)/i)
            .map((part, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  marginTop: i > 0 ? "12px" : "0",
                }}
              >
                <Latex>{part}</Latex>
              </span>
            ))}
        </h2>
        <QuestionBadges q={questions[currentIndex]} />

        {questions[currentIndex].image_url && (
          <div
            style={{
              textAlign: "center",
              margin: "0 0 20px 0",
              padding: "10px",
              backgroundColor: "#F9FAFB",
              borderRadius: theme.radius,
            }}
          >
            <img
              src={questions[currentIndex].image_url}
              alt="Diagram"
              style={{
                maxWidth: "100%",
                maxHeight: "350px",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {["a", "b", "c", "d"].map((letter) => {
            const isSelected =
              userAnswers[currentIndex]?.selected === letter.toUpperCase();
            return (
              <button
                key={letter}
                onClick={() => handleAnswerClick(letter.toUpperCase())}
                style={{
                  ...styles.input,
                  textAlign: "left",
                  marginBottom: 0,
                  padding: "14px 16px",
                  cursor: "pointer",
                  fontSize: "15px",
                  backgroundColor: isSelected ? "#EEF2FF" : theme.surface,
                  border:
                    "1px solid " + (isSelected ? theme.primary : theme.border),
                  transition: "all 0.2s",
                }}
              >
                <strong
                  style={{
                    marginRight: "10px",
                    color: isSelected ? theme.primary : theme.textMain,
                  }}
                >
                  {letter.toUpperCase()}.
                </strong>
                <Latex>{questions[currentIndex][`option_${letter}`]}</Latex>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={reportCurrentQuestion}
            style={{
              background: "none",
              border: "none",
              color: theme.warning,
              cursor: "pointer",
              fontWeight: "600",
              padding: "10px",
            }}
          >
            🚩 Report Mistake
          </button>
          <button
            onClick={toggleMarkForReview}
            style={{
              background: markedForReview.has(currentIndex)
                ? "#EDE9FE"
                : "none",
              border:
                "2px solid " +
                (markedForReview.has(currentIndex)
                  ? "#8B5CF6"
                  : theme.border),
              color: markedForReview.has(currentIndex)
                ? "#6D28D9"
                : theme.textMuted,
              cursor: "pointer",
              fontWeight: "bold",
              padding: "8px 16px",
              borderRadius: "20px",
            }}
          >
            {markedForReview.has(currentIndex)
              ? "📌 Marked"
              : "📌 Mark for Review"}
          </button>
        </div>

        {/* Calculator */}
        {showCalculator && (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#1E293B",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#0F172A",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "15px",
                textAlign: "right",
                minHeight: "60px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94A3B8",
                  minHeight: "18px",
                }}
              >
                {calcInput || "0"}
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {calcResult}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "6px",
              }}
            >
              {["sin(", "cos(", "tan(", "log(", "ln("].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  style={{
                    padding: "8px 0",
                    fontSize: "12px",
                    backgroundColor: "#334155",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {btn.replace("(", "")}
                </button>
              ))}
              {["(", ")", "sqrt(", "^", "π"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  style={{
                    padding: "8px 0",
                    fontSize: "12px",
                    backgroundColor: "#334155",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {btn.replace("(", "")}
                </button>
              ))}
              {[
                ["7", "#1E293B"],
                ["8", "#1E293B"],
                ["9", "#1E293B"],
                ["/", "#475569"],
                ["C", "#475569"],
                ["4", "#1E293B"],
                ["5", "#1E293B"],
                ["6", "#1E293B"],
                ["*", "#475569"],
                ["AC", "#475569"],
                ["1", "#1E293B"],
                ["2", "#1E293B"],
                ["3", "#1E293B"],
                ["-", "#475569"],
                ["e", "#475569"],
                ["0", "#1E293B"],
                [".", "#1E293B"],
                ["=", theme.primary],
                ["+", "#475569"],
              ].map(([btn, bg]) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  style={{
                    padding: "8px 0",
                    fontSize: "14px",
                    fontWeight: "bold",
                    backgroundColor: bg,
                    color: btn === "C" || btn === "AC" ? "#FCA5A5" : "white",
                    border: "1px solid #334155",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {btn}
                </button>
              ))}
              <div />
            </div>
          </div>
        )}
      </div>

      {/* Navigator sidebar */}
      <div
        style={{
          flex: "0 0 280px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div
          style={{
            ...styles.card,
            margin: 0,
            position: "sticky",
            top: "80px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "20px",
              fontSize: "16px",
              borderBottom: "2px solid " + theme.border,
              paddingBottom: "10px",
            }}
          >
            Question Navigator
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "10px",
              marginBottom: "30px",
            }}
          >
            {questions.map((q, idx) => {
              const isAnswered = !!userAnswers[idx]?.selected;
              const isCurrent = currentIndex === idx;
              const isMarked = markedForReview.has(idx);
              return (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "13px",
                    backgroundColor: isAnswered ? theme.primary : theme.bg,
                    color: isAnswered ? "white" : theme.textMain,
                    border: isCurrent
                      ? "3px solid " + theme.danger
                      : isMarked
                        ? "3px solid #8B5CF6"
                        : "1px solid " +
                          (isAnswered ? theme.primary : theme.border),
                    boxShadow: isCurrent
                      ? "0 0 0 2px rgba(239,68,68,0.2)"
                      : "none",
                  }}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: theme.textMuted,
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: theme.primary,
                }}
              ></div>{" "}
              Answered
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: theme.bg,
                  border: "1px solid " + theme.border,
                }}
              ></div>{" "}
              Unanswered
            </div>
          </div>
          <button
            onClick={handleEarlySubmit}
            style={{ ...styles.button, ...styles.btnSuccess }}
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}