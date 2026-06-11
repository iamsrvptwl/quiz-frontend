import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import * as math from "mathjs";
import * as ReactIs from 'react-is';

// --- IMPORTS: Constants & Components ---
import { API_URL, theme, styles } from "./theme";
import Navbar from "./components/Navbar";

// --- IMPORTS: Pages ---
import AuthScreen from "./pages/AuthScreen";
import HomeDashboard from "./pages/HomeDashboard";
import ExamSelection from "./pages/ExamSelection";
import ModeSelection from "./pages/ModeSelection";
import SetupSession from "./pages/SetupSession";
import ActiveQuiz from "./pages/ActiveQuiz";
import Results from "./pages/Results";
import Analytics from "./pages/Analytics";
import MistakeReview from "./pages/MistakeReview";
import AdminPanel from "./pages/AdminPanel";
import TestHistory from "./pages/TestHistory";


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // --- 1. GLOBAL USER STATE ---
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quiz_user")) || null;
    } catch {
      return null;
    }
  });

  const [sessionTimeLeft, setSessionTimeLeft] = useState(null);
  const [optedExams, setOptedExams] = useState([]);

  // --- 2. HYBRID ROUTING STATE ---
  const loadSavedQuiz = () => {
    try {
      const s = sessionStorage.getItem("active_quiz");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  };
  const savedQuiz = loadSavedQuiz();

  const [quizStatusState, setQuizStatusState] = useState(() => {
    const s = sessionStorage.getItem("quiz_status");
    return (s === "active" || s === "results") && savedQuiz ? s : "home";
  });

  // Sync Browser URL with State
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard") setQuizStatusState("home");
    else if (path === "/add-exam") setQuizStatusState("examSelection");
    else if (path === "/history") setQuizStatusState("dashboard");
    else if (path === "/review") setQuizStatusState("reviewErrors");
    else if (path === "/admin") setQuizStatusState("admin");
    // We explicitly ignore "/practice" here so local state handles the quiz flow!
  }, [location.pathname]);

  // Intercept Navigation
  const setQuizStatus = (newStatus) => {
    setQuizStatusState(newStatus);
    if (newStatus === "home") navigate("/dashboard");
    else if (newStatus === "examSelection") navigate("/add-exam");
    else if (newStatus === "dashboard") navigate("/analytics");
    else if (newStatus === "reviewErrors") navigate("/review");
    else if (newStatus === "admin") navigate("/admin");
    else navigate("/practice"); 
  };

  // --- 3. APPLICATION STATE ---
  const [agencies, setAgencies] = useState([]);
  const [dbExams, setDbExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [examReferences, setExamReferences] = useState([]);

  // Selection Filters
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [selectedExamName, setSelectedExamName] = useState("");
  const [examFilterMode, setExamFilterMode] = useState("mixed");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedExamFilters, setSelectedExamFilters] = useState([]);
  const [relevantSubjectIds, setRelevantSubjectIds] = useState(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("Both");
  const [questionLimit, setQuestionLimit] = useState("");
  const [marksCorrect, setMarksCorrect] = useState(2);
  const [marksNegative, setMarksNegative] = useState(0.66);

  // Active Quiz State
  const [examMode, setExamMode] = useState(savedQuiz?.examMode || "");
  const [questions, setQuestions] = useState(savedQuiz?.questions || []);
  const [currentIndex, setCurrentIndex] = useState(savedQuiz?.currentIndex || 0);
  const [stats, setStats] = useState(savedQuiz?.stats || { correct: 0, incorrect: 0 });
  const [timeLeft, setTimeLeft] = useState(savedQuiz?.timeLeft || 0);
  const [userAnswers, setUserAnswers] = useState(savedQuiz?.userAnswers || {});
  const [markedForReview, setMarkedForReview] = useState(new Set(savedQuiz?.markedForReview || []));
  const [showCalculator, setShowCalculator] = useState(savedQuiz?.showCalculator || false);
  const [calcInput, setCalcInput] = useState(savedQuiz?.calcInput || "");
  const [calcResult, setCalcResult] = useState(savedQuiz?.calcResult || "");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Dashboard & Admin State
  const [pastResults, setPastResults] = useState([]);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [peerCompareSubject, setPeerCompareSubject] = useState("");
  const [peerStats, setPeerStats] = useState(null);

  const [structure, setStructure] = useState({ subjects: [], chapters: [] });
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [adminManageSubject, setAdminManageSubject] = useState("");
  const [adminManageChapter, setAdminManageChapter] = useState("");
  const [adminChapterQuestions, setAdminChapterQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [reportedQuestions, setReportedQuestions] = useState([]);
  const [newAgencyName, setNewAgencyName] = useState("");
  const [newExamName, setNewExamName] = useState("");
  const [newExamAgencyId, setNewExamAgencyId] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newChapterName, setNewChapterName] = useState("");
  const [addingChapterForSubject, setAddingChapterForSubject] = useState(null);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  const [uploadSubject, setUploadSubject] = useState("");
  const [uploadChapter, setUploadChapter] = useState("");
  const [selectedCsvFile, setSelectedCsvFile] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    subject_id: "", chapter_id: "", question_text: "", option_a: "", option_b: "", option_c: "", option_d: "",
    correct_option: "A", image_url: "", exam_reference: "", question_type: "Theory", difficulty: "Medium", explanation: "", exam_ids: [],
  });

  const activeAgency = agencies.find((a) => String(a.id) === String(selectedAgencyId));
  const agencyName = activeAgency ? activeAgency.name : "";

  // --- 4. EFFECTS ---

  // Persist Active Quiz State
  useEffect(() => {
    sessionStorage.setItem("quiz_status", quizStatusState);
    if (quizStatusState === "active" || quizStatusState === "results") {
      sessionStorage.setItem(
        "active_quiz",
        JSON.stringify({
          examMode, questions, currentIndex, stats, timeLeft, userAnswers,
          markedForReview: Array.from(markedForReview), showCalculator, calcInput, calcResult,
        })
      );
    } else {
      sessionStorage.removeItem("active_quiz");
    }
  }, [quizStatusState, examMode, questions, currentIndex, stats, timeLeft, userAnswers, markedForReview, showCalculator, calcInput, calcResult]);

  // Session Timeout
  useEffect(() => {
    if (!currentUser) {
      setSessionTimeLeft(null);
      return;
    }
    const checkSession = () => {
      const loginTime = localStorage.getItem("quiz_login_time");
      if (!loginTime) return;
      const remaining = 1800000 - (Date.now() - parseInt(loginTime));
      if (remaining <= 0) {
        alert("Your session has expired. Please log in again.");
        logout();
      } else {
        setSessionTimeLeft(remaining);
      }
    };
    checkSession();
    const interval = setInterval(checkSession, 1000);
    let lastUpdate = Date.now();
    const resetTimer = () => {
      const now = Date.now();
      if (now - lastUpdate > 1000) {
        localStorage.setItem("quiz_login_time", now.toString());
        lastUpdate = now;
      }
    };
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);
    return () => {
      clearInterval(interval);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [currentUser]);

  // Initial Data Load (Curriculum)
  useEffect(() => {
    if (!currentUser) return;
    
    const load = async () => {
      try {
        const [structRes, agencyRes, examRes] = await Promise.all([
          fetch(`${API_URL}/admin/structure`),
          fetch(`${API_URL}/agencies`),
          fetch(`${API_URL}/exams`),
        ]);

        // Read the JSON exactly ONCE and store it in a variable
        const structData = await structRes.json();
        
        // Use that variable to set both states
        setSubjects(structData.subjects);
        setChapters(structData.chapters);
        
        setAgencies(await agencyRes.json());
        setDbExams(await examRes.json());
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    };
    
    load();
  }, [currentUser]);

  // Fetch Opted Exams
  useEffect(() => {
    if (currentUser) {
      fetch(`${API_URL}/opted-exams/${currentUser.id}`)
        .then(res => res.json())
        .then(data => setOptedExams(data))
        .catch(err => console.error(err));
    } else {
      setOptedExams([]);
    }
  }, [currentUser]);

  // Fetch Relevant Subjects for Strict Exam Mode
  useEffect(() => {
    if (quizStatusState !== "setup") return;
    if (examFilterMode !== "strict" || !selectedExamName) {
      setRelevantSubjectIds(null);
      return;
    }
    const fetchRelevantSubjects = async () => {
      try {
        const res = await fetch(`${API_URL}/exam-subjects?exam=${encodeURIComponent(selectedExamName)}`);
        if (res.ok) {
          const data = await res.json();
          setRelevantSubjectIds(data.map(d => String(d.id))); 
        } else setRelevantSubjectIds(null);
      } catch (err) { setRelevantSubjectIds(null); }
    };
    fetchRelevantSubjects();
  }, [quizStatusState, examFilterMode, selectedExamName]);

  // Fetch Exam References (Tags)
  useEffect(() => {
    if (quizStatusState !== "setup" || !currentUser || selectedSubjects.length === 0) {
      setExamReferences([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/available-exam-references`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject_ids: selectedSubjects.map(Number),
            chapter_ids: selectedChapters.map(Number),
            mode: examMode,
            user_id: currentUser.id,
          }),
        });
        const data = await res.json();
        const extracted = data
          .map((d) => d ? d.split(/[0-9]|\[|\(|CBT|Paper|Shift|Date/i)[0].replace(/[-:\.,\s]+$/, "").trim() : "")
          .filter(Boolean);
        setExamReferences([...new Set(extracted)].sort());
      } catch (err) { console.error(err); }
    }, 350);
    return () => clearTimeout(timer);
  }, [selectedSubjects, selectedChapters, examMode, quizStatusState, currentUser]);

  // Load Admin Data
  useEffect(() => {
    if (quizStatusState !== "admin") return;
    Promise.all([
      fetch(`${API_URL}/admin/structure`),
      fetch(`${API_URL}/admin/users`),
      fetch(`${API_URL}/admin/pending-users`),
      fetch(`${API_URL}/admin/reported-questions`),
    ]).then(async ([s, u, p, r]) => {
        setStructure(await s.json());
        setAllUsers(await u.json());
        setPendingUsers(await p.json());
        setReportedQuestions(await r.json());
      }).catch(err => console.error(err));
  }, [quizStatusState]);

  // Load Dashboard/Analytics Data
  useEffect(() => {
    if (!currentUser || !["dashboard", "reviewErrors", "setup"].includes(quizStatusState)) return;
    Promise.all([
      fetch(`${API_URL}/my-results/${currentUser.id}`),
      fetch(`${API_URL}/incorrect-questions/${currentUser.id}`),
    ]).then(async ([r1, r2]) => {
        setPastResults(await r1.json());
        setMissedQuestions(await r2.json());
      }).catch(err => console.error(err));
  }, [quizStatusState, currentUser]);

  // Load Chapter Questions for Admin Edit
  useEffect(() => {
    if (!adminManageChapter) {
      setAdminChapterQuestions([]);
      setEditingQuestion(null);
      return;
    }
    fetch(`${API_URL}/questions/${adminManageChapter}`)
      .then((r) => r.json())
      .then(setAdminChapterQuestions)
      .catch((err) => console.error(err));
  }, [adminManageChapter]);

  // Active Quiz Timer
  const userAnswersRef = useRef(userAnswers);
  useEffect(() => { userAnswersRef.current = userAnswers; }, [userAnswers]);

  useEffect(() => {
    if (quizStatusState !== "active" || examMode !== "test") return;
    if (timeLeft > 0) {
      const tid = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(tid);
    }
    if (timeLeft === 0) finishQuiz();
  }, [timeLeft, quizStatusState, examMode]);

  // Protect hybrid quiz flow from browser back button
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (quizStatusState === "active") {
        e.preventDefault();
        e.returnValue = "Are you sure? Your quiz progress will be lost.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [quizStatusState]);


  // --- 5. FUNCTIONS ---

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("quiz_user");
    localStorage.removeItem("quiz_login_time");
    sessionStorage.clear();
    setOptedExams([]);
    navigate("/");
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${s % 60 < 10 ? "0" : ""}${s % 60}`;

  const handleCalcClick = (val) => {
    if (val === "AC") { setCalcInput(""); setCalcResult(""); return; }
    if (val === "C") { setCalcInput((prev) => prev.slice(0, -1)); return; }
    if (val === "=") {
      try {
        const expr = calcInput.replace(/π/g, "pi").replace(/\^/g, "^");
        const res = math.evaluate(expr);
        setCalcResult(Number.isFinite(res) ? parseFloat(res.toFixed(6)).toString() : "Error");
      } catch { setCalcResult("Error"); }
      return;
    }
    setCalcInput((prev) => prev + val);
  };

  const fetchPeerStats = async (subjectId) => {
    if (!subjectId) return setPeerStats(null);
    try {
      const res = await fetch(`${API_URL}/peer-comparison/${subjectId}/${currentUser.id}`);
      if (res.ok) setPeerStats(await res.json());
    } catch (err) { console.error(err); }
  };

  const toggleSubject = (idStr) => {
    setSelectedSubjects((prev) => {
      const newSubs = prev.includes(idStr) ? prev.filter((s) => s !== idStr) : [...prev, idStr];
      const validChapIds = chapters.filter((c) => newSubs.includes(String(c.subject_id))).map((c) => String(c.id));
      setSelectedChapters((chaps) => chaps.filter((cId) => validChapIds.includes(cId)));
      return newSubs;
    });
  };

  const toggleChapter = (id) => setSelectedChapters((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id]);
  const toggleExamFilter = (tag) => setSelectedExamFilters((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const startQuiz = async () => {
    if (selectedSubjects.length === 0) return setLoadError("Please select at least one subject to begin.");
    setIsLoading(true); setLoadError("");
    try {
      let data = [];
      if (examMode === "mistake") {
        const allMissed = await (await fetch(`${API_URL}/incorrect-questions/${currentUser.id}`)).json();
        data = allMissed.filter((q) => {
          const subjMatch = selectedSubjects.includes(String(q.subject_id));
          const chapMatch = selectedChapters.length === 0 || selectedChapters.includes(String(q.chapter_id));
          return subjMatch && chapMatch;
        });
      } else {
        const chaptersToFetch = selectedChapters.length === 0
            ? chapters.filter((c) => selectedSubjects.includes(String(c.subject_id))).map((c) => String(c.id))
            : selectedChapters;
        if (chaptersToFetch.length === 0) {
          setLoadError("No chapters found in selected subjects.");
          setIsLoading(false);
          return;
        }
        const results = await Promise.all(chaptersToFetch.map((id) => fetch(`${API_URL}/questions/${id}`).then((r) => r.json())));
        data = results.flat();
      }

      if (selectedTypeFilter !== "Both") data = data.filter((q) => q.question_type === selectedTypeFilter);

      if (examFilterMode === "strict" && selectedExamName) {
        data = data.filter((q) => {
          const sf = selectedExamName.toUpperCase();
          return q.exam_names?.some((ex) => ex.toUpperCase().includes(sf)) || q.exam_reference?.toUpperCase().includes(sf);
        });
      } else if (examFilterMode === "mixed" && selectedExamFilters.length > 0) {
        data = data.filter((q) =>
          selectedExamFilters.some((filter) => {
            const sf = filter.toUpperCase();
            return q.exam_names?.some((ex) => ex.toUpperCase().includes(sf)) || q.exam_reference?.toUpperCase().includes(sf);
          })
        );
      }

      if (data.length === 0) {
        setLoadError(examMode === "mistake" ? "No recorded mistakes for this selection." : "No questions match your criteria.");
        setIsLoading(false);
        return;
      }

      let finalQs = [...data].sort(() => 0.5 - Math.random());
      if (questionLimit && !isNaN(questionLimit)) {
        const lim = parseInt(questionLimit);
        if (lim > 0 && lim < finalQs.length) finalQs = finalQs.slice(0, lim);
      }

      setQuestions(finalQs);
      setStats({ correct: 0, incorrect: 0 });
      setCurrentIndex(0);
      setUserAnswers({});
      userAnswersRef.current = {};
      setMarkedForReview(new Set());
      setCalcInput(""); setCalcResult(""); setShowCalculator(false);
      setTimeLeft(examMode === "test" ? finalQs.length * 120 : 0);
      setQuizStatus("active");
    } catch (err) { setLoadError("Failed to load questions."); }
    setIsLoading(false);
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      next.has(currentIndex) ? next.delete(currentIndex) : next.add(currentIndex);
      return next;
    });
  };

  const handleAnswerClick = (selectedOption) => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correct_option;
    const updated = {
      ...userAnswersRef.current,
      [currentIndex]: { question: currentQ, selected: selectedOption, isCorrect },
    };
    userAnswersRef.current = updated;
    setUserAnswers(updated);
    if (currentIndex + 1 < questions.length) setTimeout(() => setCurrentIndex((prev) => prev + 1), 250);
  };

    const finishQuiz = useCallback((answersOverride) => {
    const answers = answersOverride || userAnswersRef.current;
    let fc = 0, fi = 0;
    
    questions.forEach((q, idx) => {
      const rec = answers[idx];
      if (rec?.selected) { rec.isCorrect ? fc++ : fi++; }
    });
    
    const fs = (fc * marksCorrect - fi * marksNegative).toFixed(2);
    const acc = questions.length > 0 ? ((fc / questions.length) * 100).toFixed(0) : 0;
    setStats({ correct: fc, incorrect: fi });

    const sLog = selectedSubjects[0];
    const wIds = questions.map((q, idx) => answers[idx]).filter((a) => a && !a.isCorrect && a.selected).map((a) => a.question.id);

    // Calculate time taken (Total allotted time minus time left)
    // If it's not a timed test (timeLeft is 0 from the start), default to 0
    const totalTimeAllotted = examMode === "test" ? questions.length * 120 : 0;
    const timeTaken = examMode === "test" ? totalTimeAllotted - timeLeft : 0;

    // Determine the type of test for the history logs
    let testTypeLog = "Mixed Practice";
    if (examMode === "test") {
      if (examFilterMode === "strict") testTypeLog = "Full Test";
      else if (selectedChapters.length > 0) testTypeLog = "Chapter Test";
      else testTypeLog = "Subject Test";
    }

    Promise.all([
      // --- THIS IS THE UPDATED SAVE-RESULT PAYLOAD ---
      fetch(`${API_URL}/save-result`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: currentUser.id, 
          subject_id: sLog || null, 
          chapter_id: selectedChapters[0] || null,
          exam_name: selectedExamName || null,
          test_type: testTypeLog,
          score: fs, 
          accuracy: acc,
          correct_count: fc,
          wrong_count: fi,
          time_taken: timeTaken
        }),
      }),
      wIds.length > 0
        ? fetch(`${API_URL}/save-incorrect`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.id, subject_id: sLog, question_ids: wIds }),
          })
        : Promise.resolve(),
    ]).catch(console.error);

    setQuizStatus("results");
    
  // Make sure to update the dependency array at the end of the useCallback so it has access to the new state variables!
  }, [questions, marksCorrect, marksNegative, selectedSubjects, selectedChapters, selectedExamName, examFilterMode, examMode, timeLeft, currentUser]);


  const handleEarlySubmit = () => {
    const unanswered = questions.length - Object.keys(userAnswersRef.current).filter((k) => userAnswersRef.current[k]?.selected).length;
    if (window.confirm(`Submit test? You have ${unanswered} unanswered question(s).`)) finishQuiz();
  };

  const reportCurrentQuestion = async () => {
    try {
      await fetch(`${API_URL}/report-question`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id: questions[currentIndex].id, user_id: currentUser.id }),
      });
      alert("Question reported.");
    } catch { alert("Failed to report question."); }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Permanently delete ALL past results and error tracking? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/clear-history/${currentUser.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setPastResults([]); setMissedQuestions([]);
    } catch (error) { alert("Could not clear history: " + error.message); }
  };

  const handleUnoptExam = async (e, examName) => {
    e.stopPropagation(); 
    if (!window.confirm(`Remove ${examName} from your dashboard?`)) return;
    try {
      const res = await fetch(`${API_URL}/unopt-exam`, {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id, exam_name: examName }),
      });
      if (res.ok) setOptedExams(prev => prev.filter(ex => ex.examName !== examName));
      else alert("Failed to remove exam.");
    } catch (err) { console.error(err); }
  };

  const handleLinkExamSubject = async (e) => {
    e.preventDefault();
    const examId = e.target.exam_id.value;
    const subjectId = e.target.subject_id.value;
    try {
      const res = await fetch(`${API_URL}/admin/link-exam-subject`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam_id: examId, subject_id: subjectId }),
      });
      if (res.ok) { alert("Subject linked to exam successfully!"); e.target.reset(); }
      else alert("Failed to map subject.");
    } catch (err) { alert("Error mapping subject."); }
  };

  // Admin Functions
  const approveUser = async (userId) => {
    await fetch(`${API_URL}/admin/approve-user`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
  };
  const refreshStructure = async () => setStructure(await (await fetch(`${API_URL}/admin/structure`)).json());
  const refreshUsers = async () => setAllUsers(await (await fetch(`${API_URL}/admin/users`)).json());
  const adminAction = async (action, type, id) => {
    if (action === "delete" && !window.confirm(`Delete this ${type}?`)) return;
    const url = action === "delete" ? `/admin/delete-${type}/${id}` : `/admin/manage-${type}`;
    const res = await fetch(`${API_URL}${url}`, { method: action === "delete" ? "DELETE" : "POST", headers: { "Content-Type": "application/json" } });
    if (!res.ok) return alert(`Error: ${await res.text()}`);
    if (type === "subject" || type === "chapter") refreshStructure();
    if (type === "user") refreshUsers();
    if (type === "agency") setAgencies(await (await fetch(`${API_URL}/agencies`)).json());
    if (type === "exam") setDbExams(await (await fetch(`${API_URL}/exams`)).json());
  };
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const res = await fetch(`${API_URL}/admin/manage-subject`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newSubjectName.trim() }) });
    if (!res.ok) return alert(await res.text());
    setNewSubjectName(""); refreshStructure();
  };
  const handleAddChapter = async (e, subjectId) => {
    e.preventDefault();
    if (!newChapterName.trim()) return;
    const res = await fetch(`${API_URL}/admin/manage-chapter`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newChapterName.trim(), subject_id: subjectId }) });
    if (!res.ok) return alert(await res.text());
    setNewChapterName(""); setAddingChapterForSubject(null); refreshStructure();
  };
  const handleAddAgency = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/admin/add-agency`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newAgencyName }) });
    if (!res.ok) return alert(await res.text());
    setNewAgencyName(""); setAgencies(await (await fetch(`${API_URL}/agencies`)).json());
  };
  const handleAddExam = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/admin/add-exam`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agency_id: newExamAgencyId, name: newExamName }) });
    if (!res.ok) return alert(await res.text());
    setNewExamName(""); setDbExams(await (await fetch(`${API_URL}/exams`)).json());
  };
  const triggerUpload = async () => {
    if (!uploadChapter || !selectedCsvFile) return alert("Select a chapter and file!");
    const formData = new FormData(); formData.append("file", selectedCsvFile); formData.append("chapter_id", uploadChapter);
    const res = await fetch(`${API_URL}/upload-questions`, { method: "POST", body: formData });
    alert(await res.text()); setSelectedCsvFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadChapter(""); setUploadSubject("");
  };
  const submitManualQuestion = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/admin/add-question`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newQuestion) });
    if (!res.ok) { alert(await res.text()); return; }
    alert("Question added!");
    setNewQuestion({ subject_id: "", chapter_id: "", question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "A", image_url: "", exam_reference: "", explanation: "", difficulty: "Medium", question_type: "Theory", exam_ids: [] });
    refreshStructure();
  };
  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Delete this question permanently?")) return;
    try {
      await fetch(`${API_URL}/admin/delete-question/${id}`, { method: "DELETE" });
      setAdminChapterQuestions((prev) => prev.filter((q) => q.id !== id));
      setReportedQuestions((prev) => prev.filter((q) => q.question_id !== id));
      refreshStructure();
    } catch { alert("Error deleting question."); }
  };
  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/admin/update-question/${editingQuestion.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingQuestion) });
      if (!res.ok) return alert(await res.text());
      alert("Question updated!"); setEditingQuestion(null);
      if (adminManageChapter) setAdminChapterQuestions(await (await fetch(`${API_URL}/questions/${adminManageChapter}`)).json());
      setReportedQuestions(await (await fetch(`${API_URL}/admin/reported-questions`)).json());
    } catch { alert("Error updating question."); }
  };
  const dismissReport = async (questionId) => {
    try {
      await fetch(`${API_URL}/admin/dismiss-report/${questionId}`, { method: "DELETE" });
      setReportedQuestions((prev) => prev.filter((q) => q.question_id !== questionId));
    } catch { alert("Error dismissing report."); }
  };

  // --- RENDER ---

  if (!currentUser) return <AuthScreen setCurrentUser={setCurrentUser} setQuizStatus={setQuizStatus} />;

  const isLowTime = sessionTimeLeft !== null && sessionTimeLeft < 300000;

  return (
    <div style={styles.page}>
      <Navbar
        currentUser={currentUser}
        setQuizStatus={setQuizStatus}
        logout={logout}
        setFilterSubject={setFilterSubject}
        setFilterChapter={setFilterChapter}
      />

      {sessionTimeLeft !== null && (
        <div
          style={{
            position: "fixed", bottom: "20px", left: "20px",
            backgroundColor: isLowTime ? "#FEF2F2" : "#EEF2FF",
            border: "1px solid " + (isLowTime ? theme.danger : theme.primary),
            padding: "8px 16px", borderRadius: "20px",
            color: isLowTime ? theme.danger : theme.primary,
            fontWeight: "bold", fontSize: "13px",
            zIndex: 1000, boxShadow: theme.shadow,
          }}
        >
          ⏱️ Auto-Logout: {formatTime(Math.floor(sessionTimeLeft / 1000))}
        </div>
      )}

      <div style={styles.container}>
        <Routes>
          {/* Main Navigation Shell */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={
            <HomeDashboard
              optedExams={optedExams} agencies={agencies} setQuizStatus={setQuizStatus}
              handleUnoptExam={handleUnoptExam} setSelectedAgencyId={setSelectedAgencyId}
              setSelectedExamName={setSelectedExamName} setExamFilterMode={setExamFilterMode}
            />
          } />
          
          <Route path="/add-exam" element={
            <ExamSelection
              selectedAgencyId={selectedAgencyId} setSelectedAgencyId={setSelectedAgencyId}
              selectedExamName={selectedExamName} setSelectedExamName={setSelectedExamName}
              agencies={agencies} dbExams={dbExams} optedExams={optedExams}
              setOptedExams={setOptedExams} currentUser={currentUser} setQuizStatus={setQuizStatus}
            />
          } />

                   {/* THE LIST OF PAST TESTS */}
          <Route path="/history" element={
            <TestHistory
              pastResults={pastResults}
              handleClearHistory={handleClearHistory}
            />
          } />


          <Route path="/analytics/:testId" element={
            <Analytics
              pastResults={pastResults}
            />
          } />


          <Route path="/review" element={
            <MistakeReview
              filterSubject={filterSubject} setFilterSubject={setFilterSubject}
              filterChapter={filterChapter} setFilterChapter={setFilterChapter}
              missedQuestions={missedQuestions}
            />
          } />

          <Route path="/admin" element={
            currentUser.role === "admin" 
              ? <AdminPanel currentUser={currentUser} agencies={agencies} dbExams={dbExams} structure={structure} allUsers={allUsers} pendingUsers={pendingUsers} reportedQuestions={reportedQuestions} adminManageSubject={adminManageSubject} setAdminManageSubject={setAdminManageSubject} adminManageChapter={adminManageChapter} setAdminManageChapter={setAdminManageChapter} adminChapterQuestions={adminChapterQuestions} editingQuestion={editingQuestion} setEditingQuestion={setEditingQuestion} newAgencyName={newAgencyName} setNewAgencyName={setNewAgencyName} newExamName={newExamName} setNewExamName={setNewExamName} newExamAgencyId={newExamAgencyId} setNewExamAgencyId={setNewExamAgencyId} newQuestion={newQuestion} setNewQuestion={setNewQuestion} newSubjectName={newSubjectName} setNewSubjectName={setNewSubjectName} newChapterName={newChapterName} setNewChapterName={setNewChapterName} addingChapterForSubject={addingChapterForSubject} setAddingChapterForSubject={setAddingChapterForSubject} uploadSubject={uploadSubject} setUploadSubject={setUploadSubject} uploadChapter={uploadChapter} setUploadChapter={setUploadChapter} fileInputRef={fileInputRef} setSelectedCsvFile={setSelectedCsvFile} adminAction={adminAction} handleAddAgency={handleAddAgency} handleAddExam={handleAddExam} handleLinkExamSubject={handleLinkExamSubject} approveUser={approveUser} handleAddSubject={handleAddSubject} handleAddChapter={handleAddChapter} triggerUpload={triggerUpload} submitManualQuestion={submitManualQuestion} handleDeleteQuestion={handleDeleteQuestion} handleUpdateQuestion={handleUpdateQuestion} dismissReport={dismissReport} /> 
              : <Navigate to="/dashboard" replace />
          } />

          {/* THE HYBRID ROUTE: Protects quiz state from browser navigation */}
          <Route path="/practice" element={
            <>
              {quizStatusState === "modeSelection" && (
                <ModeSelection
                  examFilterMode={examFilterMode} selectedExamName={selectedExamName} agencyName={agencyName}
                  setExamMode={setExamMode} setSelectedSubjects={setSelectedSubjects} setSelectedChapters={setSelectedChapters}
                  setSelectedExamFilters={setSelectedExamFilters} setQuestionLimit={setQuestionLimit}
                  setSelectedTypeFilter={setSelectedTypeFilter} setLoadError={setLoadError} setQuizStatus={setQuizStatus}
                />
              )}
              {quizStatusState === "setup" && (
                <SetupSession
                  examMode={examMode} examFilterMode={examFilterMode} selectedExamName={selectedExamName} agencyName={agencyName}
                  loadError={loadError} relevantSubjectIds={relevantSubjectIds} subjects={subjects} selectedSubjects={selectedSubjects}
                  toggleSubject={toggleSubject} chapters={chapters} selectedChapters={selectedChapters} toggleChapter={toggleChapter}
                  examReferences={examReferences} selectedExamFilters={selectedExamFilters} toggleExamFilter={toggleExamFilter}
                  selectedTypeFilter={selectedTypeFilter} setSelectedTypeFilter={setSelectedTypeFilter} questionLimit={questionLimit}
                  setQuestionLimit={setQuestionLimit} marksCorrect={marksCorrect} setMarksCorrect={setMarksCorrect}
                  marksNegative={marksNegative} setMarksNegative={setMarksNegative} isLoading={isLoading} startQuiz={startQuiz}
                />
              )}
              {quizStatusState === "active" && (
                <ActiveQuiz
                  questions={questions} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} userAnswers={userAnswers}
                  handleAnswerClick={handleAnswerClick} examMode={examMode} timeLeft={timeLeft} formatTime={formatTime}
                  showCalculator={showCalculator} setShowCalculator={setShowCalculator} calcInput={calcInput} calcResult={calcResult}
                  handleCalcClick={handleCalcClick} markedForReview={markedForReview} toggleMarkForReview={toggleMarkForReview}
                  reportCurrentQuestion={reportCurrentQuestion} handleEarlySubmit={handleEarlySubmit}
                />
              )}
              {quizStatusState === "results" && (
                <Results
                  examMode={examMode} timeLeft={timeLeft} stats={stats} marksCorrect={marksCorrect}
                  marksNegative={marksNegative} questions={questions} userAnswers={userAnswers}
                />
              )}
            </>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
