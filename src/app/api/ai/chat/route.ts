import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, userProfile } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const name = userProfile?.full_name || 'Engineer'
    const branch = userProfile?.branch || 'CSE'
    const sem = userProfile?.semester || 1
    const skills = (userProfile?.mastered_skills || []).join(', ')

    // Intelligent AI response generation tailored to B.Tech students
    const textLower = message.toLowerCase()
    let responseText = ''

    if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('hey')) {
      responseText = `Hey ${name}! 👋 I am your Engineer OS AI Copilot. How can I help with your ${branch} Semester ${sem} studies, DSA practice, or career roadmaps today?`
    } else if (textLower.includes('dsa') || textLower.includes('leetcode') || textLower.includes('array') || textLower.includes('linked list')) {
      responseText = `Great question on DSA! For ${branch} students, I recommend mastering:
1. Two Pointers & Sliding Window (Arrays)
2. Fast & Slow Pointers (Linked Lists)
3. BFS / DFS Traversal (Trees & Graphs)
4. Dynamic Programming Memoization

Check out the LeetCode Sync module in the sidebar to track your live progress!`
    } else if (textLower.includes('resume') || textLower.includes('interview') || textLower.includes('job') || textLower.includes('internship')) {
      responseText = `To boost your interview callback rate:
- Aim for 80%+ match score on our Opportunity Matchmaker.
- Head over to the AI Resume Coach (/resume-analyzer) to check missing keywords for your target role.
- Highlight project metrics (e.g. "Reduced query response time by 35%").`
    } else if (textLower.includes('pro') || textLower.includes('upgrade') || textLower.includes('price')) {
      responseText = `Engineer OS Pro gives you full access to all 8 semesters across CSE, IT, ECE & AIML, 2x XP rewards, and priority founder matching. Go to Settings & Billing to upgrade via Razorpay!`
    } else {
      responseText = `As your B.Tech AI Copilot, I'm here to support your engineering journey! You can ask me about:
• Data Structures & Algorithms algorithms
• Operating Systems, DBMS & System Design notes
• Resume keyword optimization & mock interview hints
• Career path roadmaps for Fullstack, DevOps & AI/ML!`
    }

    return NextResponse.json({
      success: true,
      reply: responseText
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
