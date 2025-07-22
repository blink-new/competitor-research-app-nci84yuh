import { BarChart3, Building2, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/useLanguage"
import type { Competitor } from "@/types/competitor"

interface DashboardProps {
  competitors: Competitor[]
}

export function Dashboard({ competitors }: DashboardProps) {
  const { t } = useLanguage()
  
  const totalCompetitors = competitors.length
  const totalVisitors = competitors.reduce((sum, comp) => {
    // Extra safety checks
    if (!comp || !comp.metrics || typeof comp.metrics !== 'object') {
      console.warn('Invalid competitor data in totalVisitors calculation:', comp)
      return sum
    }
    const visitors = comp.metrics.monthlyVisitors || 0
    return sum + visitors
  }, 0)
  const avgGrowthRate = competitors.length > 0 
    ? competitors.reduce((sum, comp) => {
        // Extra safety checks
        if (!comp || !comp.metrics || typeof comp.metrics !== 'object') {
          console.warn('Invalid competitor data in avgGrowthRate calculation:', comp)
          return sum
        }
        const growth = comp.metrics.growthRate || 0
        return sum + growth
      }, 0) / competitors.length
    : 0

  const recentCompetitors = competitors
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalCompetitors')}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompetitors}</div>
            <p className="text-xs text-muted-foreground">
              Companies being tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.avgTraffic')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalVisitors)}</div>
            <p className="text-xs text-muted-foreground">
              Combined monthly visitors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.marketGrowth')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgGrowthRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average competitor growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Coverage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitors.filter(c => {
                if (!c || !c.metrics || typeof c.metrics !== 'object') return false
                return c.metrics.marketShare && c.metrics.marketShare > 0
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Companies with market data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>
              Latest additions to your competitor list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCompetitors.length > 0 ? (
                recentCompetitors.map((competitor) => (
                  <div key={competitor.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {competitor.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {competitor.industry}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {t(`size.${competitor.size}`)}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('dashboard.addFirstCompetitor')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.marketInsights')}</CardTitle>
            <CardDescription>
              Key trends and observations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitors.length > 0 ? (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Growing Market</p>
                      <p className="text-sm text-muted-foreground">
                        {competitors.filter(c => {
                          if (!c || !c.metrics || typeof c.metrics !== 'object') return false
                          return (c.metrics.growthRate || 0) > 0
                        }).length} competitors showing positive growth
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Market Leaders</p>
                      <p className="text-sm text-muted-foreground">
                        {competitors.filter(c => c.size === 'large' || c.size === 'enterprise').length} enterprise-level competitors
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Emerging Players</p>
                      <p className="text-sm text-muted-foreground">
                        {competitors.filter(c => c.size === 'startup' || c.size === 'small').length} startups and small companies
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('analytics.addCompetitors')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}