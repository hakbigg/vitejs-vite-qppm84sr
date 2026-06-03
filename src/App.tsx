import { useState, useEffect } from "react";

const SCALE_LABELS = ["매우 불만족", "불만족", "보통", "만족", "매우 만족"];

const defaultQuestions = [
  { id: 1, text: "교육 내용은 업무에 도움이 되었나요?", type: "scale" },
  { id: 2, text: "강사의 전달력은 어떠했나요?", type: "scale" },
  { id: 3, text: "교육 시간은 적절했나요?", type: "scale" },
  { id: 4, text: "교육에서 가장 유익했던 점은 무엇인가요?", type: "text" },
  { id: 5, text: "개선이 필요한 부분이 있다면 무엇인가요?", type: "text" },
];

const STORAGE_KEY = "edu_survey_data";
const RESPONSES_KEY = "edu_survey_responses";

function loadSurvey() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
function saveSurvey(data: object) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}
function loadResponses() {
  try { const d = localStorage.getItem(RESPONSES_KEY); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveResponses(data: object[]) {
  try { localStorage.setItem(RESPONSES_KEY, JSON.stringify(data)); } catch {}
}

const pink = "#f472b6";
const pinkLight = "#fde8f1";
const pinkDark = "#be185d";
const gray = "#6b7280";
const grayLight = "#f3f4f6";
const grayMid = "#d1d5db";
const grayDark = "#374151";
const bg = "#fdf2f8";

function PrimaryBtn({ children, onClick, disabled, fullWidth }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; fullWidth?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "12px 28px", borderRadius: "10px", border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: "14px",
      background: disabled ? grayMid : "linear-gradient(135deg, #f472b6, #f9a8c9)",
      color: "#fff", opacity: disabled ? 0.6 : 1,
      boxShadow: disabled ? "none" : "0 4px 14px rgba(244,114,182,0.35)",
      width: fullWidth ? "100%" : undefined,
    }}>{children}</button>
  );
}

function GhostBtn({ children, onClick, danger }: {
  children: React.ReactNode; onClick?: () => void; danger?: boolean;
}) {
  return (
    <button onClick={onClick} style={{
      padding: "11px 22px", borderRadius: "10px", border: `1.5px solid ${danger ? "#fca5a5" : grayMid}`,
      cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif",
      fontWeight: 600, fontSize: "14px", background: "#fff",
      color: danger ? "#e11d48" : gray,
    }}>{children}</button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
      {children}
    </div>
  );
}

function ScaleInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
      {[1,2,3,4,5].map(v => (
        <button key={v} onClick={() => onChange(v)} style={{
          width: "48px", height: "48px", borderRadius: "50%", border: `2px solid ${value === v ? pink : grayMid}`,
          background: value === v ? "linear-gradient(135deg,#f472b6,#f9a8c9)" : "#fff",
          color: value === v ? "#fff" : gray,
          fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: "15px",
          cursor: "pointer", boxShadow: value === v ? "0 4px 12px rgba(244,114,182,0.4)" : "none",
        }}>{v}</button>
      ))}
      {value > 0 && <span style={{ fontSize: "12px", color: pinkDark, fontFamily: "'Noto Sans KR', sans-serif" }}>{SCALE_LABELS[value-1]}</span>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type || "text"}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", padding: "11px 14px", borderRadius: "10px",
        border: `1.5px solid ${grayMid}`, fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "14px", outline: "none", boxSizing: "border-box", background: "#fff",
      }}
    />
  );
}

function Textarea({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", padding: "11px 14px", borderRadius: "10px",
        border: `1.5px solid ${grayMid}`, fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "14px", outline: "none", boxSizing: "border-box", background: "#fff",
        minHeight: "88px", resize: "vertical",
      }}
    />
  );
}

