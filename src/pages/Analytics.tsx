import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/useLanguage"
import type { Competitor } from "@/types/competitor"

interface AnalyticsProps {
  competitors: Competitor[]
}

export function Analytics({ competitors }: AnalyticsProps) {
  const { t } = useLanguage()
  
  // Prepare data for charts with extensive safety checks
  const trafficData = competitors
    .filter(c => {
      // Extra safety checks
      if (!c || !c.metrics || typeof c.metrics !== 'object') {
        console.warn('Invalid competitor data in trafficData filter:', c)
        return false
      }
      return c.metrics.monthlyVisitors && c.metrics.monthlyVisitors > 0
    })
    .map(c => ({
      name: c.name || 'Unknown',
      visitors: c.metrics?.monthlyVisitors || 0,
      growth: c.metrics?.growthRate || 0
    }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 10)

  const sizeDistribution = competitors.reduce((acc, c) => {
    acc[c.size] = (acc[c.size] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(sizeDistribution).map(([size, count]) => ({
    name: t(`size.${size}`),
    value: count
  }))

  const industryData = competitors.reduce((acc, c) => {
    if (c.industry) {
      acc[c.industry] = (acc[c.industry] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const industryChartData = Object.entries(industryData).map(([industry, count]) => ({
    industry,
    count
  }))

  const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316']

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h1>
        <p className="text-muted-foreground">
          {t('analytics.subtitle')}
        </p>
      </div>

      {competitors.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <BarChart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('analytics.noData')}</h3>
          <p className="text-muted-foreground">
            {t('analytics.addCompetitors')}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Traffic Analysis */}
          {trafficData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.trafficComparison')}</CardTitle>
                <CardDescription>
                  Monthly visitors across top competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip 
                      formatter={(value: number) => [formatNumber(value), t('analytics.monthlyVisitors')]}
                    />
                    <Bar dataKey="visitors" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Size Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.companySizeDistribution')}</CardTitle>
                <CardDescription>
                  Breakdown of competitors by company size
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Industry Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.industryBreakdown')}</CardTitle>
                <CardDescription>
                  Competitors across different industries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={industryChartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="industry" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Growth Rate Analysis */}
          {trafficData.some(d => d.growth !== 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Growth Rate Analysis</CardTitle>
                <CardDescription>
                  Competitor growth trends and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Growth Rate']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="growth" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.topPerformers')}</CardTitle>
              <CardDescription>
                Leading competitors by key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitors
                  .filter(c => {
                    // Extra safety checks for top performers
                    if (!c || !c.metrics || typeof c.metrics !== 'object') {
                      console.warn('Invalid competitor data in top performers filter:', c)
                      return false
                    }
                    return c.metrics.monthlyVisitors && c.metrics.monthlyVisitors > 0
                  })
                  .sort((a, b) => (b.metrics?.monthlyVisitors || 0) - (a.metrics?.monthlyVisitors || 0))
                  .slice(0, 5)
                  .map((competitor, index) => (
                    <div key={competitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{competitor.name}</p>
                          <p className="text-sm text-muted-foreground">{competitor.industry}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatNumber(competitor.metrics?.monthlyVisitors || 0)}</p>
                        <p className="text-sm text-muted-foreground">{t('analytics.monthlyVisitors')}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}