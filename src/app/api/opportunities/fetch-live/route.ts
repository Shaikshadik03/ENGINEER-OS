import { NextResponse } from 'next/server'

// Live Opportunities Aggregator API Handler
// Fetches live tech listings from public tech feeds & RemoteOK API
export async function GET() {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Engineer-OS/1.0 (B.Tech Operating System)'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    let liveListings: any[] = []

    if (response.ok) {
      const data = await response.json()
      const rawJobs = Array.isArray(data) ? data.slice(1, 15) : []

      liveListings = rawJobs.map((job: any, index: number) => {
        const isIntern = job.position?.toLowerCase().includes('intern') || job.tags?.includes('internship')
        return {
          id: `live_${job.id || index}_${Date.now()}`,
          title: job.position || 'Software Engineer',
          company: job.company || 'Tech Startup',
          type: isIntern ? 'internship' : 'job',
          location: job.location || 'Remote (Worldwide)',
          is_remote: true,
          stipend_or_salary: job.salary_min && job.salary_max
            ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max / 1000)}k/yr`
            : 'Competitive Market Rate',
          description: job.description
            ? job.description.replace(/<[^>]*>?/gm, '').slice(0, 200) + '...'
            : 'Live tech position requiring software development and problem solving.',
          required_skills: (job.tags || []).slice(0, 5).map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)),
          apply_url: job.url || 'https://remoteok.com',
          deadline: 'Rolling Basis',
          tags: ['Live Feed', 'Remote', ...(job.tags || []).slice(0, 2)],
          is_verified: true,
          is_live_feed: true,
          posted_at: job.date || new Date().toISOString()
        }
      })
    }

    return NextResponse.json({
      success: true,
      count: liveListings.length,
      listings: liveListings
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      listings: []
    })
  }
}