// ── HOME ──
function RoleSelect({ onSelect }: { onSelect: (r: string) => void }) {
  const base = window.location.href.split("#")[0];
  const [copied, setCopied] = useState("");
  const links = [
    { label: "관리자 링크", url: base + "#admin", key: "admin", icon: "⚙️", bg: pinkLight, color: pinkDark },
    { label: "응답자 링크", url: base + "#respondent", key: "resp", icon: "✏️", bg: grayLight, color: grayDark },
  ];
  const copy = (url: string, key: string) => {
    navigator.clipboard.writeText(url).then(() => { setCopied(key); setTimeout(() => setCopied(""), 2000); });
  };
  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg,#f472b6,#f9a8c9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(244,114,182,0.3)" }}>📋</div>
        <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "26px", color: grayDark, margin: "0 0 8px" }}>교육 평가 설문 시스템</h1>
        <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "14px", color: gray, margin: 0 }}>역할을 선택하거나 링크를 공유하세요</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "480px", width: "100%", marginBottom: "32px" }}>
        {[
          { role: "admin", icon: "⚙️", title: "관리자", desc: "설문 설계 · 결과 분석\nAI 보고서 생성" },
          { role: "respondent", icon: "✏️", title: "응답자", desc: "교육 평가 설문\n참여하기" },
        ].map(({ role, icon, title, desc }) => (
          <button key={role} onClick={() => onSelect(role)} style={{
            background: "#fff", border: `2px solid ${grayMid}`, borderRadius: "20px",
            padding: "28px 16px", cursor: "pointer", textAlign: "center", transition: "all 0.2s",
          }}>
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>{icon}</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: grayDark, marginBottom: "6px", fontFamily: "'Noto Sans KR', sans-serif" }}>{title}</div>
            <div style={{ fontSize: "12px", color: gray, whiteSpace: "pre-line", lineHeight: 1.7, fontFamily: "'Noto Sans KR', sans-serif" }}>{desc}</div>
          </button>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "12px", fontWeight: 700, color: gray, textAlign: "center", marginBottom: "12px" }}>🔗 링크로 바로 접근</p>
        {links.map(({ label, url, key, icon, bg: lbg, color }) => (
          <div key={key} style={{ background: lbg, borderRadius: "12px", padding: "14px 16px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>{icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "11px", fontWeight: 700, color, marginBottom: "2px" }}>{label}</div>
              <div style={{ fontFamily: "monospace", fontSize: "12px", color: gray, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</div>
            </div>
            <button onClick={() => copy(url, key)} style={{
              padding: "7px 14px", borderRadius: "8px", border: "none",
              background: copied === key ? pink : "#fff", color: copied === key ? "#fff" : gray,
              fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: "12px", cursor: "pointer",
            }}>{copied === key ? "✓ 복사됨" : "복사"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ADMIN ──
function AdminPanel({ onHome }: { onHome: () => void }) {
  const [survey, setSurveyState] = useState(() => loadSurvey() || { title: "", instructor: "", date: "", questions: defaultQuestions, published: false });
  const [responses, setResponses] = useState(() => loadResponses());
  const [tab, setTab] = useState(survey.published ? "dashboard" : "design");
  const [newQ, setNewQ] = useState("");
  const [newQType, setNewQType] = useState("scale");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setResponses(loadResponses()), 3000);
    return () => clearInterval(t);
  }, []);

  const setSurvey = (updater: (p: typeof survey) => typeof survey) => {
    setSurveyState(prev => { const next = updater(prev); saveSurvey(next); return next; });
  };

  const addQ = () => {
    if (!newQ.trim()) return;
    setSurvey(d => ({ ...d, questions: [...d.questions, { id: Date.now(), text: newQ.trim(), type: newQType }] }));
    setNewQ("");
  };

  const publish = () => {
    if (!survey.title.trim()) { setError("교육명을 입력해주세요."); return; }
    setError(""); setSurvey(d => ({ ...d, published: true })); setTab("dashboard");
  };

  const resetAll = () => {
    if (!window.confirm("모든 데이터를 초기화할까요?")) return;
    localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(RESPONSES_KEY);
    setSurveyState({ title: "", instructor: "", date: "", questions: defaultQuestions, published: false });
    setResponses([]); setReport(""); setTab("design");
  };

  const generateReport = async () => {
    setLoading(true); setReport("");
    const summary = survey.questions.map((q: { id: number; text: string; type: string }) => {
      if (q.type === "scale") {
        const scores = responses.map((r: { answers: Record<number, number> }) => r.answers[q.id]).filter(Boolean) as number[];
        const avg = scores.length ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(2) : "N/A";
        return `[척도] ${q.text}\n  평균: ${avg}/5.0`;
      } else {
        const texts = responses.map((r: { answers: Record<number, string> }) => r.answers[q.id]).filter(Boolean) as string[];
        return `[주관식] ${q.text}\n  응답: ${texts.map((t: string, i: number) => `(${i+1}) ${t}`).join(" | ")}`;
      }
    }).join("\n\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `교육 평가 전문가로서 보고서를 작성해주세요.\n\n교육명: ${survey.title} | 강사: ${survey.instructor||"미기재"} | 응답자: ${responses.length}명\n\n${summary}\n\n1. 종합 만족도 (★ 별점)\n2. 항목별 분석\n3. 주관식 인사이트\n4. 개선 권고사항 3가지\n5. 종합 결론` }] }),
      });
      const data = await res.json();
      setReport(data.content?.map((b: { text?: string }) => b.text || "").join("\n") || "생성 실패");
    } catch { setReport("오류가 발생했습니다."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "24px 16px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#f472b6,#f9a8c9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚙️</div>
            <div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "17px", fontWeight: 700, color: grayDark }}>관리자 패널</div>
              <div style={{ fontSize: "12px", color: survey.published ? "#16a34a" : "#d97706", fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700 }}>
                {survey.published ? "● 설문 게시 중" : "● 미게시"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <GhostBtn onClick={resetAll} danger>초기화</GhostBtn>
            <GhostBtn onClick={onHome}>← 홈</GhostBtn>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4px", background: grayLight, borderRadius: "12px", padding: "4px", marginBottom: "20px" }}>
          {[["design","⚙️ 설문 설계"],["dashboard","📊 응답 현황"],["report","🤖 AI 보고서"]].map(([s,l]) => (
            <button key={s} onClick={() => setTab(s)} style={{
              flex: 1, padding: "10px", borderRadius: "9px", border: "none", cursor: "pointer",
              fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: "13px",
              background: tab === s ? "#fff" : "transparent", color: tab === s ? pinkDark : gray,
              boxShadow: tab === s ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}>{l}</button>
          ))}
        </div>

        {tab === "design" && (
          <>
            <Card>
              <p style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"13px", fontWeight:700, color:pinkDark, marginBottom:"16px", marginTop:0 }}>📌 교육 기본 정보</p>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"12px", fontWeight:700, color:gray, marginBottom:"5px", display:"block" }}>교육명 *</label>
                <Input value={survey.title} onChange={v => setSurvey(d => ({...d, title: v}))} placeholder="예: 2025년 상반기 리더십 교육" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                <div>
                  <label style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"12px", fontWeight:700, color:gray, marginBottom:"5px", display:"block" }}>강사명</label>
                  <Input value={survey.instructor} onChange={v => setSurvey(d => ({...d, instructor: v}))} placeholder="강사 이름" />
                </div>
                <div>
                  <label style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"12px", fontWeight:700, color:gray, marginBottom:"5px", display:"block" }}>교육 일자</label>
                  <Input value={survey.date} onChange={v => setSurvey(d => ({...d, date: v}))} type="date" />
                </div>
              </div>
            </Card>
            <Card>
              <p style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"13px", fontWeight:700, color:pinkDark, marginBottom:"16px", marginTop:0 }}>📝 설문 항목</p>
              {survey.questions.map((q: { id: number; text: string; type: string }, i: number) => (
                <div key={q.id} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"11px 13px", borderRadius:"10px", background:grayLight, marginBottom:"8px" }}>
                  <span style={{ fontWeight:700, color:pink, fontSize:"13px", minWidth:"20px", fontFamily:"'Noto Sans KR',sans-serif" }}>{i+1}</span>
                  <span style={{ flex:1, fontSize:"13px", color:grayDark, fontFamily:"'Noto Sans KR',sans-serif" }}>{q.text}</span>
                  <span style={{ fontSize:"11px", padding:"3px 9px", borderRadius:"20px", background:q.type==="scale"?pinkLight:grayLight, color:q.type==="scale"?pinkDark:gray, fontWeight:600, fontFamily:"'Noto Sans KR',sans-serif" }}>
                    {q.type==="scale"?"5점 척도":"주관식"}
                  </span>
                  <button onClick={() => setSurvey(d => ({...d, questions: d.questions.filter((x: { id: number }) => x.id !== q.id)}))} style={{ background:"none", border:"none", color:"#e11d48", cursor:"pointer", fontSize:"15px" }}>✕</button>
                </div>
              ))}
              <div style={{ display:"flex", gap:"8px", marginTop:"14px", flexWrap:"wrap" }}>
                <input style={{ flex:1, minWidth:"180px", padding:"11px 14px", borderRadius:"10px", border:`1.5px solid ${grayMid}`, fontFamily:"'Noto Sans KR',sans-serif", fontSize:"14px", outline:"none", boxSizing:"border-box" }} value={newQ} onChange={e=>setNewQ(e.target.value)} placeholder="새 질문 입력" onKeyDown={e=>e.key==="Enter"&&addQ()} />
                <select value={newQType} onChange={e=>setNewQType(e.target.value)} style={{ padding:"11px 14px", borderRadius:"10px", border:`1.5px solid ${grayMid}`, fontFamily:"'Noto Sans KR',sans-serif", fontSize:"14px", outline:"none", background:"#fff" }}>
                  <option value="scale">5점 척도</option>
                  <option value="text">주관식</option>
                </select>
                <GhostBtn onClick={addQ}>+ 추가</GhostBtn>
              </div>
            </Card>
            {error && <p style={{ color:"#e11d48", fontSize:"13px", marginBottom:"12px", fontFamily:"'Noto Sans KR',sans-serif" }}>{error}</p>}
            <div style={{ display:"flex", gap:"10px" }}>
              <PrimaryBtn onClick={publish} fullWidth>{survey.published ? "설문 수정 완료 ✓" : "설문 게시 →"}</PrimaryBtn>
              {survey.published && <GhostBtn onClick={() => { setSurvey(d => ({...d, published: false})); setTab("design"); }}>게시 중단</GhostBtn>}
            </div>
          </>
        )}

        {tab === "dashboard" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"16px" }}>
              {[
                { label:"총 응답자", value:`${responses.length}명`, icon:"👥" },
                { label:"설문 항목", value:`${survey.questions.length}개`, icon:"📋" },
                { label:"설문 상태", value:survey.published?"게시 중":"미게시", icon:survey.published?"🟢":"🟡" },
              ].map(({label,value,icon}) => (
                <div key={label} style={{ background:"#fff", borderRadius:"16px", padding:"18px 12px", boxShadow:"0 2px 16px rgba(0,0,0,0.06)", textAlign:"center" }}>
                  <div style={{ fontSize:"22px", marginBottom:"6px" }}>{icon}</div>
                  <div style={{ fontFamily:"'Noto Serif KR',serif", fontSize:"20px", fontWeight:700, color:pinkDark }}>{value}</div>
                  <div style={{ fontSize:"12px", color:gray, fontFamily:"'Noto Sans KR',sans-serif" }}>{label}</div>
                </div>
              ))}
            </div>
            {survey.questions.filter((q: { type: string }) => q.type==="scale").map((q: { id: number; text: string; type: string }) => {
              const scores = responses.map((r: { answers: Record<number, number> }) => r.answers[q.id]).filter(Boolean) as number[];
              const avg = scores.length ? scores.reduce((a: number,b: number)=>a+b,0)/scores.length : 0;
              return (
                <div key={q.id} style={{ background:"#fff", borderRadius:"16px", padding:"16px 20px", boxShadow:"0 2px 16px rgba(0,0,0,0.06)", marginBottom:"10px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                    <span style={{ fontSize:"13px", color:grayDark, fontFamily:"'Noto Sans KR',sans-serif" }}>{q.text}</span>
                    <span style={{ fontWeight:700, color:pinkDark, fontFamily:"'Noto Serif KR',serif", fontSize:"16px" }}>{avg.toFixed(1)}/5.0</span>
                  </div>
                  <div style={{ height:"8px", background:grayLight, borderRadius:"4px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(avg/5)*100}%`, background:"linear-gradient(90deg,#f9a8c9,#f472b6)", borderRadius:"4px" }} />
                  </div>
                </div>
              );
            })}
            {responses.length > 0 ? (
              <Card>
                <p style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"12px", fontWeight:700, color:pinkDark, marginBottom:"12px", marginTop:0 }}>응답 목록</p>
                {responses.map((r: { name: string; submittedAt: string }, i: number) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 0", borderBottom:i<responses.length-1?`1px solid ${grayLight}`:"none" }}>
                    <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:pinkLight, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"12px", color:pinkDark, fontFamily:"'Noto Sans KR',sans-serif" }}>{i+1}</div>
                    <span style={{ fontSize:"14px", color:grayDark, fontFamily:"'Noto Sans KR',sans-serif" }}>{r.name}</span>
                    <span style={{ marginLeft:"auto", fontSize:"11px", color:"#9ca3af", fontFamily:"'Noto Sans KR',sans-serif" }}>{r.submittedAt}</span>
                  </div>
                ))}
              </Card>
            ) : (
              <div style={{ textAlign:"center", padding:"40px", color:gray, fontFamily:"'Noto Sans KR',sans-serif", fontSize:"14px" }}>
                <div style={{ fontSize:"32px", marginBottom:"12px" }}>⏳</div>
                아직 응답이 없습니다.
              </div>
            )}
          </>
        )}

        {tab === "report" && (
          responses.length === 0 ? (
            <Card><div style={{ textAlign:"center", padding:"24px" }}><div style={{ fontSize:"36px", marginBottom:"12px" }}>📭</div><p style={{ fontFamily:"'Noto Sans KR',sans-serif", color:gray, fontSize:"14px" }}>응답 데이터가 없습니다.</p></div></Card>
          ) : !report && !loading ? (
            <Card><div style={{ textAlign:"center", padding:"24px" }}>
              <div style={{ fontSize:"40px", marginBottom:"16px" }}>🤖</div>
              <p style={{ fontFamily:"'Noto Serif KR',serif", fontSize:"18px", color:grayDark, marginBottom:"8px" }}>AI 분석 보고서 생성</p>
              <p style={{ fontFamily:"'Noto Sans KR',sans-serif", color:gray, fontSize:"13px", marginBottom:"24px" }}>{responses.length}명의 응답을 분석합니다</p>
              <PrimaryBtn onClick={generateReport}>보고서 생성하기</PrimaryBtn>
            </div></Card>
          ) : loading ? (
            <Card><div style={{ textAlign:"center", padding:"48px" }}>
              <div style={{ display:"inline-block", width:"40px", height:"40px", border:`3px solid ${pinkLight}`, borderTopColor:pink, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
              <p style={{ fontFamily:"'Noto Sans KR',sans-serif", color:gray, marginTop:"16px", fontSize:"14px" }}>AI가 분석 중입니다...</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
            </div></Card>
          ) : (
            <>
              <Card>
                <p style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"13px", fontWeight:700, color:pinkDark, marginBottom:"16px", marginTop:0 }}>🤖 AI 종합 분석 보고서</p>
                <div style={{ whiteSpace:"pre-wrap", lineHeight:1.9, fontSize:"14px", color:grayDark, fontFamily:"'Noto Sans KR',sans-serif" }}>{report}</div>
              </Card>
              <GhostBtn onClick={generateReport}>보고서 재생성</GhostBtn>
            </>
          )
        )}
      </div>
    </div>
  );
}

