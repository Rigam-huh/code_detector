import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from "recharts";

const GFONT = `@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');`;

const CSS = `
${GFONT}
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080810;--card:#11111e;--border:#1a1a2e;
  --accent:#00ffb3;--red:#ff6b6b;--yellow:#ffd166;--blue:#6b8aff;--purple:#c77dff;
  --text:#e8e8f0;--muted:#5a5a7a;
}
body{font-family:'Syne',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.app{max-width:1120px;margin:0 auto;padding:36px 24px}
.hdr{display:flex;align-items:center;gap:14px;margin-bottom:40px}
.hdr-logo{width:52px;height:52px;background:var(--accent);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 0 40px rgba(0,255,179,.35);flex-shrink:0}
.hdr h1{font-size:30px;font-weight:800;letter-spacing:-.5px}
.hdr h1 em{color:var(--accent);font-style:normal}
.hdr-sub{font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);margin-top:3px}
.panel{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:26px;margin-bottom:28px}
.row{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.inp{flex:1;min-width:240px;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:11px 15px;color:var(--text);font-family:'Space Mono',monospace;font-size:13px;outline:none;transition:border-color .2s}
.inp:focus{border-color:var(--accent)}
.inp::placeholder{color:var(--muted)}
.sel{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:11px 15px;color:var(--text);font-family:'Space Mono',monospace;font-size:13px;outline:none;cursor:pointer;min-width:130px}
.btn{background:var(--accent);color:#000;border:none;border-radius:10px;padding:11px 22px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;display:flex;align-items:center;gap:7px}
.btn:hover{transform:translateY(-1px);box-shadow:0 0 24px rgba(0,255,179,.4)}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.code-ta{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px;color:var(--text);font-family:'Space Mono',monospace;font-size:12px;line-height:1.7;resize:vertical;min-height:170px;outline:none;transition:border-color .2s}
.code-ta:focus{border-color:var(--accent)}
.code-ta::placeholder{color:var(--muted)}
.lbl{font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--muted);margin-bottom:9px;display:block}
.err{margin-top:10px;color:var(--red);font-family:'Space Mono',monospace;font-size:11px;background:rgba(255,107,107,.07);padding:10px 14px;border-radius:8px;word-break:break-all}
.loading{display:flex;flex-direction:column;align-items:center;gap:18px;padding:70px;color:var(--muted);font-family:'Space Mono',monospace;font-size:13px}
.spin{width:44px;height:44px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-bar{width:260px;height:2px;background:var(--border);border-radius:99px;overflow:hidden;margin-top:6px}
.loading-bar-fill{height:100%;background:var(--accent);border-radius:99px;animation:lbar 1.4s ease-in-out infinite}
@keyframes lbar{0%{width:0%;margin-left:0}50%{width:70%}100%{width:0%;margin-left:100%}}
.empty{text-align:center;padding:80px 40px;color:var(--muted);font-family:'Space Mono',monospace;font-size:13px;line-height:2}
.empty-icon{font-size:52px;margin-bottom:14px;display:block;opacity:.3}
.results{display:grid;gap:18px}
.score-hero{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:28px;display:flex;align-items:center;gap:32px;flex-wrap:wrap;background:linear-gradient(135deg,rgba(0,255,179,.04) 0%,transparent 60%)}
.score-ring-wrap{position:relative;width:130px;height:130px;flex-shrink:0}
.score-ring-wrap svg{position:absolute;top:0;left:0}
.score-ring-label{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none}
.score-ring-num{font-size:34px;font-weight:800;display:block;line-height:1}
.score-ring-sub{font-family:'Space Mono',monospace;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:2px}
.score-info{flex:1;min-width:200px}
.score-grade{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}
.score-summary{font-size:13px;line-height:1.7;color:#b0b0cc;margin-bottom:14px}
.tag-list{display:flex;flex-wrap:wrap;gap:6px}
.tag{font-family:'Space Mono',monospace;font-size:10px;padding:3px 9px;border-radius:5px;background:rgba(255,255,255,.05);color:var(--muted);border:1px solid var(--border)}
.charts-row{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media(max-width:680px){.charts-row{grid-template-columns:1fr}}
.chart-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px}
.chart-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:18px;display:flex;align-items:center;gap:8px}
.chart-title em{color:var(--accent);font-style:normal}
.bar-tip{background:#1a1a2e;border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:'Space Mono',monospace;font-size:12px;color:var(--text)}
.findings-grid{display:grid;gap:10px}
.finding{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px 20px;border-left:3px solid transparent;animation:fadeUp .35s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(7px)}}
.finding.error{border-left-color:var(--red)}
.finding.warning{border-left-color:var(--yellow)}
.finding.info{border-left-color:var(--blue)}
.finding.success{border-left-color:var(--accent)}
.finding-hdr{display:flex;align-items:center;gap:9px;margin-bottom:9px;flex-wrap:wrap}
.badge{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;text-transform:uppercase;letter-spacing:1px}
.finding.error .badge{background:rgba(255,107,107,.13);color:var(--red)}
.finding.warning .badge{background:rgba(255,209,102,.13);color:var(--yellow)}
.finding.info .badge{background:rgba(107,138,255,.13);color:var(--blue)}
.finding.success .badge{background:rgba(0,255,179,.13);color:var(--accent)}
.finding-title{font-size:14px;font-weight:700}
.finding-line{font-family:'Space Mono',monospace;font-size:10px;color:var(--muted);margin-left:auto}
.finding-desc{font-size:13px;color:#a0a0be;line-height:1.65;margin-bottom:11px}
.fix-box{background:var(--bg);border-radius:8px;padding:11px 14px}
.fix-label{font-family:'Space Mono',monospace;font-size:9px;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:5px}
.fix-box code{font-family:'Space Mono',monospace;font-size:11px;color:var(--text);white-space:pre-wrap;line-height:1.65}
.complexity-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px}
.cx-list{display:grid;gap:10px;margin-top:16px}
.cx-item{padding:13px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border)}
.cx-row1{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap}
.cx-fn{font-family:'Space Mono',monospace;font-size:12px;font-weight:700;flex:1}
.cx-tag{font-family:'Space Mono',monospace;font-size:11px;padding:3px 9px;border-radius:5px;font-weight:700}
.O1{background:rgba(0,255,179,.13);color:var(--accent)}
.ON{background:rgba(107,138,255,.13);color:var(--blue)}
.ONlogN{background:rgba(199,125,255,.13);color:var(--purple)}
.ON2{background:rgba(255,107,107,.13);color:var(--red)}
.cx-note{font-size:11px;color:var(--muted);line-height:1.5}
.cx-track-wrap{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.cx-track-label{font-family:'Space Mono',monospace;font-size:9px;color:var(--muted);width:52px;flex-shrink:0}
.cx-track{flex:1;height:8px;background:var(--border);border-radius:99px;overflow:hidden}
.cx-fill{height:100%;border-radius:99px;transition:width 1s cubic-bezier(.4,0,.2,1)}
.tabs{display:flex;gap:2px;margin-bottom:14px;border-bottom:1px solid var(--border)}
.tab{background:none;border:none;color:var(--muted);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;padding:9px 16px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .2s}
.tab.active{color:var(--accent);border-bottom-color:var(--accent)}
.tab:hover:not(.active){color:var(--text)}
.legend{display:flex;gap:16px;margin-top:14px}
.legend-item{font-family:'Space Mono',monospace;font-size:10px;color:var(--muted);display:flex;align-items:center;gap:6px}
.legend-dot{width:10px;height:10px;border-radius:2px;display:inline-block}
`;

