import { useState, useEffect } from 'react';

const C = {
  pink: '#f9a8c9',
  pinkLight: '#fde8f1',
  pinkMid: '#f472b6',
  pinkDark: '#be185d',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  grayMid: '#d1d5db',
  grayDark: '#374151',
  white: '#ffffff',
  bg: '#fdf2f8',
};

const SCALE_LABELS = ['매우 불만족', '불만족', '보통', '만족', '매우 만족'];
const defaultQuestions = [
  { id: 1, text: '교육 내용은 업무에 도움이 되었나요?', type: 'scale' },
  { id: 2, text: '강사의 전달력은 어떠했나요?', type: 'scale' },
  { id: 3, text: '교육 시간은 적절했나요?', type: 'scale' },
  { id: 4, text: '교육에서 가장 유익했던 점은 무엇인가요?', type: 'text' },
  { id: 5, text: '개선이 필요한 부분이 있다면 무엇인가요?', type: 'text' },
];

// ── Shared storage key ──
const STORAGE_KEY = 'edu_survey_data';
const RESPONSES_KEY = 'edu_survey_responses';

const loadSurvey = () => {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    return d ? JSON.parse(d) : null;
  } catch {
    return null;
  }
};
const saveSurvey = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};
const loadResponses = () => {
  try {
    const d = localStorage.getItem(RESPONSES_KEY);
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
};
const saveResponses = (data) => {
  try {
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(data));
  } catch {}
};

// ── Styles ──
const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1.5px solid #d1d5db',
  fontFamily: "'Noto Sans KR', sans-serif",
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#ffffff',
};
const labelStyle = {
  fontFamily: "'Noto Sans KR', sans-serif",
  fontSize: '12px',
  fontWeight: '700',
  color: '#6b7280',
  marginBottom: '5px',
  display: 'block',
  letterSpacing: '0.05em',
};
const cardStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  marginBottom: '16px',
};

function PrimaryBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 28px',
        borderRadius: '10px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: '700',
        fontSize: '14px',
        background: disabled
          ? '#d1d5db'
          : 'linear-gradient(135deg, #f472b6, #f9a8c9)',
        color: '#ffffff',
        opacity: disabled ? 0.6 : 1,
        boxShadow: disabled ? 'none' : '0 4px 14px rgba(244,114,182,0.35)',
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
function GhostBtn({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '11px 22px',
        borderRadius: '10px',
        border: '1.5px solid #d1d5db',
        cursor: 'pointer',
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: '600',
        fontSize: '14px',
        background: '#ffffff',
        color: '#6b7280',
        transition: 'all 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
function ScaleInput({ value, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '2px solid',
            borderColor: value === v ? '#f472b6' : '#d1d5db',
            background:
              value === v
                ? 'linear-gradient(135deg,#f472b6,#f9a8c9)'
                : '#ffffff',
            color: value === v ? '#ffffff' : '#6b7280',
            fontFamily: "'Noto Sans KR', sans-serif",
            fontWeight: '700',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.15s',
            boxShadow:
              value === v ? '0 4px 12px rgba(244,114,182,0.4)' : 'none',
          }}
        >
          {v}
        </button>
      ))}
      {value && (
        <span
          style={{
            fontSize: '12px',
            color: '#be185d',
            fontFamily: "'Noto Sans KR', sans-serif",
            marginLeft: '4px',
          }}
        >
          {SCALE_LABELS[value - 1]}
        </span>
      )}
    </div>
  );
}

