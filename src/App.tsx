import { useState, useEffect, useCallback } from 'react'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Dashboard } from "@/pages/Dashboard"
import { Competitors } from "@/pages/Competitors"
import { Analytics } from "@/pages/Analytics"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { useLanguage } from "@/hooks/useLanguage"
import { blink } from "@/blink/client"
import type { Competitor } from "@/types/competitor"

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const loadCompetitors = useCallback(async () => {
    if (!user) return
    try {
      const data = await blink.db.competitors.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      
      console.log('Raw database data:', data)
      
      // Transform database data to match TypeScript interface with proper JSON parsing
      const transformedData = data.map((item: any, index: number) => {
        console.log(`Processing item ${index}:`, item)
        
        // Safely parse JSON fields with extensive error handling
        const parseJsonField = (field: any, defaultValue: any, fieldName: string) => {
          console.log(`Parsing field ${fieldName}:`, field, typeof field)
          
          if (field === null || field === undefined) {
            console.log(`Field ${fieldName} is null/undefined, using default:`, defaultValue)
            return defaultValue
          }
          
          if (typeof field === 'string') {
            try {
              // Handle malformed JSON like "[object Object]"
              if (field === '[object Object]' || field === '') {
                console.log(`Field ${fieldName} is malformed, using default:`, defaultValue)
                return defaultValue
              }
              const parsed = JSON.parse(field)
              console.log(`Successfully parsed ${fieldName}:`, parsed)
              return parsed
            } catch (error) {
              console.error(`Failed to parse ${fieldName}:`, error, 'Raw value:', field)
              return defaultValue
            }
          }
          
          if (typeof field === 'object') {
            console.log(`Field ${fieldName} is already an object:`, field)
            return field
          }
          
          console.log(`Field ${fieldName} fallback to default:`, defaultValue)
          return defaultValue
        }

        const transformed = {
          id: item.id,
          name: item.name || '',
          website: item.website || '',
          description: item.description || '',
          industry: item.industry || '',
          size: item.size || 'startup',
          location: item.location || '',
          logoUrl: item.logoUrl || item.logo_url || '',
          socialMedia: parseJsonField(item.socialMedia || item.social_media, {
            twitter: '',
            linkedin: '',
            facebook: '',
            instagram: ''
          }, 'socialMedia'),
          metrics: parseJsonField(item.metrics, {
            monthlyVisitors: 0,
            marketShare: 0,
            revenue: 0,
            employees: 0,
            growthRate: 0
          }, 'metrics'),
          products: parseJsonField(item.products, [], 'products'),
          strengths: parseJsonField(item.strengths, [], 'strengths'),
          weaknesses: parseJsonField(item.weaknesses, [], 'weaknesses'),
          lastUpdated: item.lastUpdated || item.last_updated || new Date().toISOString(),
          userId: item.userId || item.user_id || user.id,
          createdAt: item.createdAt || item.created_at || new Date().toISOString()
        }
        
        console.log(`Transformed item ${index}:`, transformed)
        
        // Validate that metrics is properly set
        if (!transformed.metrics || typeof transformed.metrics !== 'object') {
          console.error(`CRITICAL: metrics is not an object for item ${index}:`, transformed.metrics)
          transformed.metrics = {
            monthlyVisitors: 0,
            marketShare: 0,
            revenue: 0,
            employees: 0,
            growthRate: 0
          }
        }
        
        return transformed
      })
      
      console.log('Final transformed data:', transformedData)
      setCompetitors(transformedData)
    } catch (error) {
      console.error('Failed to load competitors:', error)
      setCompetitors([]) // Ensure we always have an array
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadCompetitors()
    }
  }, [user, loadCompetitors])

  const handleAddCompetitor = async (competitorData: Omit<Competitor, 'id' | 'userId' | 'createdAt' | 'lastUpdated'>) => {
    try {
      // Transform data for database storage (convert camelCase to snake_case and stringify JSON)
      const dbData = {
        name: competitorData.name,
        website: competitorData.website,
        description: competitorData.description,
        industry: competitorData.industry,
        size: competitorData.size,
        location: competitorData.location,
        logo_url: competitorData.logoUrl || '',
        social_media: JSON.stringify(competitorData.socialMedia),
        metrics: JSON.stringify(competitorData.metrics),
        products: JSON.stringify(competitorData.products),
        strengths: JSON.stringify(competitorData.strengths),
        weaknesses: JSON.stringify(competitorData.weaknesses),
        user_id: user.id,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      }
      
      await blink.db.competitors.create(dbData)
      
      // Reload competitors to get fresh data with proper IDs
      loadCompetitors()
    } catch (error) {
      console.error('Failed to add competitor:', error)
    }
  }

  const handleEditCompetitor = async (competitor: Competitor) => {
    try {
      // Transform data for database storage
      const dbData = {
        name: competitor.name,
        website: competitor.website,
        description: competitor.description,
        industry: competitor.industry,
        size: competitor.size,
        location: competitor.location,
        logo_url: competitor.logoUrl || '',
        social_media: JSON.stringify(competitor.socialMedia),
        metrics: JSON.stringify(competitor.metrics),
        products: JSON.stringify(competitor.products),
        strengths: JSON.stringify(competitor.strengths),
        weaknesses: JSON.stringify(competitor.weaknesses),
        last_updated: new Date().toISOString()
      }
      
      await blink.db.competitors.update(competitor.id, dbData)
      
      // Reload competitors to get fresh data
      loadCompetitors()
    } catch (error) {
      console.error('Failed to update competitor:', error)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard competitors={competitors} />
      case 'competitors':
        return (
          <Competitors 
            competitors={competitors}
            onAddCompetitor={handleAddCompetitor}
            onEditCompetitor={handleEditCompetitor}
          />
        )
      case 'analytics':
        return <Analytics competitors={competitors} />
      case 'comparison':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('nav.comparison')}</h1>
              <p className="text-muted-foreground">
                Side-by-side competitor analysis
              </p>
            </div>
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('common.comingSoon')}</p>
            </div>
          </div>
        )
      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('nav.reports')}</h1>
              <p className="text-muted-foreground">
                Generate and export competitive intelligence reports
              </p>
            </div>
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('common.comingSoon')}</p>
            </div>
          </div>
        )
      case 'team':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('nav.team')}</h1>
              <p className="text-muted-foreground">
                Collaborate with your team on competitor research
              </p>
            </div>
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('common.comingSoon')}</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('nav.settings')}</h1>
              <p className="text-muted-foreground">
                Configure your preferences and account settings
              </p>
            </div>
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('common.comingSoon')}</p>
            </div>
          </div>
        )
      default:
        return <Dashboard competitors={competitors} />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('common.welcome')}</h1>
          <p className="text-muted-foreground mb-4">{t('common.pleaseSignIn')}</p>
          <button 
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            {t('common.signIn')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App