const scoreColor = s => s >= 80 ? "#00ffb3" : s >= 60 ? "#ffd166" : "#ff6b6b";
const scoreGrade = s => s >= 90 ? "Excellent" : s >= 75 ? "Good" : s >= 60 ? "Fair" : "Needs Work";

const CX_ORDER = { "O(1)": 0, "O(log n)": 1, "O(n)": 2, "O(n log n)": 3, "O(n^2)": 4, "O(2^n)": 5, "O(n!)": 6 };
const cxWidth = o => [6, 16, 32, 50, 76, 90, 98][CX_ORDER[o] ?? 3];
const cxClass = o => o === "O(1)" ? "O1" : (o === "O(n)" || o === "O(log n)") ? "ON" : o === "O(n log n)" ? "ONlogN" : "ON2";

function ScoreRing({ score }) {
  const [val, setVal] = useState(0);
  const r = 52, circ = 2 * Math.PI * r, color = scoreColor(score);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 900, 1);
      setVal(Math.round(p * score));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);
  const offset = circ - (val / 100) * circ;
  return (
    <div className="score-ring-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#1a1a2e" strokeWidth="8" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 65 65)" style={{ opacity: 0.12, transition: "stroke-dashoffset .05s linear" }} />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset .05s linear" }} />
      </svg>
      <div className="score-ring-label">
        <span className="score-ring-num" style={{ color }}>{val}</span>
        <span className="score-ring-sub">/ 100</span>
      </div>
    </div>
  );
}