// ══════════════════════════════════════
// HOME — role select + link share
// ══════════════════════════════════════
function HomePage({ onRole }) {
  const base = window.location.href.split('#')[0];
  const adminLink = `${base}#admin`;
  const respondentLink = `${base}#respondent`;
  const [copied, setCopied] = useState('');

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fdf2f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#f472b6,#f9a8c9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(244,114,182,0.3)',
          }}
        >
          📋
        </div>
        <h1
          style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: '26px',
            color: '#374151',
            margin: '0 0 8px',
          }}
        >
          교육 평가 설문 시스템
        </h1>
        <p
          style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
          }}
        >
          역할을 선택하거나 링크를 공유하세요
        </p>
      </div>

      {/* Role cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          maxWidth: '480px',
          width: '100%',
          marginBottom: '32px',
        }}
      >
        {[
          {
            role: 'admin',
            icon: '⚙️',
            title: '관리자',
            desc: '설문 설계 · 결과 분석\nAI 보고서 생성',
          },
          {
            role: 'respondent',
            icon: '✏️',
            title: '응답자',
            desc: '교육 평가 설문\n참여하기',
          },
        ].map(({ role, icon, title, desc }) => (
          <button
            key={role}
            onClick={() => onRole(role)}
            style={{
              background: '#ffffff',
              border: '2px solid #d1d5db',
              borderRadius: '20px',
              padding: '28px 16px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#f472b6';
              e.currentTarget.style.boxShadow =
                '0 8px 28px rgba(244,114,182,0.22)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>{icon}</div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '6px',
                fontFamily: "'Noto Sans KR', sans-serif",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                whiteSpace: 'pre-line',
                lineHeight: '1.7',
                fontFamily: "'Noto Sans KR', sans-serif",
              }}
            >
              {desc}
            </div>
          </button>
        ))}
      </div>

      {/* Link share section */}
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <p
          style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: '12px',
            fontWeight: '700',
            color: '#6b7280',
            letterSpacing: '0.08em',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          🔗 링크로 바로 접근
        </p>
        {[
          {
            label: '관리자 링크',
            link: adminLink,
            key: 'admin',
            icon: '⚙️',
            color: '#fde8f1',
            textColor: '#be185d',
          },
          {
            label: '응답자 링크',
            link: respondentLink,
            key: 'respondent',
            icon: '✏️',
            color: '#f3f4f6',
            textColor: '#374151',
          },
        ].map(({ label, link, key, icon, color, textColor }) => (
          <div
            key={key}
            style={{
              background: color,
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: '11px',
                  fontWeight: '700',
                  color: textColor,
                  marginBottom: '2px',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#6b7280',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {link}
              </div>
            </div>
            <button
              onClick={() => copy(link, key)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                background: copied === key ? '#f472b6' : '#ffffff',
                color: copied === key ? '#ffffff' : '#6b7280',
                fontFamily: "'Noto Sans KR', sans-serif",
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              {copied === key ? '✓ 복사됨' : '복사'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// ADMIN
// ══════════════════════════════════════
function AdminPanel({ onHome }) {
  const [surveyData, setSurveyDataState] = useState(
    () =>
      loadSurvey() || {
        title: '',
        instructor: '',
        date: '',
        questions: defaultQuestions,
        published: false,
      }
  );
  const [responses, setResponses] = useState(() => loadResponses());
  const [tab, setTab] = useState(
    loadSurvey()?.published ? 'dashboard' : 'design'
  );
  const [newQ, setNewQ] = useState('');
  const [newQType, setNewQType] = useState('scale');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Poll responses every 3s (simulates real-time)
  useEffect(() => {
    const timer = setInterval(() => setResponses(loadResponses()), 3000);
    return () => clearInterval(timer);
  }, []);

  const setSurveyData = (updater) => {
    setSurveyDataState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveSurvey(next);
      return next;
    });
  };

  const { title, instructor, date, questions } = surveyData;

  const addQ = () => {
    if (!newQ.trim()) return;
    setSurveyData((d) => ({
      ...d,
      questions: [
        ...d.questions,
        { id: Date.now(), text: newQ.trim(), type: newQType },
      ],
    }));
    setNewQ('');
  };
  const removeQ = (id) =>
    setSurveyData((d) => ({
      ...d,
      questions: d.questions.filter((q) => q.id !== id),
    }));

  const publish = () => {
    if (!title.trim()) {
      setError('교육명을 입력해주세요.');
      return;
    }
    setError('');
    setSurveyData((d) => ({ ...d, published: true }));
    setTab('dashboard');
  };

  const unpublish = () => {
    setSurveyData((d) => ({ ...d, published: false }));
    setTab('design');
  };

  const resetAll = () => {
    if (!window.confirm('모든 설문 데이터와 응답을 초기화할까요?')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RESPONSES_KEY);
    setSurveyDataState({
      title: '',
      instructor: '',
      date: '',
      questions: defaultQuestions,
      published: false,
    });
    setResponses([]);
    setReport('');
    setTab('design');
  };

  const generateReport = async () => {
    setLoading(true);
    setReport('');
    const summary = questions
      .map((q) => {
        if (q.type === 'scale') {
          const scores = responses.map((r) => r.answers[q.id]).filter(Boolean);
          const avg = scores.length
            ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
            : 'N/A';
          const dist = [1, 2, 3, 4, 5]
            .map((v) => `${v}점:${scores.filter((s) => s === v).length}명`)
            .join(', ');
          return `[척도] ${q.text}\n  평균: ${avg}/5.0 | 분포: ${dist}`;
        } else {
          const texts = responses.map((r) => r.answers[q.id]).filter(Boolean);
          return `[주관식] ${q.text}\n  응답: ${texts
            .map((t, i) => `(${i + 1}) ${t}`)
            .join(' | ')}`;
        }
      })
      .join('\n\n');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `교육 평가 전문가로서 아래 설문 결과를 분석해 전문 보고서를 작성해주세요.\n\n교육명: ${title} | 강사: ${
                instructor || '미기재'
              } | 일자: ${date || '미기재'} | 응답자: ${
                responses.length
              }명\n\n${summary}\n\n다음 순서로 작성:\n1. 종합 만족도 평가 (★ 별점 포함)\n2. 항목별 상세 분석\n3. 주관식 응답 핵심 인사이트\n4. 개선 권고사항 3가지\n5. 종합 결론`,
            },
          ],
        }),
      });
      const data = await res.json();
      setReport(
        data.content?.map((b) => b.text || '').join('\n') || '보고서 생성 실패'
      );
    } catch {
      setReport('오류가 발생했습니다.');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fdf2f8',
        padding: '24px 16px',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#f472b6,#f9a8c9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              ⚙️
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#374151',
                }}
              >
                관리자 패널
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}
              >
                {surveyData.published ? (
                  <span style={{ color: '#16a34a', fontWeight: '700' }}>
                    ● 설문 게시 중
                  </span>
                ) : (
                  <span style={{ color: '#d97706', fontWeight: '700' }}>
                    ● 미게시
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <GhostBtn
              onClick={resetAll}
              style={{
                fontSize: '12px',
                padding: '8px 14px',
                color: '#e11d48',
                borderColor: '#fca5a5',
              }}
            >
              초기화
            </GhostBtn>
            <GhostBtn onClick={onHome}>← 홈</GhostBtn>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: '#f3f4f6',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px',
          }}
        >
          {[
            ['design', '⚙️ 설문 설계'],
            ['dashboard', '📊 응답 현황'],
            ['report', '🤖 AI 보고서'],
          ].map(([s, l]) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif",
                fontWeight: '700',
                fontSize: '13px',
                background: tab === s ? '#ffffff' : 'transparent',
                color: tab === s ? '#be185d' : '#6b7280',
                boxShadow: tab === s ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* DESIGN */}
        {tab === 'design' && (
          <>
            <div style={cardStyle}>
              <p
                style={{
                  fontFamily: "'Noto Sans KR',sans-serif",
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#be185d',
                  marginBottom: '16px',
                  marginTop: 0,
                }}
              >
                📌 교육 기본 정보
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>교육명 *</label>
                  <input
                    style={inputStyle}
                    value={title}
                    onChange={(e) =>
                      setSurveyData((d) => ({ ...d, title: e.target.value }))
                    }
                    placeholder="예: 2025년 상반기 리더십 교육"
                  />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  <div>
                    <label style={labelStyle}>강사명</label>
                    <input
                      style={inputStyle}
                      value={instructor}
                      onChange={(e) =>
                        setSurveyData((d) => ({
                          ...d,
                          instructor: e.target.value,
                        }))
                      }
                      placeholder="강사 이름"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>교육 일자</label>
                    <input
                      style={inputStyle}
                      type="date"
                      value={date}
                      onChange={(e) =>
                        setSurveyData((d) => ({ ...d, date: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <p
                style={{
                  fontFamily: "'Noto Sans KR',sans-serif",
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#be185d',
                  marginBottom: '16px',
                  marginTop: 0,
                }}
              >
                📝 설문 항목
              </p>
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '11px 13px',
                    borderRadius: '10px',
                    background: '#f3f4f6',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontWeight: '700',
                      color: '#f472b6',
                      fontSize: '13px',
                      minWidth: '20px',
                      fontFamily: "'Noto Sans KR',sans-serif",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: '13px',
                      color: '#374151',
                      fontFamily: "'Noto Sans KR',sans-serif",
                    }}
                  >
                    {q.text}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '3px 9px',
                      borderRadius: '20px',
                      background: q.type === 'scale' ? '#fde8f1' : '#f3f4f6',
                      color: q.type === 'scale' ? '#be185d' : '#6b7280',
                      fontWeight: '600',
                      fontFamily: "'Noto Sans KR',sans-serif",
                    }}
                  >
                    {q.type === 'scale' ? '5점 척도' : '주관식'}
                  </span>
                  <button
                    onClick={() => removeQ(q.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e11d48',
                      cursor: 'pointer',
                      fontSize: '15px',
                      padding: '2px 5px',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '14px',
                  flexWrap: 'wrap',
                }}
              >
                <input
                  style={{ ...inputStyle, flex: 1, minWidth: '180px' }}
                  value={newQ}
                  onChange={(e) => setNewQ(e.target.value)}
                  placeholder="새 질문 입력"
                  onKeyDown={(e) => e.key === 'Enter' && addQ()}
                />
                <select
                  value={newQType}
                  onChange={(e) => setNewQType(e.target.value)}
                  style={{ ...inputStyle, width: '100px', flex: 'none' }}
                >
                  <option value="scale">5점 척도</option>
                  <option value="text">주관식</option>
                </select>
                <GhostBtn onClick={addQ}>+ 추가</GhostBtn>
              </div>
            </div>

            {error && (
              <p
                style={{
                  color: '#e11d48',
                  fontSize: '13px',
                  marginBottom: '12px',
                  fontFamily: "'Noto Sans KR',sans-serif",
                }}
              >
                {error}
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <PrimaryBtn
                onClick={publish}
                style={{ flex: 1, padding: '15px' }}
              >
                {surveyData.published ? '설문 수정 완료 ✓' : '설문 게시 →'}
              </PrimaryBtn>
              {surveyData.published && (
                <GhostBtn onClick={unpublish} style={{ padding: '15px 20px' }}>
                  게시 중단
                </GhostBtn>
              )}
            </div>
          </>
        )}

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              {[
                {
                  label: '총 응답자',
                  value: `${responses.length}명`,
                  icon: '👥',
                },
                {
                  label: '설문 항목',
                  value: `${questions.length}개`,
                  icon: '📋',
                },
                {
                  label: '설문 상태',
                  value: surveyData.published ? '게시 중' : '미게시',
                  icon: surveyData.published ? '🟢' : '🟡',
                },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  style={{
                    ...cardStyle,
                    textAlign: 'center',
                    marginBottom: 0,
                    padding: '18px 12px',
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '6px' }}>
                    {icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Noto Serif KR',serif",
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#be185d',
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      fontFamily: "'Noto Sans KR',sans-serif",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {questions
              .filter((q) => q.type === 'scale')
              .map((q) => {
                const scores = responses
                  .map((r) => r.answers[q.id])
                  .filter(Boolean);
                const avg = scores.length
                  ? scores.reduce((a, b) => a + b, 0) / scores.length
                  : 0;
                return (
                  <div
                    key={q.id}
                    style={{
                      ...cardStyle,
                      padding: '16px 20px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#374151',
                          fontFamily: "'Noto Sans KR',sans-serif",
                        }}
                      >
                        {q.text}
                      </span>
                      <span
                        style={{
                          fontWeight: '700',
                          color: '#be185d',
                          fontFamily: "'Noto Serif KR',serif",
                          fontSize: '16px',
                        }}
                      >
                        {avg.toFixed(1)}/5.0
                      </span>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        background: '#f3f4f6',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(avg / 5) * 100}%`,
                          background: 'linear-gradient(90deg,#f9a8c9,#f472b6)',
                          borderRadius: '4px',
                          transition: 'width 0.5s',
                        }}
                      />
                    </div>
                  </div>
                );
              })}

            {responses.length > 0 ? (
              <div style={cardStyle}>
                <p
                  style={{
                    fontFamily: "'Noto Sans KR',sans-serif",
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#be185d',
                    marginBottom: '12px',
                    marginTop: 0,
                    letterSpacing: '0.05em',
                  }}
                >
                  응답 목록{' '}
                  <span style={{ color: '#6b7280', fontWeight: '400' }}>
                    (3초마다 자동 갱신)
                  </span>
                </p>
                {responses.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 0',
                      borderBottom:
                        i < responses.length - 1 ? '1px solid #f3f4f6' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: '#fde8f1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '12px',
                        color: '#be185d',
                        fontFamily: "'Noto Sans KR',sans-serif",
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        fontFamily: "'Noto Sans KR',sans-serif",
                      }}
                    >
                      {r.name}
                    </span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '11px',
                        color: '#9ca3af',
                        fontFamily: "'Noto Sans KR',sans-serif",
                      }}
                    >
                      {r.submittedAt}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6b7280',
                  fontFamily: "'Noto Sans KR',sans-serif",
                  fontSize: '14px',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                아직 응답이 없습니다.
                <br />
                응답자 링크를 공유해주세요.
              </div>
            )}
          </>
        )}

        {/* REPORT */}
        {tab === 'report' &&
          (responses.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📭</div>
              <p
                style={{
                  fontFamily: "'Noto Sans KR',sans-serif",
                  color: '#6b7280',
                  fontSize: '14px',
                }}
              >
                응답 데이터가 없습니다.
                <br />
                응답자 링크를 공유하고 응답을 수집하세요.
              </p>
            </div>
          ) : !report && !loading ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🤖</div>
              <p
                style={{
                  fontFamily: "'Noto Serif KR',serif",
                  fontSize: '18px',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                AI 분석 보고서 생성
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans KR',sans-serif",
                  color: '#6b7280',
                  fontSize: '13px',
                  marginBottom: '24px',
                }}
              >
                {responses.length}명의 응답을 분석합니다
              </p>
              <PrimaryBtn onClick={generateReport}>보고서 생성하기</PrimaryBtn>
            </div>
          ) : loading ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '3px solid #fde8f1',
                  borderTopColor: '#f472b6',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p
                style={{
                  fontFamily: "'Noto Sans KR',sans-serif",
                  color: '#6b7280',
                  marginTop: '16px',
                  fontSize: '14px',
                }}
              >
                AI가 분석 중입니다...
              </p>
              <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
            </div>
          ) : (
            <>
              <div style={cardStyle}>
                <p
                  style={{
                    fontFamily: "'Noto Sans KR',sans-serif",
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#be185d',
                    marginBottom: '16px',
                    marginTop: 0,
                  }}
                >
                  🤖 AI 종합 분석 보고서
                </p>
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.9',
                    fontSize: '14px',
                    color: '#374151',
                    fontFamily: "'Noto Sans KR',sans-serif",
                  }}
                >
                  {report}
                </div>
              </div>
              <GhostBtn onClick={generateReport} style={{ width: '100%' }}>
                보고서 재생성
              </GhostBtn>
            </>
          ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// RESPONDENT
// ══════════════════════════════════════
function RespondentView({ onHome }) {
  const [surveyData, setSurveyData] = useState(() => loadSurvey());
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Poll survey changes every 3s
  useEffect(() => {
    const timer = setInterval(() => setSurveyData(loadSurvey()), 3000);
    return () => clearInterval(timer);
  }, []);

  if (!surveyData || !surveyData.published) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#fdf2f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '24px',
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2
          style={{
            fontFamily: "'Noto Serif KR',serif",
            fontSize: '20px',
            color: '#374151',
            marginBottom: '8px',
          }}
        >
          아직 설문이 준비되지 않았습니다
        </h2>
        <p
          style={{
            fontFamily: "'Noto Sans KR',sans-serif",
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '24px',
            textAlign: 'center',
            lineHeight: '1.7',
          }}
        >
          관리자가 설문을 게시하면
          <br />
          자동으로 화면이 열립니다.
        </p>
        <GhostBtn onClick={onHome}>← 홈으로</GhostBtn>
      </div>
    );
  }

  const submit = () => {
    const missing = surveyData.questions.find(
      (q) => !answers[q.id] && answers[q.id] !== 0
    );
    if (missing) {
      setError(`"${missing.text}" 항목을 입력해주세요.`);
      return;
    }
    setError('');
    const existing = loadResponses();
    const now = new Date().toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newResp = {
      name: `응답자 ${existing.length + 1}`,
      answers: { ...answers },
      submittedAt: now,
    };
    saveResponses([...existing, newResp]);
    setDone(true);
  };

  if (done) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#fdf2f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '24px',
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#f472b6,#f9a8c9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(244,114,182,0.35)',
            }}
          >
            ✓
          </div>
          <h2
            style={{
              fontFamily: "'Noto Serif KR',serif",
              fontSize: '22px',
              color: '#374151',
              marginBottom: '8px',
            }}
          >
            응답 완료!
          </h2>
          <p
            style={{
              fontFamily: "'Noto Sans KR',sans-serif",
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '28px',
              lineHeight: '1.8',
            }}
          >
            소중한 의견 감사합니다.
            <br />
            교육 개선에 큰 도움이 됩니다.
          </p>
          <div
            style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}
          >
            <GhostBtn
              onClick={() => {
                setAnswers({});
                setName('');
                setDone(false);
              }}
            >
              추가 응답
            </GhostBtn>
            <GhostBtn onClick={onHome}>홈으로</GhostBtn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fdf2f8',
        padding: '24px 16px',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                color: '#f472b6',
                fontWeight: '700',
                fontFamily: "'Noto Sans KR',sans-serif",
                marginBottom: '4px',
                letterSpacing: '0.1em',
              }}
            >
              교육 평가 설문
            </div>
            <h1
              style={{
                fontFamily: "'Noto Serif KR',serif",
                fontSize: '20px',
                color: '#374151',
                margin: '0 0 4px',
              }}
            >
              {surveyData.title}
            </h1>
            {(surveyData.instructor || surveyData.date) && (
              <p
                style={{
                  fontFamily: "'Noto Sans KR',sans-serif",
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: 0,
                }}
              >
                {surveyData.instructor && `강사: ${surveyData.instructor}`}
                {surveyData.instructor && surveyData.date && ' · '}
                {surveyData.date}
              </p>
            )}
          </div>
          <GhostBtn
            onClick={onHome}
            style={{ flexShrink: 0, marginLeft: '12px' }}
          >
            홈
          </GhostBtn>
        </div>

        {surveyData.questions.map((q, i) => (
          <div key={q.id} style={cardStyle}>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#fde8f1',
                  color: '#be185d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '12px',
                  flexShrink: 0,
                  fontFamily: "'Noto Sans KR',sans-serif",
                }}
              >
                {i + 1}
              </span>
              <label
                style={{
                  fontFamily: "'Noto Sans KR',sans-serif",
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#374151',
                  lineHeight: '1.5',
                }}
              >
                {q.text}
              </label>
            </div>
            {q.type === 'scale' ? (
              <ScaleInput
                value={answers[q.id]}
                onChange={(v) => setAnswers({ ...answers, [q.id]: v })}
              />
            ) : (
              <textarea
                style={{ ...inputStyle, minHeight: '88px', resize: 'vertical' }}
                value={answers[q.id] || ''}
                onChange={(e) =>
                  setAnswers({ ...answers, [q.id]: e.target.value })
                }
                placeholder="자유롭게 작성해주세요"
              />
            )}
          </div>
        ))}

        {error && (
          <p
            style={{
              color: '#e11d48',
              fontSize: '13px',
              marginBottom: '12px',
              fontFamily: "'Noto Sans KR',sans-serif",
            }}
          >
            {error}
          </p>
        )}
        <PrimaryBtn
          onClick={submit}
          style={{ width: '100%', padding: '16px', fontSize: '15px' }}
        >
          제출하기 ✓
        </PrimaryBtn>
        <div style={{ height: '40px' }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// ROOT — hash-based routing
// ══════════════════════════════════════
export default function App() {
  const getHash = () => window.location.hash.replace('#', '');
  const [route, setRoute] = useState(getHash);

  useEffect(() => {
    const handler = () => setRoute(getHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const goHome = () => {
    window.location.hash = '';
  };

  if (route === 'admin') return <AdminPanel onHome={goHome} />;
  if (route === 'respondent') return <RespondentView onHome={goHome} />;
  return (
    <HomePage
      onRole={(r) => {
        window.location.hash = r;
      }}
    />
  );
}
