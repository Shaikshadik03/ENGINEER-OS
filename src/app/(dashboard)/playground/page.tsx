'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/components/ThemeProvider'
import { Play, RotateCcw, Download, ChevronDown, Terminal, Code2, Loader2, Sparkles } from 'lucide-react'

const LANGUAGES = [
  {
    id: 'python',
    label: 'Python',
    version: 'Python 3.10',
    icon: '🐍',
    defaultCode: 'print("Hello from Engineer OS!")\n\nfor i in range(1, 6):\n    print(f"Number: {i}")'
  },
  {
    id: 'c',
    label: 'C',
    version: 'GCC 11.2',
    icon: '©️',
    defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello from Engineer OS!\\n");\n    for (int i = 1; i <= 5; i++) {\n        printf("Number: %d\\n", i);\n    }\n    return 0;\n}'
  },
  {
    id: 'cpp',
    label: 'C++',
    version: 'G++ 11.2',
    icon: '⚡',
    defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from Engineer OS!" << endl;\n    for (int i = 1; i <= 5; i++) {\n        cout << "Number: " << i << endl;\n    }\n    return 0;\n}'
  },
  {
    id: 'java',
    label: 'Java',
    version: 'OpenJDK 17',
    icon: '☕',
    defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Engineer OS!");\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Number: " + i);\n        }\n    }\n}'
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    version: 'Node.js 18',
    icon: '🟡',
    defaultCode: 'console.log("Hello from Engineer OS!");\n\nfor (let i = 1; i <= 5; i++) {\n    console.log(`Number: ${i}`);\n}'
  },
  {
    id: 'sql',
    label: 'SQL',
    version: 'SQLite 3.36',
    icon: '🗄️',
    defaultCode: '-- SQL Practice Playground\nCREATE TABLE students (id INTEGER, name TEXT, gpa REAL);\nINSERT INTO students VALUES (1, "Shadik", 9.2);\nINSERT INTO students VALUES (2, "Ravi", 8.5);\nINSERT INTO students VALUES (3, "Priya", 9.0);\n\nSELECT * FROM students ORDER BY gpa DESC;'
  },
]

interface OutputLine {
  type: 'stdout' | 'stderr' | 'info'
  text: string
}

