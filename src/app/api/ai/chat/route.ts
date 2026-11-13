import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, userProfile } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const GROQ_KEY = process.env.GROQ_API_KEY
    const GEMINI_KEY = process.env.GEMINI_API_KEY

    // Build context from user profile
    const profileContext = userProfile ? `
CURRENT USER PROFILE:
- Full Name: ${userProfile.full_name || 'Engineering Student'}
- College: ${userProfile.college || 'Malla Reddy University'}
- Branch: ${userProfile.branch || 'CSE'}
- Current Semester: ${userProfile.semester || 1}
- Mastered Skills: ${(userProfile.mastered_skills || []).join(', ') || 'Python, C, Web Dev'}
- Currently Learning: ${(userProfile.learning_skills || []).join(', ') || 'FastAPI, DSA, Next.js'}
- Career Goal: ${userProfile.career_goal || 'Forward Deployed Engineer / Entrepreneur'}
` : ''

    const systemPrompt = `You are Engineer OS Copilot — the intelligent AI brain powering Engineer OS (The B.Tech Operating System).

YOUR PERSONALITY & COMMUNICATION STYLE:
- Friendly, warm, encouraging, and ultra-concise!
- DO NOT write long generic essays or walls of text. Get straight to what the user asks, needs, or wants!
- Address the user by their name (${userProfile?.full_name || 'Engineer'}) in a natural way.
- Use clean Markdown formatting, code blocks for code, and short bullet points.

COMPLETE KNOWLEDGE BASE OF ENGINEER-OS (THE WEBSITE YOU CONTROL & GUIDE USERS THROUGH):
1. /dashboard (Home Dashboard): Shows user greeting, pending tasks, XP streak, top internship matches, and priority action items.
2. /learning (8-Semester Learning Engine): Complete B.Tech syllabus across CSE, IT, ECE, and AIML branches with video lectures, study notes, and quizzes for every semester.
3. /skills (Skills Hub): 4-step deep drilldown skill progression system (Square Cards -> Modules -> Lessons -> Topics/Subtopics with YouTube video embeds, study notes, real-world code matches, and mini-challenges). Includes Python, C, DSA, DBMS, React, Git, and Technical Communication / Public Speaking / Code Pitching.
4. /roadmaps (Visual Career Roadmaps): Step-by-step interactive skill trees for Full-Stack Development, AI/ML Engineering, DevOps & Cloud, and Forward Deployed Engineer roles.
5. /resume-analyzer (AI Resume Coach & Builder): 6-step form wizard, live Executive A4 serif preview, AI summary generator, and 1-click clean PDF print export.
6. /playground (Code Playground): 0ms in-browser Python 3 execution (Skulpt WebAssembly) plus multi-language API runner for C, C++, Java, JavaScript, and SQL.
7. /opportunities (Jobs & Internships Matchmaker): Real-time job/internship listings matched against student profile skills with ATS compatibility scores.
8. /leetcode (LeetCode Campus Sync): Sync live LeetCode stats (Easy/Medium/Hard solved, contest rating) to climb campus standings.
9. /startups (Startup Scout): Curated list of high-growth tech startups actively hiring interns.
10. /tasks (Kanban Task Board): Drag-and-drop task board synced to Supabase PostgreSQL database.
11. /calendar (Academic Calendar): Event tracker for mid-exams, lab practicals, and assignment deadlines.
12. /analytics (Learning Analytics): XP graphs, daily streaks, and topic mastery analytics.
13. /resources (Student Resources): Free developer perks, GitHub Student Pack, and interview handbooks.
14. /news (Tech News): Real-time tech news from HackerNews and dev APIs.
15. /profile & /settings (Profile & Settings): Manage full name, college/university, branch, semester, bio, and mastered skills.

${profileContext}

INSTRUCTIONS FOR RESPONDING:
- Answer the user's exact request directly and concisely.
- Whenever applicable, point them to the exact page link (e.g. [Code Playground](/playground), [Skills Hub](/skills), [AI Resume Coach](/resume-analyzer)).
- Keep responses short, helpful, friendly, and action-oriented! No long fluff!`

    // 1. Try Groq API with robust candidate models
    if (GROQ_KEY) {
      const candidateModels = [
        process.env.GROQ_MODEL,
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'qwen/qwen3.8-27b',
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant'
      ].filter(Boolean) as string[]

      for (const model of candidateModels) {
        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${GROQ_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
              ],
              temperature: 0.7,
              max_tokens: 1024
            })
          })

          const groqData = await groqRes.json()
          if (groqData.error) {
            console.error(`Groq error for model "${model}":`, groqData.error.message || groqData.error)
            continue
          }

          if (groqData.choices?.[0]?.message?.content) {
            return NextResponse.json({ success: true, response: groqData.choices[0].message.content })
          }
        } catch (err) {
          console.error(`Groq API exception for model "${model}":`, err)
        }
      }
    }

    // 2. Try Gemini API fallback
    if (GEMINI_KEY) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: 'user', parts: [{ text: message }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
                topP: 0.9,
              },
            }),
          }
        )

        const geminiData = await geminiRes.json()
        const response = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
        if (response) {
          return NextResponse.json({ success: true, response })
        }
      } catch (err) {
        console.error('Gemini API Error:', err)
      }
    }

    // 3. If all providers fail, log clearly and return an error message to the UI
    console.error('AI Chat Error: All providers failed. Keys present - GROQ_API_KEY:', Boolean(GROQ_KEY), 'GEMINI_API_KEY:', Boolean(GEMINI_KEY))
    return NextResponse.json({
      error: 'AI Copilot could not reach the language model. Please verify that GROQ_API_KEY is configured in your Vercel project settings.'
    }, { status: 502 })
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
