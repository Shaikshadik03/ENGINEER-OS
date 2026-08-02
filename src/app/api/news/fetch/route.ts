import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'technology'

    // Use GNews API - free tier: 100 requests/day
    const GNEWS_KEY = process.env.GNEWS_API_KEY

    if (!GNEWS_KEY) {
      // Fallback to NewsData.io free tier (no key needed for basic)
      // Or use RSS feed from TechCrunch/Hacker News
      const hnRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?limitToFirst=20&orderBy="$key"', {
        next: { revalidate: 1800 }
      })
      const ids: number[] = await hnRes.json()
      const top10 = ids.slice(0, 10)

      const stories = await Promise.all(
        top10.map(async (id: number) => {
          const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          return r.json()
        })
      )

      const articles = stories
        .filter((s: any) => s && s.title && s.url)
        .map((s: any) => ({
          id: s.id?.toString(),
          title: s.title,
          description: `${s.score} points • ${s.descendants || 0} comments on Hacker News`,
          url: s.url,
          source: s.by ? `Posted by ${s.by}` : 'Hacker News',
          publishedAt: s.time ? new Date(s.time * 1000).toISOString() : new Date().toISOString(),
          category: 'Tech News',
          image: null
        }))

      return NextResponse.json({ success: true, articles, source: 'hackernews' })
    }

    // Use GNews API if key available
    const q = category === 'hiring' ? 'software engineering jobs hiring India' :
               category === 'ai' ? 'artificial intelligence machine learning 2025' :
               category === 'opensource' ? 'open source developer tools' :
               'technology programming software'

    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&country=in&max=12&apikey=${GNEWS_KEY}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()

    const articles = (data.articles || []).map((a: any) => ({
      id: a.url,
      title: a.title,
      description: a.description,
      url: a.url,
      source: a.source?.name || 'Unknown',
      publishedAt: a.publishedAt,
      category,
      image: a.image
    }))

    return NextResponse.json({ success: true, articles, source: 'gnews' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
