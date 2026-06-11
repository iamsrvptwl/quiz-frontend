import { theme, styles } from "../theme";

export default function QuestionEditForm({
  editingQuestion,
  setEditingQuestion,
  dbExams,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit}>
      <textarea
        required
        value={editingQuestion.question_text}
        onChange={(e) =>
          setEditingQuestion({
            ...editingQuestion,
            question_text: e.target.value,
          })
        }
        style={{ ...styles.input, height: "80px", fontFamily: "inherit" }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        {["a", "b", "c", "d"].map((letter) => (
          <input
            key={letter}
            type="text"
            required
            placeholder={`Option ${letter.toUpperCase()}`}
            value={editingQuestion[`option_${letter}`]}
            onChange={(e) =>
              setEditingQuestion({
                ...editingQuestion,
                [`option_${letter}`]: e.target.value,
              })
            }
            style={{ ...styles.input, marginBottom: 0 }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        {[
          ["correct_option", ["A", "B", "C", "D"]],
          ["question_type", ["Theory", "Numerical"]],
          ["difficulty", ["Easy", "Medium", "Hard"]],
        ].map(([field, opts]) => (
          <select
            key={field}
            value={editingQuestion[field]}
            onChange={(e) =>
              setEditingQuestion({ ...editingQuestion, [field]: e.target.value })
            }
            style={{ ...styles.input, flex: "1 1 120px", marginBottom: 0 }}
          >
            {opts.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ))}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        >
          Link to Exams
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {dbExams.map((ex) => (
            <label
              key={ex.id}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                backgroundColor: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid " + theme.border,
              }}
            >
              <input
                type="checkbox"
                checked={editingQuestion.exam_ids?.includes(ex.id)}
                style={{ marginRight: "5px" }}
                onChange={(e) => {
                  const ids = e.target.checked
                    ? [...(editingQuestion.exam_ids || []), ex.id]
                    : (editingQuestion.exam_ids || []).filter(
                        (id) => id !== ex.id,
                      );
                  setEditingQuestion({ ...editingQuestion, exam_ids: ids });
                }}
              />{" "}
              {ex.name}
            </label>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Legacy Exam Tag (e.g. ESE 2024)"
          value={editingQuestion.exam_reference || ""}
          onChange={(e) =>
            setEditingQuestion({
              ...editingQuestion,
              exam_reference: e.target.value,
            })
          }
          style={{ ...styles.input, flex: "1 1 150px", marginBottom: 0 }}
        />
        <input
          type="url"
          placeholder="Image URL (Optional)"
          value={editingQuestion.image_url || ""}
          onChange={(e) =>
            setEditingQuestion({ ...editingQuestion, image_url: e.target.value })
          }
          style={{ ...styles.input, flex: "2 1 180px", marginBottom: 0 }}
        />
      </div>
      <textarea
        placeholder="Explanation (Optional)"
        value={editingQuestion.explanation || ""}
        onChange={(e) =>
          setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
        }
        style={{ ...styles.input, height: "60px", fontFamily: "inherit" }}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="submit"
          style={{
            ...styles.button,
            ...styles.btnSuccess,
            padding: "8px 16px",
            width: "auto",
            fontSize: "13px",
          }}
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            ...styles.button,
            ...styles.btnOutline,
            padding: "8px 16px",
            width: "auto",
            fontSize: "13px",
            backgroundColor: "white",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}