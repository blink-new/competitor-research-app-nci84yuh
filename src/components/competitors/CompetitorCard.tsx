import { Building2, ExternalLink, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/hooks/useLanguage"
import type { Competitor } from "@/types/competitor"

interface CompetitorCardProps {
  competitor: Competitor
  onEdit: (competitor: Competitor) => void
  onView: (competitor: Competitor) => void
}

export function CompetitorCard({ competitor, onEdit, onView }: CompetitorCardProps) {
  const { t } = useLanguage()
  
  const getSizeColor = (size: string) => {
    switch (size) {
      case 'startup': return 'bg-green-100 text-green-800'
      case 'small': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'large': return 'bg-orange-100 text-orange-800'
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={competitor.logoUrl} alt={competitor.name} />
              <AvatarFallback>
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{competitor.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className={getSizeColor(competitor.size)}>
                  {t(`size.${competitor.size}`)}
                </Badge>
                <span className="text-sm text-muted-foreground">{competitor.industry}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              window.open(competitor.website, '_blank')
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {competitor.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('addCompetitor.monthlyVisitors')}</p>
              <p className="font-medium">{formatNumber(competitor.metrics?.monthlyVisitors)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('addCompetitor.employees')}</p>
              <p className="font-medium">{formatNumber(competitor.metrics?.employees)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView(competitor)}
          >
            {t('common.view')}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(competitor)}
          >
            {t('common.edit')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}