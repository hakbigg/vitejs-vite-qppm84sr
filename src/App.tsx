import { useState, useEffect } from "react";

const SCALE_LABELS = ["매우 불만족", "불만족", "보통", "만족", "매우 만족"];
const DEFAULT_QUESTIONS = [
  { id: 1, text: "교육 내용은 업무에 도움이 되었나요?", type: "scale" },
  { id: 2, text: "강사의 전달력은 어떠했나요?", type: "scale" },
  { id: 3, text: "교육 시간은 적절했나요?", type: "scale" },
  { id: 4, text: "교육에서 가장 유익했던 점은 무엇인가요?", type: "text" 
  { id: 5, text: "개선이 필요한 부분이 있다면 무엇인가요?", type: "text" },
];
const ADMIN_PW = "hakbigg_2026";
const DB_URL = "https://edu-survey-app-b1fb0-default-rtdb.firebaseio.com";

const pink = "#f472b6";
const pinkL = "#fde8f1";
const pinkD = "#be185d";
const gray = "#6b7280";
const grayL = "#f3f4f6";
const grayM = "#d1d5db";
const grayD = "#374151";
const BG = "#fdf2f8";

// Firebase REST API helpers
const dbGet = async (path: string) => {
  const res = await fetch(`${DB_URL}/${path}.json`);
  return res.ok ? res.json() : null;
};
const dbSet = async (path: string, data: unknown) => {
  await fetch(`${DB_URL}/${path}.json`, { method: "PUT", body: JSON.stringify(data) });
};
const dbPush = async (path: string, data: unknown) => {
  await fetch(`${DB_URL}/${path}.json`, { method: "POST", body: JSON.stringify(data) });
};

export default function App() {
  const [page, setPage] = useState(() => window.location.hash.replace("#", ""));
  const [adminAuth, setAdminAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [survey, setSurveyState] = useState<any>(() => ({ title: "", instructor: "", date: "", questions: DEFAULT_QUESTIONS, published: false }));
  const [responses, setResponses] = useState<any[]>([]);
  const [tab, setTab] = useState("design");
  const [newQ, setNewQ] = useState("");
  const [newQType, setNewQType] = useState("scale");
  const [report, setReport] = useState("");
  const [reporting, setReporting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState(true);

  // Load survey from Firebase
  useEffect(() => {
    const load = async () => {
      const data = await dbGet("survey");
      if (data) setSurveyState(data);
      setLoading(false);
    };
    load();
  }, []);

  // Load responses from Firebase
  useEffect(() => {
    const loadResponses = async () => {
      const data = await dbGet("responses");
      if (data) setResponses(Object.values(data));
      else setResponses([]);
    };
    loadResponses();
    const t = setInterval(loadResponses, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const h = () => setPage(window.location.hash.replace("#", ""));
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);

  const setSurvey = async (fn: (p: any) => any) => {
    const next = fn(survey);
    setSurveyState(next);
    await dbSet("survey", next);
  };

  const base = window.location.href.split("#")[0];

  const card: React.CSSProperties = { background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: "16px" };
  const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: "10px", border: `1.5px solid ${grayM}`, fontFamily: "'Noto Sans KR',sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box", background: "#fff", color: grayD };

  const PBtn = ({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) => (
    <button onClick={onClick} style={{ padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif", fontWeight: 700, fontSize: "14px", background: "linear-gradient(135deg,#f472b6,#f9a8c9)", color: "#fff", boxShadow: "0 4px 14px rgba(244,114,182,0.35)", width: full ? "100%" : undefined }}>{children}</button>
  );
  const GBtn = ({ children, onClick, red }: { children: React.ReactNode; onClick?: () => void; red?: boolean }) => (
    <button onClick={onClick} style={{ padding: "11px 20px", borderRadius: "10px", border: `1.5px solid ${red ? "#fca5a5" : grayM}`, cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif", fontWeight: 600, fontSize: "14px", background: "#fff", color: red ? "#e11d48" : gray }}>{children}</button>
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-block", width: "40px", height: "40px", border: `3px solid ${pinkL}`, borderTopColor: pink, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      </div>
    </div>
  );

  // ── HOME
  if (!page) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@700&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg,#f472b6,#f9a8c9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px" }}>📋</div>
        <h1 style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "24px", color: grayD, margin: "0 0 8px" }}>교육 평가 설문 시스템</h1>
        <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "14px", color: gray, margin: 0 }}>역할을 선택하거나 링크를 공유하세요</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "440px", width: "100%", marginBottom: "32px" }}>
        {[{ r: "admin", icon: "⚙️", t: "관리자", d: "설문 설계·결과 분석\nAI 보고서 생성" }, { r: "respondent", icon: "✏️", t: "응답자", d: "교육 평가 설문\n참여하기" }].map(({ r, icon, t, d }) => (
          <button key={r} onClick={() => { window.location.hash = r; }} style={{ background: "#fff", border: `2px solid ${grayM}`, borderRadius: "20px", padding: "28px 16px", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{icon}</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: grayD, marginBottom: "6px", fontFamily: "'Noto Sans KR',sans-serif" }}>{t}</div>
            <div style={{ fontSize: "12px", color: gray, whiteSpace: "pre-line", lineHeight: 1.7, fontFamily: "'Noto Sans KR',sans-serif" }}>{d}</div>
          </button>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "12px", fontWeight: 700, color: gray, textAlign: "center", marginBottom: "12px" }}>🔗 링크로 바로 접근</p>
        {[{ label: "관리자 링크", url: base + "#admin", key: "a", bg: pinkL, c: pinkD }, { label: "응답자 링크", url: base + "#respondent", key: "r", bg: grayL, c: grayD }].map(({ label, url, key, bg, c }) => (
          <div key={key} style={{ background: bg, borderRadius: "12px", padding: "12px 16px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "11px", fontWeight: 700, color: c, marginBottom: "2px" }}>{label}</div>
              <div style={{ fontFamily: "monospace", fontSize: "12px", color: gray, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</div>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(url); setCopied(key); setTimeout(() => setCopied(""), 2000); }} style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: copied === key ? pink : "#fff", color: copied === key ? "#fff" : gray, fontFamily: "'Noto Sans KR',sans-serif", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>{copied === key ? "✓ 복사됨" : "복사"}</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── ADMIN LOGIN
  if (page === "admin" && !adminAuth) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@700&display=swap" rel="stylesheet" />
      <div style={{ background: "#fff", borderRadius: "20px", padding: "40px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", width: "100%", maxWidth: "360px", textAlign: "center" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg,#f472b6,#f9a8c9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 20px" }}>🔐</div>
        <h2 style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "20px", color: grayD, marginBottom: "8px" }}>관리자 로그인</h2>
        <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "13px", color: gray, marginBottom: "24px" }}>비밀번호를 입력해주세요</p>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwErr(false); }} onKeyDown={e => { if (e.key === "Enter") { if (pw === ADMIN_PW) setAdminAuth(true); else setPwErr(true); } }} placeholder="비밀번호" style={{ ...inp, marginBottom: "8px", border: `1.5px solid ${pwErr ? "#e11d48" : grayM}` }} />
        {pwErr && <p style={{ color: "#e11d48", fontSize: "13px", marginBottom: "12px", fontFamily: "'Noto Sans KR',sans-serif" }}>비밀번호가 올바르지 않습니다.</p>}
        <PBtn full onClick={() => { if (pw === ADMIN_PW) setAdminAuth(true); else setPwErr(true); }}>로그인</PBtn>
        <div style={{ marginTop: "16px" }}><GBtn onClick={() => { window.location.hash = ""; }}>← 홈으로</GBtn></div>
      </div>
    </div>
  );

  // ── ADMIN PANEL
  if (page === "admin" && adminAuth) {
    const publish = async () => {
      if (!survey.title.trim()) { setErr("교육명을 입력해주세요."); return; }
      setErr("");
      await setSurvey((d: any) => ({ ...d, published: true }));
      setTab("dashboard");
    };
    const resetAll = async () => {
      if (!window.confirm("모든 데이터를 초기화할까요?")) return;
      const empty = { title: "", instructor: "", date: "", questions: DEFAULT_QUESTIONS, published: false };
      await dbSet("survey", empty);
      await dbSet("responses", null);
      setSurveyState(empty);
      setResponses([]);
      setReport("");
      setTab("design");
    };
    const downloadCSV = () => {
      if (responses.length === 0) return;
      const headers = ["제출시각", ...survey.questions.map((q: any) => q.text)];
      const rows = responses.map((r: any) => [
        r.submittedAt,
        ...survey.questions.map((q: any) => {
          const val = r.answers[q.id];
          if (val === undefined || val === null) return "";
          return String(val).replace(/,/g, "，").replace(/\n/g, " ");
        })
      ]);
      const bom = "\uFEFF";
      const csv = bom + [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${survey.title || "교육평가"}_응답데이터_${new Date().toLocaleDateString("ko-KR").replace(/\. /g, "-").replace(".", "")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const genReport = async () => {
      setReporting(true); setReport("");
      const summary = survey.questions.map((q: any) => {
        if (q.type === "scale") {
          const scores = responses.map((r: any) => r.answers[q.id]).filter(Boolean) as number[];
          const avg = scores.length ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1) : "N/A";
          return `[척도] ${q.text} - 평균: ${avg}/5.0`;
        }
        const texts = responses.map((r: any) => r.answers[q.id]).filter(Boolean) as string[];
        return `[주관식] ${q.text}\n${texts.map((t, i) => `(${i + 1}) ${t}`).join(" | ")}`;
      }).join("\n\n");
      try {
        const prompt = `교육 평가 보고서 작성:\n교육명: ${survey.title} | 강사: ${survey.instructor || "미기재"} | 응답자: ${responses.length}명\n\n${summary}\n\n1.종합 만족도(★별점) 2.항목별 분석 3.주관식 인사이트 4.개선 권고 3가지 5.결론`;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
        const data = await res.json();
        setReport(data.candidates?.[0]?.content?.parts?.[0]?.text || "생성 실패");
      } catch { setReport("오류가 발생했습니다."); }
      setReporting(false);
    };

    return (
      <div style={{ minHeight: "100vh", background: BG, padding: "24px 16px" }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@700&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#f472b6,#f9a8c9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚙️</div>
              <div>
                <div style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "17px", fontWeight: 700, color: grayD }}>관리자 패널</div>
                <div style={{ fontSize: "12px", fontWeight: 700, fontFamily: "'Noto Sans KR',sans-serif", color: survey.published ? "#16a34a" : "#d97706" }}>{survey.published ? "● 게시 중" : "● 미게시"}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <GBtn red onClick={resetAll}>초기화</GBtn>
              <GBtn onClick={() => { window.location.hash = ""; }}>← 홈</GBtn>
            </div>
          </div>

          <div style={{ display: "flex", gap: "4px", background: grayL, borderRadius: "12px", padding: "4px", marginBottom: "20px" }}>
            {[["design", "⚙️ 설문 설계"], ["dashboard", "📊 응답 현황"], ["report", "🤖 AI 보고서"]].map(([s, l]) => (
              <button key={s} onClick={() => setTab(s)} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "none", cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif", fontWeight: 700, fontSize: "13px", background: tab === s ? "#fff" : "transparent", color: tab === s ? pinkD : gray, boxShadow: tab === s ? "0 2px 8px rgba(0,0,0,0.08)" : "none" }}>{l}</button>
            ))}
          </div>

          {tab === "design" && (
            <>
              <div style={card}>
                <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "13px", fontWeight: 700, color: pinkD, marginBottom: "16px", marginTop: 0 }}>📌 교육 기본 정보</p>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "12px", fontWeight: 700, color: gray, marginBottom: "5px", display: "block" }}>교육명 *</label>
                  <input style={inp} value={survey.title} onChange={e => setSurvey((d: any) => ({ ...d, title: e.target.value }))} placeholder="예: 2025년 상반기 리더십 교육" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "12px", fontWeight: 700, color: gray, marginBottom: "5px", display: "block" }}>강사명</label>
                    <input style={inp} value={survey.instructor} onChange={e => setSurvey((d: any) => ({ ...d, instructor: e.target.value }))} placeholder="강사 이름" />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "12px", fontWeight: 700, color: gray, marginBottom: "5px", display: "block" }}>교육 일자</label>
                    <input style={inp} type="date" value={survey.date} onChange={e => setSurvey((d: any) => ({ ...d, date: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div style={card}>
                <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "13px", fontWeight: 700, color: pinkD, marginBottom: "16px", marginTop: 0 }}>📝 설문 항목</p>
                {survey.questions.map((q: any, i: number) => (
                  <div key={q.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 13px", borderRadius: "10px", background: grayL, marginBottom: "8px" }}>
                    <span style={{ fontWeight: 700, color: pink, fontSize: "13px", minWidth: "20px", fontFamily: "'Noto Sans KR',sans-serif" }}>{i + 1}</span>
                    <span style={{ flex: 1, fontSize: "13px", color: grayD, fontFamily: "'Noto Sans KR',sans-serif" }}>{q.text}</span>
                    <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: q.type === "scale" ? pinkL : grayL, color: q.type === "scale" ? pinkD : gray, fontWeight: 600, fontFamily: "'Noto Sans KR',sans-serif" }}>{q.type === "scale" ? "5점 척도" : "주관식"}</span>
                    <button onClick={() => setSurvey((d: any) => ({ ...d, questions: d.questions.filter((x: any) => x.id !== q.id) }))} style={{ background: "none", border: "none", color: "#e11d48", cursor: "pointer", fontSize: "15px" }}>✕</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
                  <input style={{ ...inp, flex: 1, minWidth: "180px" }} value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="새 질문 입력" onKeyDown={e => { if (e.key === "Enter" && newQ.trim()) { setSurvey((d: any) => ({ ...d, questions: [...d.questions, { id: Date.now(), text: newQ.trim(), type: newQType }] })); setNewQ(""); } }} />
                  <select value={newQType} onChange={e => setNewQType(e.target.value)} style={{ padding: "11px 14px", borderRadius: "10px", border: `1.5px solid ${grayM}`, fontFamily: "'Noto Sans KR',sans-serif", fontSize: "14px", outline: "none", background: "#fff", color: grayD }}>
                    <option value="scale">5점 척도</option>
                    <option value="text">주관식</option>
                  </select>
                  <GBtn onClick={() => { if (newQ.trim()) { setSurvey((d: any) => ({ ...d, questions: [...d.questions, { id: Date.now(), text: newQ.trim(), type: newQType }] })); setNewQ(""); } }}>+ 추가</GBtn>
                </div>
              </div>
              {err && <p style={{ color: "#e11d48", fontSize: "13px", marginBottom: "12px", fontFamily: "'Noto Sans KR',sans-serif" }}>{err}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <PBtn full onClick={publish}>{survey.published ? "설문 수정 완료 ✓" : "설문 게시 →"}</PBtn>
                {survey.published && <GBtn onClick={() => setSurvey((d: any) => ({ ...d, published: false }))}>게시 중단</GBtn>}
              </div>
            </>
          )}

          {tab === "dashboard" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                {[{ l: "총 응답자", v: `${responses.length}명`, i: "👥" }, { l: "설문 항목", v: `${survey.questions.length}개`, i: "📋" }, { l: "상태", v: survey.published ? "게시 중" : "미게시", i: survey.published ? "🟢" : "🟡" }].map(({ l, v, i }) => (
                  <div key={l} style={{ background: "#fff", borderRadius: "16px", padding: "18px 12px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", textAlign: "center" }}>
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{i}</div>
                    <div style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "18px", fontWeight: 700, color: pinkD }}>{v}</div>
                    <div style={{ fontSize: "12px", color: gray, fontFamily: "'Noto Sans KR',sans-serif" }}>{l}</div>
                  </div>
                ))}
              </div>
              {survey.questions.filter((q: any) => q.type === "scale").map((q: any) => {
                const sc = responses.map((r: any) => r.answers[q.id]).filter(Boolean) as number[];
                const avg = sc.length ? sc.reduce((a: number, b: number) => a + b, 0) / sc.length : 0;
                return (
                  <div key={q.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px 20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", color: grayD, fontFamily: "'Noto Sans KR',sans-serif" }}>{q.text}</span>
                      <span style={{ fontWeight: 700, color: pinkD, fontFamily: "'Noto Serif KR',serif" }}>{avg.toFixed(1)}/5.0</span>
                    </div>
                    <div style={{ height: "8px", background: grayL, borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(avg / 5) * 100}%`, background: "linear-gradient(90deg,#f9a8c9,#f472b6)", borderRadius: "4px" }} />
                    </div>
                  </div>
                );
              })}
              {responses.length > 0 ? (
                <div style={card}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "12px", fontWeight: 700, color: pinkD, margin: 0 }}>응답 목록</p>
                    <button onClick={downloadCSV} style={{ padding: "7px 14px", borderRadius: "8px", border: `1.5px solid ${pink}`, background: pinkL, color: pinkD, fontFamily: "'Noto Sans KR',sans-serif", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>⬇ CSV 다운로드</button>
                  </div>
                  {responses.map((r: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: i < responses.length - 1 ? `1px solid ${grayL}` : "none" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: pinkL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: pinkD, fontFamily: "'Noto Sans KR',sans-serif" }}>{i + 1}</div>
                      <span style={{ fontSize: "14px", color: grayD, fontFamily: "'Noto Sans KR',sans-serif" }}>{r.name}</span>
                      <span style={{ marginLeft: "auto", fontSize: "11px", color: "#9ca3af", fontFamily: "'Noto Sans KR',sans-serif" }}>{r.submittedAt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px", color: gray, fontFamily: "'Noto Sans KR',sans-serif", fontSize: "14px" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>아직 응답이 없습니다.
                </div>
              )}
            </>
          )}

          {tab === "report" && (
            responses.length === 0 ? (
              <div style={{ ...card, textAlign: "center", padding: "48px" }}><div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div><p style={{ fontFamily: "'Noto Sans KR',sans-serif", color: gray }}>응답 데이터가 없습니다.</p></div>
            ) : !report && !reporting ? (
              <div style={{ ...card, textAlign: "center", padding: "40px" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>🤖</div>
                <p style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "18px", color: grayD, marginBottom: "8px" }}>AI 분석 보고서 생성</p>
                <p style={{ fontFamily: "'Noto Sans KR',sans-serif", color: gray, fontSize: "13px", marginBottom: "24px" }}>{responses.length}명의 응답을 분석합니다</p>
                <PBtn onClick={genReport}>보고서 생성하기</PBtn>
              </div>
            ) : reporting ? (
              <div style={{ ...card, textAlign: "center", padding: "48px" }}>
                <div style={{ display: "inline-block", width: "40px", height: "40px", border: `3px solid ${pinkL}`, borderTopColor: pink, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontFamily: "'Noto Sans KR',sans-serif", color: gray, marginTop: "16px" }}>AI가 분석 중입니다...</p>
                <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
              </div>
            ) : (
              <div style={card}>
                <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "13px", fontWeight: 700, color: pinkD, marginBottom: "16px", marginTop: 0 }}>🤖 AI 종합 분석 보고서</p>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.9, fontSize: "14px", color: grayD, fontFamily: "'Noto Sans KR',sans-serif" }}>{report}</div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  // ── RESPONDENT
  if (page === "respondent") {
    if (!survey || !survey.published) return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "24px" }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@700&display=swap" rel="stylesheet" />
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
        <h2 style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "20px", color: grayD, marginBottom: "8px" }}>아직 설문이 준비되지 않았습니다</h2>
        <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "14px", color: gray, textAlign: "center", lineHeight: 1.7 }}>관리자가 설문을 게시하면 자동으로 열립니다.</p>
      </div>
    );

    if (submitted) return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "24px" }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@700&display=swap" rel="stylesheet" />
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#f472b6,#f9a8c9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", margin: "0 auto 24px" }}>✓</div>
        <h2 style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "22px", color: grayD, marginBottom: "8px" }}>응답 완료!</h2>
        <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "14px", color: gray, marginBottom: "28px", textAlign: "center", lineHeight: 1.8 }}>소중한 의견 감사합니다.<br />교육 개선에 큰 도움이 됩니다.</p>
        <GBtn onClick={() => { setAnswers({}); setSubmitted(false); }}>추가 응답</GBtn>
      </div>
    );

    const submit = async () => {
      const missing = survey.questions.find((q: any) => !answers[q.id] && answers[q.id] !== 0);
      if (missing) { setErr(`"${missing.text}" 항목을 입력해주세요.`); return; }
      setErr("");
      const now = new Date().toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
      await dbPush("responses", { name: `응답자`, answers: { ...answers }, submittedAt: now });
      setSubmitted(true);
    };

    return (
      <div style={{ minHeight: "100vh", background: BG, padding: "24px 16px" }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@700&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "11px", color: pink, fontWeight: 700, fontFamily: "'Noto Sans KR',sans-serif", marginBottom: "4px" }}>교육 평가 설문</div>
            <h1 style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "20px", color: grayD, margin: "0 0 4px" }}>{survey.title}</h1>
            {(survey.instructor || survey.date) && (
              <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "12px", color: gray, margin: 0 }}>
                {survey.instructor && `강사: ${survey.instructor}`}{survey.instructor && survey.date && " · "}{survey.date}
              </p>
            )}
          </div>
          {survey.questions.map((q: any, i: number) => (
            <div key={q.id} style={card}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "16px" }}>
                <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: pinkL, color: pinkD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", flexShrink: 0, fontFamily: "'Noto Sans KR',sans-serif" }}>{i + 1}</span>
                <label style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: "15px", fontWeight: 700, color: grayD, lineHeight: 1.5 }}>{q.text}</label>
              </div>
              {q.type === "scale" ? (
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setAnswers(a => ({ ...a, [q.id]: v }))} style={{ width: "48px", height: "48px", borderRadius: "50%", border: `2px solid ${answers[q.id] === v ? pink : grayM}`, background: answers[q.id] === v ? "linear-gradient(135deg,#f472b6,#f9a8c9)" : "#fff", color: answers[q.id] === v ? "#fff" : gray, fontFamily: "'Noto Sans KR',sans-serif", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>{v}</button>
                  ))}
                  {answers[q.id] && <span style={{ fontSize: "12px", color: pinkD, fontFamily: "'Noto Sans KR',sans-serif" }}>{SCALE_LABELS[(answers[q.id] as number) - 1]}</span>}
                </div>
              ) : (
                <textarea value={(answers[q.id] as string) || ""} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))} placeholder="자유롭게 작성해주세요" style={{ ...inp, minHeight: "88px", resize: "vertical" }} />
              )}
            </div>
          ))}
          {err && <p style={{ color: "#e11d48", fontSize: "13px", marginBottom: "12px", fontFamily: "'Noto Sans KR',sans-serif" }}>{err}</p>}
          <PBtn full onClick={submit}>제출하기 ✓</PBtn>
          <div style={{ height: "40px" }} />
        </div>
      </div>
    );
  }

  return null;
}