export default function PlaygroundPage() {
  const { isDark } = useTheme()
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0])
  const [code, setCode] = useState(LANGUAGES[0].defaultCode)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<OutputLine[]>([])
  const [running, setRunning] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const selectLanguage = (lang: typeof LANGUAGES[0]) => {
    setSelectedLang(lang)
    setCode(lang.defaultCode)
    setOutput([])
    setShowLangMenu(false)
  }

  // Load Skulpt dynamically for Python
  const loadSkulpt = (): Promise<any> => {
    return new Promise((resolve) => {
      if ((window as any).Sk) return resolve((window as any).Sk)
      const s1 = document.createElement('script')
      s1.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js'
      s1.onload = () => {
        const s2 = document.createElement('script')
        s2.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js'
        s2.onload = () => resolve((window as any).Sk)
        document.body.appendChild(s2)
      }
      document.body.appendChild(s1)
    })
  }

  // --- PYTHON IN-BROWSER ENGINE ---
  const runPythonLocally = async (pyCode: string) => {
    const logs: OutputLine[] = []
    try {
      const Sk = await loadSkulpt()
      let stdoutAcc = ''
      Sk.configure({
        output: (text: string) => { stdoutAcc += text },
        read: (x: string) => {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
            throw new Error("File not found: '" + x + "'")
          }
          return Sk.builtinFiles["files"][x]
        }
      })

      await Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody("<stdin>", false, pyCode, true)
      )

      if (stdoutAcc) {
        stdoutAcc.split('\n').forEach(line => {
          if (line !== '') logs.push({ type: 'stdout', text: line })
        })
      }
    } catch (err: any) {
      logs.push({ type: 'stderr', text: err.toString() })
    }
    return logs
  }

  // --- JAVASCRIPT IN-BROWSER ENGINE ---
  const runJavaScriptLocally = (jsCode: string) => {
    const logs: OutputLine[] = []
    const originalLog = console.log
    const originalError = console.error

    console.log = (...args: any[]) => {
      logs.push({ type: 'stdout', text: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ') })
    }
    console.error = (...args: any[]) => {
      logs.push({ type: 'stderr', text: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ') })
    }

    try {
      const fn = new Function(jsCode)
      fn()
    } catch (err: any) {
      logs.push({ type: 'stderr', text: `Error: ${err.message}` })
    } fontFinally: {
      console.log = originalLog
      console.error = originalError
    }

    return logs
  }

  // --- SERVER-SIDE RUNNER (C, C++, Java, SQL) ---
  const handleRun = async () => {
    setRunning(true)
    setOutput([])
    const startTime = performance.now()

    if (selectedLang.id === 'python') {
      const logs = await runPythonLocally(code)
      const elapsed = Math.round(performance.now() - startTime)
      if (logs.length === 0) logs.push({ type: 'info', text: '✓ Program finished with no output.' })
      logs.push({ type: 'info', text: `✓ Executed locally in ${elapsed}ms (Browser Python Engine)` })
      setOutput(logs)
      setRunning(false)
      return
    }

    if (selectedLang.id === 'javascript') {
      const logs = runJavaScriptLocally(code)
      const elapsed = Math.round(performance.now() - startTime)
      if (logs.length === 0) logs.push({ type: 'info', text: '✓ Program finished with no output.' })
      logs.push({ type: 'info', text: `✓ Executed locally in ${elapsed}ms (Browser V8 Engine)` })
      setOutput(logs)
      setRunning(false)
      return
    }

    try {
      const res = await fetch('/api/playground/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: selectedLang.id,
          code,
          input,
        }),
      })

      const data = await res.json()
      const lines: OutputLine[] = []

      if (data.stdout) {
        data.stdout.split('\n').forEach((line: string) => {
          if (line !== '') lines.push({ type: 'stdout', text: line })
        })
      }
      if (data.stderr) {
        data.stderr.split('\n').forEach((line: string) => {
          if (line !== '') lines.push({ type: 'stderr', text: line })
        })
      }

      if (lines.length === 0) lines.push({ type: 'info', text: '✓ Program finished with no output.' })
      const elapsed = Math.round(performance.now() - startTime)
      lines.push({ type: 'info', text: `✓ Executed in ${elapsed}ms` })
      setOutput(lines)
    } catch (e: any) {
      setOutput([{ type: 'stderr', text: 'Error executing code. Check syntax or internet connection.' }])
    }
    setRunning(false)
  }

  const handleReset = () => {
    setCode(selectedLang.defaultCode)
    setOutput([])
    setInput('')
  }

  const handleExport = () => {
    const ext = selectedLang.id === 'cpp' ? 'cpp' : selectedLang.id === 'java' ? 'java' : selectedLang.id
    const blob = new Blob([code], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `code.${ext}`
    a.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = textareaRef.current!
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4 }, 0)
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleRun()
    }
  }

  const cardStyle = isDark
    ? 'bg-[#111118]/80 border-white/10 text-white backdrop-blur-xl'
    : 'bg-white/90 border-slate-200/80 text-slate-900 shadow-sm backdrop-blur-xl'

  return (
    <div className={`flex flex-col h-[calc(100vh-5rem)] pb-4 animate-in fade-in duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Top Bar */}
      <div className={`flex items-center justify-between mb-4 gap-3 ${cardStyle} rounded-3xl p-4 border`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-2xl border ${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200'}`}>
              <Code2 size={20} />
            </div>
            <div>
              <h1 className={`text-lg font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Code Playground</h1>
              <span className={`text-[10px] font-extrabold tracking-wide uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Multi-Language Live Execution Engine</span>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 border ${
              isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
            }`}>
              <Sparkles size={11} /> ZERO-LATENCY ENGINE
            </span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-extrabold transition-all border ${
                isDark ? 'bg-[#0d0d12] border-white/10 text-white hover:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-sky-500'
              }`}
            >
              <span>{selectedLang.icon}</span>
              <span>{selectedLang.label}</span>
              <ChevronDown size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            </button>
            {showLangMenu && (
              <div className={`absolute top-full mt-2 left-0 border rounded-2xl shadow-xl z-50 overflow-hidden min-w-[170px] p-1.5 space-y-1 ${
                isDark ? 'bg-[#111118] border-white/10' : 'bg-white border-slate-200'
              }`}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => selectLanguage(lang)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors text-left ${
                      selectedLang.id === lang.id
                        ? isDark ? 'text-sky-400 bg-sky-500/10 font-black' : 'text-sky-700 bg-sky-50 font-black'
                        : isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{lang.icon}</span> {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 border text-xs font-extrabold px-3.5 py-2.5 rounded-2xl transition-all ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={handleExport}
            className={`flex items-center gap-1.5 border text-xs font-extrabold px-3.5 py-2.5 rounded-2xl transition-all ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-black text-xs px-5 py-2.5 rounded-2xl transition-all shadow-md"
          >
            {running ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} className="fill-white" />}
            {running ? 'Running...' : 'Run'} <span className="opacity-70 text-[10px] font-mono">Ctrl+Enter</span>
          </button>
        </div>
      </div>

      {/* Editor + Output Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden min-h-0">
        
        {/* CODE EDITOR */}
        <div className="flex flex-col bg-[#0d1117] border border-slate-800 rounded-3xl overflow-hidden shadow-md">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#161b22]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-400 font-mono font-bold ml-2">
                {selectedLang.id === 'java' ? 'Main.java' : `main.${selectedLang.id}`}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">{selectedLang.version}</span>
          </div>
          
          <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
            {/* Line Numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-11 bg-[#0d1117] border-r border-slate-800 flex flex-col pt-3 overflow-hidden pointer-events-none z-10 select-none">
              {code.split('\n').map((_, i) => (
                <div key={i} className="text-[11px] text-slate-600 text-right pr-3 leading-6 font-mono">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="absolute inset-0 pl-14 pr-4 pt-3 pb-4 bg-transparent text-xs text-slate-100 font-mono leading-6 resize-none focus:outline-none w-full h-full"
              style={{ tabSize: 4 }}
            />
          </div>
        </div>

        {/* OUTPUT + INPUT */}
        <div className="flex flex-col gap-4 overflow-hidden min-h-0">
          
          {/* stdin input */}
          <div className={`${cardStyle} rounded-3xl p-4 shrink-0 border space-y-1.5`}>
            <label className={`text-[10px] font-black uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Standard Input (stdin)</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={2}
              placeholder="Enter input here if your program reads from stdin..."
              className={`w-full rounded-2xl px-3.5 py-2 text-xs font-mono resize-none focus:outline-none focus:border-sky-500 border ${
                isDark ? 'bg-[#0d0d12] border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Output Console */}
          <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden flex flex-col min-h-0 shadow-md">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#1e293b] shrink-0">
              <div className="flex items-center gap-2">
                <Terminal size={15} className="text-emerald-400" />
                <span className="text-xs text-slate-200 font-mono font-bold">Execution Output Console</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Terminal UTF-8</span>
            </div>

            <div ref={outputRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-6 bg-[#0f172a]">
              {output.length === 0 ? (
                <p className="text-slate-500">Click <span className="text-emerald-400 font-bold">Run</span> to execute your code...</p>
              ) : (
                output.map((line, i) => (
                  <div key={i} className={`${line.type === 'stderr' ? 'text-rose-400 font-semibold' : line.type === 'info' ? 'text-slate-400' : 'text-emerald-400 font-medium'} whitespace-pre-wrap`}>
                    {line.text}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
