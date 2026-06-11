import Latex from "react-latex-next";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { theme, styles, CHART_COLORS } from "../theme";

export default function Analytics({
  handleClearHistory,
  peerCompareSubject,
  setPeerCompareSubject,
  fetchPeerStats,
  structure,
  peerStats,
  pastResults,
  missedQuestions,
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>My Analytics</h1>
        <button
          onClick={handleClearHistory}
          style={{
            ...styles.button,
            backgroundColor: "#FFF0F0",
            color: theme.danger,
            border: "1px solid " + theme.danger,
            width: "auto",
            padding: "8px 16px",
            fontSize: "14px",
          }}
        >
          🗑️ Clear History
        </button>
      </div>

      {/* NEW PEER COMPARISON WIDGET */}
      <div
        style={{
          ...styles.card,
          padding: "20px",
          backgroundColor: "#EFF6FF",
          borderLeft: `6px solid ${theme.primary}`,
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", color: theme.primary }}>
          🌍 Global Peer Comparison
        </h3>
        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            style={{
              ...styles.input,
              marginBottom: 0,
              width: "auto",
              minWidth: "250px",
            }}
            value={peerCompareSubject}
            onChange={(e) => {
              setPeerCompareSubject(e.target.value);
              fetchPeerStats(e.target.value);
            }}
          >
            <option value="">Select a Subject to Compare...</option>
            {structure.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {peerStats && (
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "10px 15px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                }}
              >
                <p
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "12px",
                    color: theme.textMuted,
                  }}
                >
                  YOUR AVERAGE
                </p>
                <strong style={{ fontSize: "20px", color: theme.textMain }}>
                  {peerStats.user.my_accuracy
                    ? parseFloat(peerStats.user.my_accuracy).toFixed(1) + "%"
                    : "No Data"}
                </strong>
              </div>
              <div
                style={{
                  padding: "10px 15px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                }}
              >
                <p
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "12px",
                    color: theme.textMuted,
                  }}
                >
                  GLOBAL AVERAGE
                </p>
                <strong style={{ fontSize: "20px", color: theme.primary }}>
                  {peerStats.global.global_accuracy
                    ? parseFloat(peerStats.global.global_accuracy).toFixed(1) +
                      "%"
                    : "No Data"}
                </strong>
              </div>
              {peerStats.user.my_accuracy &&
                peerStats.global.global_accuracy && (
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      backgroundColor:
                        parseFloat(peerStats.user.my_accuracy) >=
                        parseFloat(peerStats.global.global_accuracy)
                          ? "#D1FAE5"
                          : "#FEE2E2",
                      color:
                        parseFloat(peerStats.user.my_accuracy) >=
                        parseFloat(peerStats.global.global_accuracy)
                          ? "#065F46"
                          : theme.danger,
                    }}
                  >
                    {parseFloat(peerStats.user.my_accuracy) >=
                    parseFloat(peerStats.global.global_accuracy)
                      ? "📈 Top Percentile"
                      : "📉 Below Average"}
                  </span>
                )}
            </div>
          )}
        </div>
      </div>

      {(() => {
        if (pastResults.length === 0)
          return (
            <div
              style={{
                ...styles.card,
                textAlign: "center",
                padding: "40px",
              }}
            >
              Take your first timed exam to generate analytics!
            </div>
          );
        const totalExams = pastResults.length;
        const avgAccuracy = Math.round(
          pastResults.reduce((s, r) => s + parseFloat(r.accuracy), 0) /
            totalExams
        );
        const subjectStats = pastResults.reduce((acc, curr) => {
          if (!acc[curr.subject_name])
            acc[curr.subject_name] = {
              attempts: 0,
              totalAccuracy: 0,
              highest: 0,
            };
          acc[curr.subject_name].attempts++;
          acc[curr.subject_name].totalAccuracy += parseFloat(curr.accuracy);
          if (parseFloat(curr.accuracy) > acc[curr.subject_name].highest)
            acc[curr.subject_name].highest = parseFloat(curr.accuracy);
          return acc;
        }, {});
        let bestSubject = Object.keys(subjectStats)[0] || "N/A";
        let highestAvg = -1;
        Object.keys(subjectStats).forEach((subj) => {
          const avg =
            subjectStats[subj].totalAccuracy / subjectStats[subj].attempts;
          if (avg > highestAvg && subjectStats[subj].attempts >= 2) {
            highestAvg = avg;
            bestSubject = subj;
          }
        });
        const subjectData = Object.keys(subjectStats).map((name) => ({
          name,
          accuracy: Math.round(
            subjectStats[name].totalAccuracy / subjectStats[name].attempts
          ),
          tests: subjectStats[name].attempts,
          fullMark: 100,
        }));
        const trendData = [...pastResults].reverse().map((r, i) => ({
          name: `Test ${i + 1}`,
          date: new Date(r.created_at).toLocaleDateString(),
          accuracy: parseFloat(r.accuracy),
          score: parseFloat(r.score),
        }));

        return (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              {[
                {
                  label: "Total Exams Taken",
                  val: totalExams,
                  color: theme.primary,
                  size: "36px",
                },
                {
                  label: "Overall Accuracy",
                  val: avgAccuracy + "%",
                  color: avgAccuracy > 70 ? theme.success : theme.warning,
                  size: "36px",
                },
                {
                  label: "Strongest Subject",
                  val: bestSubject,
                  color: theme.textMain,
                  size: "20px",
                },
              ].map(({ label, val, color, size }) => (
                <div
                  key={label}
                  style={{
                    ...styles.card,
                    marginBottom: 0,
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 5px",
                      color: theme.textMuted,
                      fontSize: "14px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </p>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: size,
                      color,
                      paddingTop: size === "20px" ? "10px" : 0,
                    }}
                  >
                    {val}
                  </h2>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "24px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  ...styles.card,
                  flex: "2 1 500px",
                  marginBottom: 0,
                }}
              >
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>
                  📈 Progress Over Time
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: theme.textMuted }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: theme.textMuted }}
                      axisLine={false}
                      tickLine={false}
                      unit="%"
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: theme.shadow,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke={theme.primary}
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {subjectData.length > 2 && (
                <div
                  style={{
                    ...styles.card,
                    flex: "1 1 300px",
                    marginBottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "16px",
                      width: "100%",
                    }}
                  >
                    🎯 Subject Mastery
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      data={subjectData}
                    >
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{ fill: theme.textMuted, fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Accuracy"
                        dataKey="accuracy"
                        stroke={theme.success}
                        fill={theme.success}
                        fillOpacity={0.5}
                      />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "24px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  ...styles.card,
                  flex: "2 1 400px",
                  marginBottom: 0,
                }}
              >
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>
                  📊 Accuracy by Subject
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={subjectData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: theme.textMain }}
                      width={120}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: theme.shadow,
                      }}
                    />
                    <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={24}>
                      {subjectData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            entry.accuracy >= 80
                              ? theme.success
                              : entry.accuracy >= 50
                                ? theme.warning
                                : theme.danger
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div
                style={{
                  ...styles.card,
                  flex: "1 1 300px",
                  marginBottom: 0,
                }}
              >
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>
                  🍩 Practice Distribution
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={subjectData}
                      dataKey="tests"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {subjectData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: theme.shadow,
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {missedQuestions.length > 0 && (
              <div style={styles.card}>
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    color: theme.danger,
                    fontSize: "18px",
                  }}
                >
                  ⚠️ Frequently Missed Questions
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ ...styles.table, minWidth: "400px" }}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Subject</th>
                        <th style={styles.th}>Question</th>
                        <th style={styles.th}>Mistakes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {missedQuestions.map((mq, i) => (
                        <tr
                          key={i}
                          style={{
                            backgroundColor:
                              i % 2 === 0 ? theme.surface : "#F9FAFB",
                          }}
                        >
                          <td
                            style={{
                              ...styles.td,
                              whiteSpace: "nowrap",
                              fontWeight: "bold",
                            }}
                          >
                            {mq.subject_name}
                          </td>
                          <td style={styles.td}>
                            <Latex>{mq.question_text}</Latex>
                          </td>
                          <td
                            style={{
                              ...styles.td,
                              color: theme.danger,
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {mq.error_count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  padding: "20px",
                  borderBottom: "1px solid " + theme.border,
                }}
              >
                <h3 style={{ margin: 0, fontSize: "18px" }}>
                  📝 Full Test History
                </h3>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ ...styles.table, minWidth: "400px" }}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Subject</th>
                      <th style={styles.th}>Score</th>
                      <th style={styles.th}>Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastResults.map((r, i) => (
                      <tr key={i}>
                        <td style={styles.td}>
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                          <strong>{r.subject_name}</strong>
                        </td>
                        <td style={styles.td}>{r.score}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              color:
                                r.accuracy >= 70 ? theme.success : theme.danger,
                              fontWeight: "bold",
                            }}
                          >
                            {r.accuracy}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}