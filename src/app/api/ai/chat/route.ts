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
- /skills → Multi-tier skill trees & video lectures
- /playground → Live code editor (Python, C, C++, Java, JavaScript, SQL)
- /roadmaps → Career roadmaps (Full Stack, DSA, ML, Cloud)
- /resume-analyzer → AI Resume review & A4 Preview
- /opportunities → Real job & internship listings matched to skills
- /tasks → Kanban task board
- /calendar → Academic event calendar
- /analytics → XP, streaks, and learning analytics
- /profile → Update skills, interests, and career goals

Your personality:
- Smart, concise, encouraging, and highly technical
- Use code blocks when showing code
- Use bullet points for lists
- Reference the user by name when possible
- For coding questions, always provide working code examples
- For career questions, give practical, India-specific advice
- For DSA, explain with examples and complexity analysis
- Keep responses clean and well-structured

Respond in markdown format.`

    // 1. Try Groq API (Ultra-Fast Llama 3.3 70B Versatile)
    if (GROQ_KEY) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 1024
          })
        })

        const groqData = await groqRes.json()
        if (groqData.choices?.[0]?.message?.content) {
          return NextResponse.json({ success: true, response: groqData.choices[0].message.content })
        }
      } catch (err) {
        console.error('Groq API Error, trying fallback:', err)
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

    // 3. Fallback response
    return NextResponse.json({
      success: true,
      response: `Hey ${userProfile?.full_name || 'there'}! 👋 I am your **Engineer OS Copilot**.\n\nI can help you with:\n- 📖 **Academics & DSA**\n- 💻 **Coding in Python, C, C++, Java**\n- 🎯 **Resume & Placement Prep**\n\nWhat would you like to build or learn today?`
    })
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