// ── RESPONDENT ──
function RespondentView({ onHome }: { onHome: () => void }) {
  const [survey, setSurvey] = useState(() => loadSurvey());
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setSurvey(loadSurvey()), 3000);
    return () => clearInterval(t);
  }, []);

  if (!survey || !survey.published) {
    return (
      <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", padding:"24px" }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap" rel="stylesheet" />
        <div style={{ fontSize:"48px", marginBottom:"16px" }}>🔒</div>
        <h2 style={{ fontFamily:"'Noto Serif KR',serif", fontSize:"20px", color:grayDark, marginBottom:"8px" }}>아직 설문이 준비되지 않았습니다</h2>
        <p style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"14px", color:gray, marginBottom:"24px", textAlign:"center", lineHeight:1.7 }}>관리자가 설문을 게시하면 자동으로 열립니다.</p>
        <GhostBtn onClick={onHome}>← 홈으로</GhostBtn>
      </div>
    );
  }

  const submit = () => {
    const missing = survey.questions.find((q: { id: number }) => !answers[q.id] && answers[q.id] !== 0);
    if (missing) { setError(`"${missing.text}" 항목을 입력해주세요.`); return; }
    setError("");
    const existing = loadResponses();
    const now = new Date().toLocaleString("ko-KR", { month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit" });
    saveResponses([...existing, { name: `응답자 ${existing.length + 1}`, answers: { ...answers }, submittedAt: now }]);
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", padding:"24px" }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap" rel="stylesheet" />
        <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"linear-gradient(135deg,#f472b6,#f9a8c9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"36px", margin:"0 auto 24px", boxShadow:"0 8px 24px rgba(244,114,182,0.35)" }}>✓</div>
        <h2 style={{ fontFamily:"'Noto Serif KR',serif", fontSize:"22px", color:grayDark, marginBottom:"8px" }}>응답 완료!</h2>
        <p style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"14px", color:gray, marginBottom:"28px", lineHeight:1.8, textAlign:"center" }}>소중한 의견 감사합니다.<br/>교육 개선에 큰 도움이 됩니다.</p>
        <div style={{ display:"flex", gap:"10px" }}>
          <GhostBtn onClick={() => { setAnswers({}); setDone(false); }}>추가 응답</GhostBtn>
          <GhostBtn onClick={onHome}>홈으로</GhostBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:bg, padding:"24px 16px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth:"600px", margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"24px" }}>
          <div>
            <div style={{ fontSize:"11px", color:pink, fontWeight:700, fontFamily:"'Noto Sans KR',sans-serif", marginBottom:"4px", letterSpacing:"0.1em" }}>교육 평가 설문</div>
            <h1 style={{ fontFamily:"'Noto Serif KR',serif", fontSize:"20px", color:grayDark, margin:"0 0 4px" }}>{survey.title}</h1>
            {(survey.instructor || survey.date) && (
              <p style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"12px", color:gray, margin:0 }}>
                {survey.instructor && `강사: ${survey.instructor}`}{survey.instructor && survey.date && " · "}{survey.date}
              </p>
            )}
          </div>
          <GhostBtn onClick={onHome}>홈</GhostBtn>
        </div>
        {survey.questions.map((q: { id: number; text: string; type: string }, i: number) => (
          <Card key={q.id}>
            <div style={{ display:"flex", gap:"10px", alignItems:"flex-start", marginBottom:"16px" }}>
              <span style={{ width:"26px", height:"26px", borderRadius:"50%", background:pinkLight, color:pinkDark, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"12px", flexShrink:0, fontFamily:"'Noto Sans KR',sans-serif" }}>{i+1}</span>
              <label style={{ fontFamily:"'Noto Sans KR',sans-serif", fontSize:"15px", fontWeight:700, color:grayDark, lineHeight:1.5 }}>{q.text}</label>
            </div>
            {q.type==="scale" ? (
              <ScaleInput value={(answers[q.id] as number) || 0} onChange={v => setAnswers({...answers, [q.id]: v})} />
            ) : (
              <Textarea value={(answers[q.id] as string) || ""} onChange={v => setAnswers({...answers, [q.id]: v})} placeholder="자유롭게 작성해주세요" />
            )}
          </Card>
        ))}
        {error && <p style={{ color:"#e11d48", fontSize:"13px", marginBottom:"12px", fontFamily:"'Noto Sans KR',sans-serif" }}>{error}</p>}
        <PrimaryBtn onClick={submit} fullWidth>제출하기 ✓</PrimaryBtn>
        <div style={{ height:"40px" }} />
      </div>
    </div>
  );
}

// ── ROOT ──
export default function App() {
  const getHash = () => window.location.hash.replace("#", "");
  const [route, setRoute] = useState(getHash);
  useEffect(() => {
    const h = () => setRoute(getHash());
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  const goHome = () => { window.location.hash = ""; };
  if (route === "admin") return <AdminPanel onHome={goHome} />;
  if (route === "respondent") return <RespondentView onHome={goHome} />;
  return <RoleSelect onSelect={r => { window.location.hash = r; }} />;
}
