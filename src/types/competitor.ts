export interface Competitor {
  id: string
  name: string
  website: string
  description: string
  industry: string
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  location: string
  logoUrl?: string
  socialMedia: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
  }
  metrics: {
    monthlyVisitors?: number
    marketShare?: number
    revenue?: number
    employees?: number
    growthRate?: number
  }
  products: string[]
  strengths: string[]
  weaknesses: string[]
  lastUpdated: string
  userId: string
  createdAt: string
}

export interface CompetitorAnalytics {
  id: string
  competitorId: string
  date: string
  websiteTraffic: number
  socialEngagement: number
  marketShare: number
  sentiment: number
  userId: string
}

export interface ComparisonData {
  competitors: Competitor[]
  metrics: string[]
  data: Record<string, any>[]
}