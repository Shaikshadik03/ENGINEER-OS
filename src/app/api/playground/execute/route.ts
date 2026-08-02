import { NextRequest, NextResponse } from 'next/server'

const GLOT_LANG_MAP: Record<string, { lang: string; filename: string }> = {
  python: { lang: 'python', filename: 'main.py' },
  c: { lang: 'c', filename: 'main.c' },
  cpp: { lang: 'cpp', filename: 'main.cpp' },
  java: { lang: 'java', filename: 'Main.java' },
  javascript: { lang: 'javascript', filename: 'main.js' },
  sql: { lang: 'sqlite3', filename: 'main.sql' },
}

export async function POST(request: NextRequest) {
  try {
    const { language, code, stdin } = await request.json()

    if (!code || !language) {
      return NextResponse.json({ error: 'Language and code are required' }, { status: 400 })
    }

    const mapping = GLOT_LANG_MAP[language] || { lang: 'python', filename: 'main.py' }

    // 1. Try Glot.io API (High availability, fast)
    try {
      const glotRes = await fetch(`https://glot.io/api/run/${mapping.lang}/latest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stdin: stdin || '',
          files: [{ name: mapping.filename, content: code }]
        }),
      })

      if (glotRes.ok) {
        const data = await glotRes.json()
        return NextResponse.json({
          stdout: data.stdout || '',
          stderr: data.stderr || data.error || '',
          engine: 'Glot.io Engine'
        })
      }
    } catch (err) {
      console.log('Glot.io failed, attempting Wandbox fallback...')
    }

    // 2. Fallback to Wandbox API
    const wandboxCompilers: Record<string, string> = {
      python: 'cpython-head',
      c: 'gcc-head-c',
      cpp: 'gcc-head',
      java: 'openjdk-head',
      javascript: 'nodejs-head',
      sql: 'sqlite-head'
    }

    const wandRes = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: wandboxCompilers[language] || 'cpython-head',
        code: code,
        stdin: stdin || ''
      }),
    })

    if (wandRes.ok) {
      const wData = await wandRes.json()
      const stdout = wData.program_output || wData.compiler_output || ''
      const stderr = wData.program_error || wData.compiler_error || ''
      return NextResponse.json({ stdout, stderr, engine: 'Wandbox Engine' })
    }

    return NextResponse.json({ error: 'Execution engines temporarily busy. Please try again.' }, { status: 503 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
