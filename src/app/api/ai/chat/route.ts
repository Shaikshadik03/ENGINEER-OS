import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, userProfile } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const GEMINI_KEY = process.env.GEMINI_API_KEY

    // Build context from user profile
    const profileContext = userProfile ? `
User Profile:
- Name: ${userProfile.full_name || 'Engineering Student'}
- Branch: ${userProfile.branch || 'CSE'}
- Semester: ${userProfile.semester || 1}
- Mastered Skills: ${(userProfile.mastered_skills || []).join(', ') || 'None listed yet'}
- Currently Learning: ${(userProfile.learning_skills || []).join(', ') || 'None listed yet'}
- Career Goal: ${userProfile.career_goal || 'Not specified'}
- Interests: ${(userProfile.interests || []).join(', ') || 'Not specified'}
` : ''

    const systemPrompt = `You are Engineer OS Copilot — an intelligent assistant built specifically for B.Tech engineering students in India.

Your role: Help students with their academics, coding, career, and project guidance.

${profileContext}

Platform Features you can guide users about:
- /learning → B.Tech subject lectures & quizzes (all semesters)
- /playground → Live code editor (Python, C, C++, Java, JavaScript, SQL)
- /roadmaps → Career roadmaps (Full Stack, DSA, ML, Cloud)
- /resume-analyzer → AI Resume review
- /opportunities → Real job & internship listings matched to skills
- /tasks → Kanban task board (saves to database)
- /calendar → Academic event calendar (saves to database)
- /analytics → XP, streaks, and learning analytics
- /profile → Update skills, interests, and career goals

Your personality:
- Smart, concise, and encouraging
- Use code blocks when showing code
- Use bullet points for lists
- Reference the user by name when possible
- For coding questions, always provide working code examples
- For career questions, give practical, India-specific advice
- For DSA, explain with examples and complexity analysis
- Keep responses under 400 words unless writing code

Respond in markdown format.`

    if (!GEMINI_KEY) {
      // Smart fallback responses without API key
      const msg = message.toLowerCase()
      let response = ''

      if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        response = `Hey ${userProfile?.full_name?.split(' ')[0] || 'there'}! 👋 I'm your **Engineer OS Copilot**.\n\nI can help you with:\n- 📚 **Academics** — DSA, OS, DBMS, Networks, any subject\n- 💻 **Coding** — Python, C, C++, Java, JavaScript\n- 🎯 **Career** — Resume tips, internships, job prep\n- 🗺️ **Roadmaps** — What to learn next\n\nWhat can I help you with today?`
      } else if (msg.includes('dsa') || msg.includes('array') || msg.includes('linked list') || msg.includes('tree') || msg.includes('graph')) {
        response = `## DSA Practice Tips 🧠\n\nFor **${msg.includes('array') ? 'Arrays' : msg.includes('tree') ? 'Trees' : msg.includes('graph') ? 'Graphs' : 'DSA'}**:\n\n1. **Understand the concept** first — don't memorize code\n2. **Solve easy → medium → hard** on LeetCode\n3. **Common patterns**: Two Pointers, Sliding Window, BFS/DFS\n\nGo to your [Code Playground](/playground) to practice right now!\n\n> 💡 Tip: Add DSA practice as a daily task in your [Task Board](/tasks)`
      } else if (msg.includes('resume') || msg.includes('cv')) {
        response = `## Resume Tips for B.Tech Students 📄\n\nKey sections to include:\n- **Projects** (most important!)\n- **Technical Skills** — match to job description\n- **Education** — CGPA if > 7.5\n- **Internships/Certifications**\n\n**Use the [AI Resume Analyzer](/resume-analyzer)** → it will score your resume and suggest improvements!\n\nFor ${userProfile?.branch || 'CSE'} students: highlight GitHub projects, open source contributions, and coding platforms (LeetCode, CodeChef ratings).`
      } else if (msg.includes('internship') || msg.includes('job') || msg.includes('placement')) {
        response = `## Internship & Placement Guide 🎯\n\nFor ${userProfile?.semester ? `Semester ${userProfile.semester}` : 'B.Tech'} students:\n\n**Best platforms:**\n- **Internshala** — Internships\n- **LinkedIn** — Full-time & internships\n- **AngelList** — Startups\n- **Unstop** — Campus competitions\n\n**Preparation:**\n1. 150+ LeetCode problems (Easy + Medium)\n2. Projects on GitHub\n3. Strong resume\n\nCheck [Opportunities](/opportunities) — it's filtered to YOUR skills!`
      } else if (msg.includes('code') || msg.includes('python') || msg.includes('c++') || msg.includes('java')) {
        response = `## Code Help 💻\n\nI can help you write, debug, and explain code!\n\nTry the **[Code Playground](/playground)** to run code instantly — Python, C, C++, Java, JavaScript, and SQL all work live!\n\n**What specifically do you need?**\n- Write a program?\n- Debug an error?\n- Explain a concept?\n- Data structures?\n\nTell me more and I'll write the code for you! 🚀`
      } else if (msg.includes('subject') || msg.includes('learn') || msg.includes('syllabus')) {
        response = `## B.Tech Learning Path 📚\n\nCurrent Branch: **${userProfile?.branch || 'CSE'}** | Semester: **${userProfile?.semester || 1}**\n\nAll subjects available in [Learning Engine](/learning):\n- Semester 1-2: Programming in C, DSA, Engineering Maths\n- Semester 3-4: DBMS, OS, Computer Networks, OOP\n- Semester 5-6: System Design, ML, Cloud Computing\n- Semester 7-8: Capstone Project, Interview Prep\n\nYour learning progress is tracked with XP and streaks! 🔥`
      } else {
        response = `## Engineer OS Copilot 🤖\n\nI'm here to help with:\n- 📖 **Academic subjects** (DSA, OS, DBMS, Networks...)\n- 💻 **Coding** (write/debug/explain code)\n- 🎯 **Career guidance** (internships, placement prep)\n- 🗺️ **Study roadmaps**\n\nYour profile: **${userProfile?.branch || 'CSE'}** Sem ${userProfile?.semester || 1} | Skills: ${(userProfile?.mastered_skills || []).slice(0, 3).join(', ') || 'Update your profile!'}\n\nAsk me anything! 👇\n\n> 💡 Set your **GEMINI_API_KEY** in Vercel for full AI power!`
      }

      return NextResponse.json({ success: true, response })
    }

    // Real Gemini API call
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
    const response = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'

    return NextResponse.json({ success: true, response })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
