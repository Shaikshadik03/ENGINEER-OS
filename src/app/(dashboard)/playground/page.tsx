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
  const langMenuRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
    : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'

  return (
    <div className={`flex flex-col h-[calc(100vh-5.5rem)] pb-2 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Top Bar - Relative with z-30 ensures dropdown floats above all editors */}
      <div className={`relative z-30 flex flex-wrap items-center justify-between mb-4 gap-3 ${cardStyle} rounded-xl p-3 sm:p-4 border`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-zinc-800 border-zinc-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
              <Code2 size={18} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight leading-none">Code Playground</h1>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">Multi-Language Execution Engine</span>
            </div>
            <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded font-medium items-center gap-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
              <Sparkles size={11} /> Zero Latency
            </span>
          </div>

          {/* Language Selector Dropdown with Click-Outside Guard */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                isDark 
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-zinc-600' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300'
              }`}
            >
              <span>{selectedLang.icon}</span>
              <span>{selectedLang.label}</span>
              <ChevronDown size={13} className="text-zinc-400" />
            </button>
            {showLangMenu && (
              <div className={`absolute top-full mt-1.5 left-0 border rounded-lg shadow-xl z-50 overflow-hidden min-w-[160px] p-1 space-y-0.5 ${
                isDark ? 'bg-zinc-900 border-zinc-800 shadow-black/60' : 'bg-white border-zinc-200 shadow-zinc-200'
              }`}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => selectLanguage(lang)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                      selectedLang.id === lang.id
                        ? isDark ? 'text-blue-400 bg-blue-950/40 font-semibold' : 'text-blue-600 bg-blue-50 font-semibold'
                        : isDark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100'
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
            className={`flex items-center gap-1.5 border text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={handleExport}
            className={`flex items-center gap-1.5 border text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs px-4 py-1.5 rounded-lg transition-colors"
          >
            {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} className="fill-white" />}
            {running ? 'Running...' : 'Run'} <span className="opacity-75 text-[10px] font-mono hidden sm:inline">Ctrl+Enter</span>
          </button>
        </div>
      </div>

      {/* Editor + Output Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden min-h-0">
        
        {/* CODE EDITOR */}
        <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/90">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-300 font-mono font-medium">
                {selectedLang.id === 'java' ? 'Main.java' : `main.${selectedLang.id}`}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono font-medium uppercase">{selectedLang.version}</span>
          </div>
          
          <div className="flex-1 relative overflow-hidden bg-zinc-950">
            {/* Line Numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-11 bg-zinc-950 border-r border-zinc-800 flex flex-col pt-3 overflow-hidden pointer-events-none z-10 select-none">
              {code.split('\n').map((_, i) => (
                <div key={i} className="text-[11px] text-zinc-600 text-right pr-3 leading-6 font-mono">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="absolute inset-0 pl-14 pr-4 pt-3 pb-4 bg-transparent text-xs text-zinc-100 font-mono leading-6 resize-none focus:outline-none w-full h-full"
              style={{ tabSize: 4 }}
            />
          </div>
        </div>

        {/* OUTPUT + INPUT */}
        <div className="flex flex-col gap-4 overflow-hidden min-h-0">
          
          {/* stdin input */}
          <div className={`${cardStyle} rounded-xl p-3.5 shrink-0 border space-y-1.5`}>
            <label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block">Standard Input (stdin)</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={2}
              placeholder="Enter input here if your program reads from stdin..."
              className={`w-full rounded-lg px-3 py-1.5 text-xs font-mono resize-none focus:outline-none focus:border-blue-500 border ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>

          {/* Output Console */}
          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col min-h-0 shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/90 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-blue-400" />
                <span className="text-xs text-zinc-300 font-mono font-medium">Output Console</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">UTF-8</span>
            </div>

            <div ref={outputRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-6 bg-zinc-950">
              {output.length === 0 ? (
                <p className="text-zinc-500">Click <span className="text-blue-400 font-medium">Run</span> to execute your code...</p>
              ) : (
                output.map((line, i) => (
                  <div key={i} className={`${line.type === 'stderr' ? 'text-rose-400' : line.type === 'info' ? 'text-zinc-500' : 'text-emerald-400'} whitespace-pre-wrap`}>
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