function MetricsRadar({ metrics }) {
  const data = Object.entries(metrics).map(([k, v]) => ({
    subject: k.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()), value: v, fullMark: 100
  }));
  return (
    <ResponsiveContainer width="100%" height={210}>
      <RadarChart data={data} margin={{ top: 10, right: 24, bottom: 10, left: 24 }}>
        <PolarGrid stroke="#1a1a2e" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#5a5a7a", fontSize: 10, fontFamily: "Space Mono" }} />
        <Radar dataKey="value" stroke="#00ffb3" fill="#00ffb3" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#00ffb3", r: 3 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function MetricsBar({ metrics }) {
  const data = Object.entries(metrics).map(([k, v]) => ({
    name: k.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()), value: v
  }));
  const Tip = ({ active, payload }) =>
    active && payload?.length
      ? <div className="bar-tip">{payload[0].name}: <b>{payload[0].value}</b>/100</div>
      : null;
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -22 }}>
        <XAxis dataKey="name" tick={{ fill: "#5a5a7a", fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: "#5a5a7a", fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="value" name="Score" radius={[6, 6, 0, 0]}>
          {data.map((e, i) => <Cell key={i} fill={scoreColor(e.value)} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function ComplexityItem({ c }) {
  const w = cxWidth(c.current);
  const wOpt = c.optimized ? cxWidth(c.optimized) : null;
  return (
    <div className="cx-item">
      <div className="cx-row1">
        <span className="cx-fn">{c.function}()</span>
        <span className={`cx-tag ${cxClass(c.current)}`}>{c.current}</span>
        {c.optimized
          ? <span className={`cx-tag ${cxClass(c.optimized)}`}>→ {c.optimized}</span>
          : <span style={{ fontSize: 10, color: "var(--accent)", fontFamily: "Space Mono, monospace" }}>✓ optimal</span>
        }
      </div>
      <div className="cx-track-wrap">
        <span className="cx-track-label">current</span>
        <div className="cx-track">
          <div className="cx-fill" style={{ width: `${w}%`, background: scoreColor(100 - w) }} />
        </div>
      </div>
      {wOpt !== null && (
        <div className="cx-track-wrap">
          <span className="cx-track-label">optimized</span>
          <div className="cx-track">
            <div className="cx-fill" style={{ width: `${wOpt}%`, background: "var(--accent)", opacity: 0.6 }} />
          </div>
        </div>
      )}
      <div className="cx-note" style={{ marginTop: 8 }}>{c.note}</div>
    </div>
  );
}

const SAMPLES = {
  python: `def find_duplicates(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] == arr[j] and arr[i] not in duplicates:
                duplicates.append(arr[i])
    return duplicates

def calculate_average(numbers):
    total = 0
    for n in numbers:
        total = total + n
    return total / len(numbers)

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
  javascript: `function findDuplicates(arr) {
  let duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i+1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i]))
        duplicates.push(arr[i]);
    }
  }
  return duplicates;
}
function fetchUser(id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/users/' + id, false);
  xhr.send();
  return JSON.parse(xhr.responseText);
}`,
  java: `public class Solution {
    public int[] findDuplicates(int[] arr) {
        List<Integer> dups = new ArrayList<>();
        for (int i = 0; i < arr.length; i++)
            for (int j = i+1; j < arr.length; j++)
                if (arr[i]==arr[j] && !dups.contains(arr[i])) dups.add(arr[i]);
        return dups.stream().mapToInt(x->x).toArray();
    }
    public String reverse(String s) {
        String r = "";
        for (int i = s.length()-1; i >= 0; i--) r += s.charAt(i);
        return r;
    }
}`
};

function parse(text) {
  const fence = text.match(/` + "```" + `(?:json)?\n?([\s\S]*?)\n?` + "```" + `/);
  if (fence) { try { return JSON.parse(fence[1]); } catch {} }
  const s = text.indexOf("{"), e = text.lastIndexOf("}");
  if (s !== -1 && e > s) { try { return JSON.parse(text.slice(s, e + 1)); } catch {} }
  try { return JSON.parse(text.trim()); } catch {}
  return null;
}

const SYS = "You are an expert code reviewer for students. Respond with ONLY a raw valid JSON object. No markdown, no code fences, no explanation. Start with { and end with }. Schema: {overall_score: int 0-100, summary: string, metrics: {efficiency: int, readability: int, best_practices: int, security: int}, findings: [{type: error|warning|info|success, title: string, line: string, description: string, fix: string}], complexity: [{function: string, current: string (use O(n^2) not unicode), optimized: string or null, note: string}], tags: [string]}. Include 4-8 findings. Be educational and specific for students.";

export default function App() {
  const [code, setCode] = useState(SAMPLES.python);
  const [lang, setLang] = useState("python");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("findings");
  const [err, setErr] = useState("");
  const [loadMsg, setLoadMsg] = useState("");

  const msgs = ["Parsing abstract syntax tree...", "Detecting complexity...", "Scanning for anti-patterns...", "Checking memory management...", "Generating optimizations..."];

  async function analyze() {
  if (!code.trim()) return;
  setLoading(true); setResult(null); setErr("");
  let idx = 0; setLoadMsg(msgs[0]);
  const iv = setInterval(() => { idx = (idx + 1) % msgs.length; setLoadMsg(msgs[idx]); }, 1300);

  try {
    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // FIX 1: Send the body your backend actually expects
      body: JSON.stringify({ code, lang, repoUrl }) 
    });

    const data = await res.json();

    if (res.ok) {
      // FIX 2: Your backend already parsed the JSON, just use it!
      setResult(data); 
      setTab("findings");
    } else {
      // Handle backend validation errors (like "Code too large")
      setErr(data.error || "Analysis failed");
    }
  } catch (e) {
    setErr("Request failed: " + e.message);
  } finally {
    clearInterval(iv); setLoading(false);
  }
}
  function changeLang(l) { setLang(l); setCode(SAMPLES[l] || ""); setResult(null); setErr(""); }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="hdr">
          <div className="hdr-logo">⚡</div>
          <div>
            <h1>Code<em>Lens</em></h1>
            <div className="hdr-sub">AI-powered code review for students</div>
          </div>
        </div>

        <div className="panel">
          <div className="row">
            <input className="inp" placeholder="GitHub repo URL (optional)" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} />
            <select className="sel" value={lang} onChange={e => changeLang(e.target.value)}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
            <button className="btn" onClick={analyze} disabled={loading || !code.trim()}>
              {loading
                ? <><div style={{ width: 14, height: 14, border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .6s linear infinite" }} /> Analyzing</>
                : "⚡ Analyze Code"}
            </button>
          </div>
          <label className="lbl">paste your code</label>
          <textarea className="code-ta" value={code} onChange={e => setCode(e.target.value)} placeholder="Paste your code here..." rows={10} />
          {err && <div className="err">{err}</div>}
        </div>

        {loading && (
          <div className="loading">
            <div className="spin" />
            <div>{loadMsg}</div>
            <div className="loading-bar"><div className="loading-bar-fill" /></div>
          </div>
        )}

        {!loading && !result && (
          <div className="empty">
            <span className="empty-icon">🔍</span>
            Paste code above and click Analyze<br />to get AI feedback with visual charts
          </div>
        )}

        {result && !loading && (
          <div className="results">
            {/* Score hero */}
            <div className="score-hero">
              <ScoreRing score={result.overall_score} />
              <div className="score-info">
                <div className="score-grade" style={{ color: scoreColor(result.overall_score) }}>
                  {scoreGrade(result.overall_score)}
                </div>
                <div className="score-summary">{result.summary}</div>
                <div className="tag-list">
                  {(result.tags || []).map((t, i) => <span className="tag" key={i}>#{t}</span>)}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="charts-row">
              <div className="chart-card">
                <div className="chart-title">📡 <em>Metrics</em> Radar</div>
                <MetricsRadar metrics={result.metrics || {}} />
              </div>
              <div className="chart-card">
                <div className="chart-title">📊 <em>Metrics</em> Breakdown</div>
                <MetricsBar metrics={result.metrics || {}} />
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="tabs">
                {[
                  { id: "findings", label: "🔎 Findings (" + (result.findings?.length || 0) + ")" },
                  { id: "complexity", label: "⏱ Complexity" }
                ].map(t => (
                  <button key={t.id} className={"tab" + (tab === t.id ? " active" : "")} onClick={() => setTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "findings" && (
                <div className="findings-grid">
                  {(result.findings || []).map((f, i) => (
                    <div className={"finding " + f.type} key={i} style={{ animationDelay: i * 55 + "ms" }}>
                      <div className="finding-hdr">
                        <span className="badge">{f.type}</span>
                        <span className="finding-title">{f.title}</span>
                        {f.line && f.line !== "general" && <span className="finding-line">line {f.line}</span>}
                      </div>
                      <div className="finding-desc">{f.description}</div>
                      {f.fix && (
                        <div className="fix-box">
                          <div className="fix-label">→ Suggested fix</div>
                          <code>{f.fix}</code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === "complexity" && (
                <div className="complexity-card">
                  <div className="chart-title">⏱ <em>Algorithmic</em> Complexity Analysis</div>
                  <div className="legend">
                    <div className="legend-item"><span className="legend-dot" style={{ background: "#ff6b6b" }} /> Current complexity</div>
                    <div className="legend-item"><span className="legend-dot" style={{ background: "#00ffb3", opacity: 0.6 }} /> After optimization</div>
                  </div>
                  <div className="cx-list">
                    {(result.complexity || []).map((c, i) => <ComplexityItem key={i} c={c} />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
