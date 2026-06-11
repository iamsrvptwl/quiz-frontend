import Latex from "react-latex-next";
import { theme, styles } from "../theme";
import QuestionBadges from "../components/QuestionBadges";
import QuestionEditForm from "../components/QuestionEditForm";

export default function AdminPanel({
  currentUser,
  agencies,
  dbExams,
  structure,
  allUsers,
  pendingUsers,
  reportedQuestions,
  adminManageSubject,
  setAdminManageSubject,
  adminManageChapter,
  setAdminManageChapter,
  adminChapterQuestions,
  editingQuestion,
  setEditingQuestion,
  newAgencyName,
  setNewAgencyName,
  newExamName,
  setNewExamName,
  newExamAgencyId,
  setNewExamAgencyId,
  newQuestion,
  setNewQuestion,
  newSubjectName,
  setNewSubjectName,
  newChapterName,
  setNewChapterName,
  addingChapterForSubject,
  setAddingChapterForSubject,
  uploadSubject,
  setUploadSubject,
  uploadChapter,
  setUploadChapter,
  fileInputRef,
  setSelectedCsvFile,
  adminAction,
  handleAddAgency,
  handleAddExam,
  handleLinkExamSubject,
  approveUser,
  handleAddSubject,
  handleAddChapter,
  triggerUpload,
  submitManualQuestion,
  handleDeleteQuestion,
  handleUpdateQuestion,
  dismissReport,
}) {
  return (
    <div>
      <h1 style={{ marginBottom: "24px", fontSize: "24px" }}>
        System Administration
      </h1>

      {/* Agencies & Exams + Users + Pending */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Agencies */}
        <div style={styles.card}>
          <h3
            style={{
              margin: "0 0 15px 0",
              borderBottom: "2px solid " + theme.border,
              paddingBottom: "10px",
              fontSize: "18px",
            }}
          >
            🏢 Agencies & Exams
          </h3>
          <form
            onSubmit={handleAddAgency}
            style={{
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Add Agency (e.g. UPSC)
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                required
                value={newAgencyName}
                onChange={(e) => setNewAgencyName(e.target.value)}
                style={{ ...styles.input, marginBottom: 0 }}
              />
              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...styles.btnPrimary,
                  width: "auto",
                  padding: "8px 16px",
                }}
              >
                Add
              </button>
            </div>
          </form>
          <form
            onSubmit={handleAddExam}
            style={{
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Add Exam Track
            </label>
            <select
              required
              value={newExamAgencyId}
              onChange={(e) => setNewExamAgencyId(e.target.value)}
              style={styles.input}
            >
              <option value="">-- Select Agency --</option>
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                required
                placeholder="Exam (e.g. ESE)"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                style={{ ...styles.input, marginBottom: 0 }}
              />
              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...styles.btnSuccess,
                  width: "auto",
                  padding: "8px 16px",
                }}
              >
                Add
              </button>
            </div>
          </form>

          {/* LINK EXAM TO SUBJECT FORM */}
          <form
            onSubmit={handleLinkExamSubject}
            style={{
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#EEF2FF",
              borderRadius: "8px",
              border: `1px solid ${theme.primary}`,
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "5px",
                color: theme.primary,
              }}
            >
              🔗 Link Subject to Exam Syllabus
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <select
                name="exam_id"
                required
                style={{ ...styles.input, marginBottom: 0, flex: 1 }}
              >
                <option value="">-- Select Exam --</option>
                {dbExams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
              <select
                name="subject_id"
                required
                style={{ ...styles.input, marginBottom: 0, flex: 1 }}
              >
                <option value="">-- Select Subject --</option>
                {structure.subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...styles.btnPrimary,
                  width: "auto",
                  padding: "8px 16px",
                }}
              >
                Link
              </button>
            </div>
          </form>

          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {agencies.map((a) => (
              <div
                key={a.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid " + theme.border,
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <strong>{a.name}</strong>
                  <button
                    onClick={() => adminAction("delete", "agency", a.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: theme.danger,
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div style={{ paddingLeft: "15px", marginTop: "5px" }}>
                  {dbExams
                    .filter((e) => e.agency_id === a.id)
                    .map((ex) => (
                      <div
                        key={ex.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "13px",
                          color: theme.textMuted,
                          padding: "4px 0",
                        }}
                      >
                        <span>↳ {ex.name}</span>
                        <button
                          onClick={() => adminAction("delete", "exam", ex.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: theme.textMuted,
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Users */}
        <div style={styles.card}>
          <h3
            style={{
              margin: "0 0 15px 0",
              borderBottom: "2px solid " + theme.border,
              paddingBottom: "10px",
              fontSize: "18px",
            }}
          >
            👥 Active Users
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {allUsers.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  backgroundColor: theme.bg,
                  borderRadius: "8px",
                }}
              >
                <div>
                  <strong>{u.name}</strong>{" "}
                  <span
                    style={{
                      fontSize: "10px",
                      background: u.role === "admin" ? "#FEE2E2" : "#E0E7FF",
                      color: u.role === "admin" ? theme.danger : theme.primary,
                      padding: "2px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    {u.role.toUpperCase()}
                  </span>
                  <br />
                  <span style={{ fontSize: "12px", color: theme.textMuted }}>
                    {u.email}
                  </span>
                </div>
                <button
                  onClick={() => adminAction("delete", "user", u.id)}
                  style={{
                    ...styles.button,
                    ...styles.btnOutline,
                    color: theme.danger,
                    padding: "4px 8px",
                    fontSize: "12px",
                    width: "auto",
                    border: "none",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pending */}
        <div style={styles.card}>
          <h3
            style={{
              margin: "0 0 15px 0",
              borderBottom: "2px solid " + theme.border,
              paddingBottom: "10px",
              fontSize: "18px",
            }}
          >
            Pending Approvals
          </h3>
          {pendingUsers.length === 0 ? (
            <p style={{ color: theme.textMuted, fontSize: "14px" }}>
              No pending users.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: theme.bg,
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <strong>{u.name}</strong>
                    <br />
                    <span style={{ fontSize: "12px", color: theme.textMuted }}>
                      {u.email}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      onClick={() => approveUser(u.id)}
                      style={{
                        ...styles.button,
                        ...styles.btnSuccess,
                        padding: "6px 10px",
                        fontSize: "12px",
                        width: "auto",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => adminAction("delete", "user", u.id)}
                      style={{
                        ...styles.button,
                        ...styles.btnDanger,
                        padding: "6px 10px",
                        fontSize: "12px",
                        width: "auto",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reported Questions */}
      <div style={{ ...styles.card, border: "2px solid " + theme.warning }}>
        <h3
          style={{
            margin: "0 0 15px 0",
            borderBottom: "2px solid " + theme.border,
            paddingBottom: "10px",
            fontSize: "18px",
            color: "#92400E",
          }}
        >
          🚩 Flagged by Users
        </h3>
        {reportedQuestions.length === 0 ? (
          <p style={{ color: theme.textMuted, fontSize: "14px" }}>
            No reported questions.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {reportedQuestions.map((rq) => (
              <div
                key={rq.question_id}
                style={{
                  border: "1px solid " + theme.warning,
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#FFFBEB",
                }}
              >
                {editingQuestion?.id === rq.question_id ? (
                  <QuestionEditForm
                    editingQuestion={editingQuestion}
                    setEditingQuestion={setEditingQuestion}
                    dbExams={dbExams}
                    onSubmit={handleUpdateQuestion}
                    onCancel={() => setEditingQuestion(null)}
                  />
                ) : (
                  <>
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      <Latex>{rq.question_text}</Latex>
                    </p>
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "12px",
                        color: theme.danger,
                        fontWeight: "bold",
                      }}
                    >
                      Reported {rq.report_count} times
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => {
                          setEditingQuestion({
                            ...rq,
                            id: rq.question_id,
                          });
                          setAdminManageChapter("");
                        }}
                        style={{
                          ...styles.button,
                          backgroundColor: theme.primary,
                          color: "white",
                          padding: "6px 12px",
                          width: "auto",
                          fontSize: "12px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(rq.question_id)}
                        style={{
                          ...styles.button,
                          ...styles.btnDanger,
                          padding: "6px 12px",
                          width: "auto",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => dismissReport(rq.question_id)}
                        style={{
                          ...styles.button,
                          backgroundColor: "transparent",
                          color: theme.textMuted,
                          border: "1px solid " + theme.border,
                          padding: "6px 12px",
                          width: "auto",
                          fontSize: "12px",
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manage Existing Questions */}
      <div style={{ ...styles.card, border: "2px solid " + theme.primary }}>
        <h3
          style={{
            margin: "0 0 15px 0",
            borderBottom: "2px solid " + theme.border,
            paddingBottom: "10px",
            fontSize: "18px",
          }}
        >
          Manage Existing Questions
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <select
            value={adminManageSubject}
            onChange={(e) => {
              setAdminManageSubject(e.target.value);
              setAdminManageChapter("");
            }}
            style={{
              ...styles.input,
              flex: "1 1 200px",
              marginBottom: 0,
            }}
          >
            <option value="">Select Subject…</option>
            {structure.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={adminManageChapter}
            onChange={(e) => setAdminManageChapter(e.target.value)}
            disabled={!adminManageSubject}
            style={{
              ...styles.input,
              flex: "1 1 200px",
              marginBottom: 0,
            }}
          >
            <option value="">Select Chapter…</option>
            {structure.chapters
              .filter((c) => c.subject_id === parseInt(adminManageSubject))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        {adminChapterQuestions.map((q) => (
          <div
            key={q.id}
            style={{
              border: "1px solid " + theme.border,
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#F9FAFB",
            }}
          >
            {editingQuestion?.id === q.id ? (
              <QuestionEditForm
                editingQuestion={editingQuestion}
                setEditingQuestion={setEditingQuestion}
                dbExams={dbExams}
                onSubmit={handleUpdateQuestion}
                onCancel={() => setEditingQuestion(null)}
              />
            ) : (
              <>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  <Latex>{q.question_text}</Latex>
                </p>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "13px",
                    color: theme.textMuted,
                  }}
                >
                  <strong>Ans:</strong> {q.correct_option} | <strong>A:</strong>{" "}
                  <Latex>{q.option_a}</Latex> | <strong>B:</strong>{" "}
                  <Latex>{q.option_b}</Latex> | <strong>C:</strong>{" "}
                  <Latex>{q.option_c}</Latex> | <strong>D:</strong>{" "}
                  <Latex>{q.option_d}</Latex>
                </p>
                <QuestionBadges q={q} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setEditingQuestion(q)}
                    style={{
                      ...styles.button,
                      backgroundColor: theme.primary,
                      color: "white",
                      padding: "6px 12px",
                      width: "auto",
                      fontSize: "12px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    style={{
                      ...styles.button,
                      ...styles.btnDanger,
                      padding: "6px 12px",
                      width: "auto",
                      fontSize: "12px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {adminManageChapter && adminChapterQuestions.length === 0 && (
          <p style={{ color: theme.textMuted, fontSize: "14px" }}>
            No questions in this chapter yet.
          </p>
        )}
      </div>

      {/* Add Questions */}
      <div style={styles.card}>
        <h3
          style={{
            margin: "0 0 15px 0",
            borderBottom: "2px solid " + theme.border,
            paddingBottom: "10px",
            fontSize: "18px",
          }}
        >
          Add Questions
        </h3>
        {/* CSV Upload */}
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#F9FAFB",
            borderRadius: "8px",
            border: "1px solid " + theme.border,
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            1. Bulk CSV Upload
          </label>
          <select
            value={uploadSubject}
            onChange={(e) => {
              setUploadSubject(e.target.value);
              setUploadChapter("");
            }}
            style={styles.input}
          >
            <option value="">Select Subject</option>
            {structure.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={uploadChapter}
            onChange={(e) => setUploadChapter(e.target.value)}
            disabled={!uploadSubject}
            style={styles.input}
          >
            <option value="">Select Chapter</option>
            {structure.chapters
              .filter((c) => c.subject_id === parseInt(uploadSubject))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={(e) => setSelectedCsvFile(e.target.files[0])}
            style={{
              ...styles.input,
              backgroundColor: theme.bg,
              fontSize: "13px",
            }}
          />
          <button
            onClick={triggerUpload}
            style={{ ...styles.button, ...styles.btnPrimary }}
          >
            Upload File
          </button>
        </div>

        {/* Manual Entry */}
        <form onSubmit={submitManualQuestion}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            2. Manual Entry
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            <select
              required
              value={newQuestion.subject_id}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  subject_id: e.target.value,
                  chapter_id: "",
                })
              }
              style={{ ...styles.input, flex: "1 1 200px" }}
            >
              <option value="">Subject…</option>
              {structure.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              required
              value={newQuestion.chapter_id}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  chapter_id: e.target.value,
                })
              }
              disabled={!newQuestion.subject_id}
              style={{ ...styles.input, flex: "1 1 200px" }}
            >
              <option value="">Chapter…</option>
              {structure.chapters
                .filter((c) => c.subject_id === parseInt(newQuestion.subject_id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <textarea
            placeholder="Question Text (supports $LaTeX$)"
            required
            value={newQuestion.question_text}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                question_text: e.target.value,
              })
            }
            style={{
              ...styles.input,
              height: "80px",
              fontFamily: "inherit",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "15px",
            }}
          >
            {["a", "b", "c", "d"].map((l) => (
              <input
                key={l}
                type="text"
                placeholder={`Option ${l.toUpperCase()}`}
                required
                value={newQuestion[`option_${l}`]}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    [`option_${l}`]: e.target.value,
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
              alignItems: "flex-end",
              marginTop: "15px",
              marginBottom: "10px",
            }}
          >
            {[
              ["Answer", "correct_option", ["A", "B", "C", "D"]],
              ["Type", "question_type", ["Theory", "Numerical"]],
              ["Difficulty", "difficulty", ["Easy", "Medium", "Hard"]],
            ].map(([label, field, opts]) => (
              <div key={field} style={{ flex: "1 1 100px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  {label}
                </label>
                <select
                  value={newQuestion[field]}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      [field]: e.target.value,
                    })
                  }
                  style={{ ...styles.input, marginBottom: 0 }}
                >
                  {opts.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
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
                    checked={newQuestion.exam_ids?.includes(ex.id)}
                    style={{ marginRight: "5px" }}
                    onChange={(e) => {
                      const ids = e.target.checked
                        ? [...(newQuestion.exam_ids || []), ex.id]
                        : (newQuestion.exam_ids || []).filter(
                            (id) => id !== ex.id
                          );
                      setNewQuestion({ ...newQuestion, exam_ids: ids });
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
              value={newQuestion.exam_reference}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  exam_reference: e.target.value,
                })
              }
              style={{
                ...styles.input,
                flex: "1 1 150px",
                marginBottom: 0,
              }}
            />
            <input
              type="url"
              placeholder="Image URL (Optional)"
              value={newQuestion.image_url}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  image_url: e.target.value,
                })
              }
              style={{
                ...styles.input,
                flex: "2 1 200px",
                marginBottom: 0,
              }}
            />
          </div>
          <textarea
            placeholder="Explanation (Optional)"
            value={newQuestion.explanation}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                explanation: e.target.value,
              })
            }
            style={{
              ...styles.input,
              height: "60px",
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            style={{ ...styles.button, ...styles.btnSuccess }}
          >
            Save Question
          </button>
        </form>
      </div>

      {/* Curriculum Manager */}
      <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "15px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#F9FAFB",
            borderBottom: "1px solid " + theme.border,
          }}
        >
          <h3 style={{ margin: 0, fontSize: "16px" }}>Curriculum Manager</h3>
          <form
            onSubmit={handleAddSubject}
            style={{ display: "flex", gap: "8px" }}
          >
            <input
              type="text"
              placeholder="New subject name…"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              style={{
                ...styles.input,
                marginBottom: 0,
                width: "180px",
                padding: "6px 10px",
                fontSize: "13px",
              }}
            />
            <button
              type="submit"
              style={{
                ...styles.button,
                ...styles.btnPrimary,
                width: "auto",
                padding: "6px 12px",
                fontSize: "13px",
              }}
            >
              + Subject
            </button>
          </form>
        </div>
        <div style={{ padding: "8px 0" }}>
          {structure.subjects.map((sub) => (
            <div key={sub.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 16px",
                  backgroundColor: theme.surface,
                  borderLeft: "4px solid " + theme.primary,
                  borderBottom: "1px solid " + theme.border,
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                  {sub.name}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() =>
                      setAddingChapterForSubject(
                        addingChapterForSubject === sub.id ? null : sub.id
                      )
                    }
                    style={{
                      ...styles.button,
                      ...styles.btnOutline,
                      padding: "4px 8px",
                      fontSize: "12px",
                      width: "auto",
                    }}
                  >
                    + Chapter
                  </button>
                  <button
                    onClick={() => adminAction("delete", "subject", sub.id)}
                    style={{
                      ...styles.button,
                      ...styles.btnDanger,
                      padding: "4px 8px",
                      fontSize: "12px",
                      width: "auto",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {addingChapterForSubject === sub.id && (
                <div
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#EEF2FF",
                    borderBottom: "1px solid " + theme.border,
                  }}
                >
                  <form
                    onSubmit={(e) => handleAddChapter(e, sub.id)}
                    style={{ display: "flex", gap: "8px" }}
                  >
                    <input
                      type="text"
                      placeholder="Chapter name…"
                      value={newChapterName}
                      onChange={(e) => setNewChapterName(e.target.value)}
                      style={{
                        ...styles.input,
                        marginBottom: 0,
                        flex: 1,
                        padding: "6px 10px",
                        fontSize: "13px",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        ...styles.button,
                        ...styles.btnSuccess,
                        width: "auto",
                        padding: "6px 12px",
                        fontSize: "13px",
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingChapterForSubject(null)}
                      style={{
                        ...styles.button,
                        ...styles.btnOutline,
                        width: "auto",
                        padding: "6px 10px",
                        fontSize: "13px",
                      }}
                    >
                      ✕
                    </button>
                  </form>
                </div>
              )}
              {structure.chapters
                .filter((c) => c.subject_id === sub.id)
                .map((chap) => (
                  <div
                    key={chap.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 16px 8px 32px",
                      backgroundColor: "#FAFAFA",
                      borderBottom: "1px solid " + theme.border,
                    }}
                  >
                    <span style={{ fontSize: "13px", color: theme.textMuted }}>
                      ↳ {chap.name}
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          backgroundColor: theme.border,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          marginLeft: "8px",
                        }}
                      >
                        {chap.question_count || 0} Qs
                      </span>
                    </span>
                    <button
                      onClick={() => adminAction("delete", "chapter", chap.id)}
                      style={{
                        ...styles.button,
                        ...styles.btnOutline,
                        color: theme.danger,
                        padding: "4px 8px",
                        fontSize: "12px",
                        width: "auto",
                        border: "none",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}