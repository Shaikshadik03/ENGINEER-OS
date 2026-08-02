'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, RotateCcw, Download, ChevronDown, Terminal, Code2, Loader2 } from 'lucide-react'

const LANGUAGES = [
  { id: 'python', label: 'Python', version: '3.10.0', icon: '🐍', pistonLang: 'python', defaultCode: 'print("Hello from Engineer OS!")\n\nfor i in range(1, 6):\n    print(f"Number: {i}")' },
  { id: 'c', label: 'C', version: '10.2.0', icon: '©️', pistonLang: 'c', defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello from Engineer OS!\\n");\n    for (int i = 1; i <= 5; i++) {\n        printf("Number: %d\\n", i);\n    }\n    return 0;\n}' },
  { id: 'cpp', label: 'C++', version: '10.2.0', icon: '⚡', pistonLang: 'cpp', defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from Engineer OS!" << endl;\n    for (int i = 1; i <= 5; i++) {\n        cout << "Number: " << i << endl;\n    }\n    return 0;\n}' },
  { id: 'java', label: 'Java', version: '15.0.2', icon: '☕', pistonLang: 'java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Engineer OS!");\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Number: " + i);\n        }\n    }\n}' },
  { id: 'javascript', label: 'JavaScript', version: '18.15.0', icon: '🟡', pistonLang: 'javascript', defaultCode: 'console.log("Hello from Engineer OS!");\n\nfor (let i = 1; i <= 5; i++) {\n    console.log(`Number: ${i}`);\n}' },
  { id: 'sql', label: 'SQL', version: '3.36.0', icon: '🗄️', pistonLang: 'sqlite3', defaultCode: '-- SQL Practice Playground\nCREATE TABLE students (id INTEGER, name TEXT, gpa REAL);\nINSERT INTO students VALUES (1, "Shadik", 9.2);\nINSERT INTO students VALUES (2, "Ravi", 8.5);\nINSERT INTO students VALUES (3, "Priya", 9.0);\n\nSELECT * FROM students ORDER BY gpa DESC;' },
]

interface OutputLine {
  type: 'stdout' | 'stderr' | 'info'
  text: string
}

export default function PlaygroundPage() {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0])
  const [code, setCode] = useState(LANGUAGES[0].defaultCode)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<OutputLine[]>([])
  const [running, setRunning] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Sync scrollbar
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

  const handleRun = async () => {
    if (!code.trim() || running) return
    setRunning(true)
    setOutput([{ type: 'info', text: `▶ Running ${selectedLang.label}...` }])

    try {
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: selectedLang.pistonLang,
          version: '*',
          files: [{ name: selectedLang.id === 'java' ? 'Main.java' : `main.${selectedLang.id}`, content: code }],
          stdin: input,
        }),
      })

      const data = await res.json()
      const lines: OutputLine[] = []

      if (data.message) {
        lines.push({ type: 'stderr', text: `Runner Notice: ${data.message}` })
      }

      if (data.run?.output) {
        data.run.output.split('\n').forEach((line: string) => {
          if (line !== '') lines.push({ type: 'stdout', text: line })
        })
      } else if (data.run?.stdout) {
        data.run.stdout.split('\n').forEach((line: string) => {
          if (line !== '') lines.push({ type: 'stdout', text: line })
        })
      }

      if (data.run?.stderr) {
        data.run.stderr.split('\n').forEach((line: string) => {
          if (line !== '') lines.push({ type: 'stderr', text: line })
        })
      }
      if (data.compile?.stderr) {
        data.compile.stderr.split('\n').forEach((line: string) => {
          if (line !== '') lines.push({ type: 'stderr', text: line })
        })
      }

      if (lines.length === 0) lines.push({ type: 'info', text: '✓ Program finished.' })
      lines.push({ type: 'info', text: `\n✓ Done in ${data.run?.cpu_time || 0}ms` })
      setOutput(lines)
    } catch (e: any) {
      setOutput([{ type: 'stderr', text: 'Error: Could not connect to code runner. Check internet connection.' }])
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

  // Tab key support
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

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] pb-4 animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 size={20} className="text-indigo-400" />
            <h1 className="text-base font-bold text-white">Code Playground</h1>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold">LIVE</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-indigo-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white transition-all"
            >
              <span>{selectedLang.icon}</span>
              <span>{selectedLang.label}</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>
            {showLangMenu && (
              <div className="absolute top-full mt-1 left-0 bg-[#111118] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden min-w-[160px]">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => selectLanguage(lang)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors text-left ${selectedLang.id === lang.id ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-300'}`}
                  >
                    <span>{lang.icon}</span> {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all">
            <RotateCcw size={13} /> Reset
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all">
            <Download size={13} /> Export
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? 'Running...' : 'Run'} <span className="opacity-60 text-[10px]">Ctrl+Enter</span>
          </button>
        </div>
      </div>

      {/* Editor + Output Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden min-h-0">
        {/* CODE EDITOR */}
        <div className="flex flex-col bg-[#0d0d12] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 bg-[#111118]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-[11px] text-gray-500 font-mono ml-2">
              {selectedLang.id === 'java' ? 'Main.java' : `main.${selectedLang.id}`}
            </span>
          </div>
          <div className="flex-1 relative overflow-hidden">
            {/* Line Numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#0d0d12] border-r border-white/5 flex flex-col pt-3 overflow-hidden pointer-events-none z-10">
              {code.split('\n').map((_, i) => (
                <div key={i} className="text-[11px] text-gray-600 text-right pr-2 leading-6 font-mono">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="absolute inset-0 pl-12 pr-4 pt-3 pb-4 bg-transparent text-xs text-gray-200 font-mono leading-6 resize-none focus:outline-none w-full h-full"
              style={{ tabSize: 4 }}
            />
          </div>
        </div>

        {/* OUTPUT + INPUT */}
        <div className="flex flex-col gap-3 overflow-hidden min-h-0">
          {/* stdin input */}
          <div className="bg-[#111118] border border-white/10 rounded-xl p-3 shrink-0">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Standard Input (stdin)</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={2}
              placeholder="Enter input here if your program reads from stdin..."
              className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono resize-none focus:outline-none"
            />
          </div>

          {/* Output */}
          <div className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 bg-[#111118] shrink-0">
              <Terminal size={14} className="text-emerald-400" />
              <span className="text-[11px] text-gray-400 font-mono font-bold">Output</span>
            </div>
            <div ref={outputRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-6">
              {output.length === 0 ? (
                <p className="text-gray-600">Click <span className="text-emerald-400 font-bold">Run</span> to execute your code...</p>
              ) : (
                output.map((line, i) => (
                  <div key={i} className={`${line.type === 'stderr' ? 'text-red-400' : line.type === 'info' ? 'text-gray-500' : 'text-emerald-300'} whitespace-pre-wrap`}>
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
