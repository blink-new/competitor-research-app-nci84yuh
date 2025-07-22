import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CompetitorCard } from "@/components/competitors/CompetitorCard"
import { AddCompetitorDialog } from "@/components/competitors/AddCompetitorDialog"
import { useLanguage } from "@/hooks/useLanguage"
import type { Competitor } from "@/types/competitor"

interface CompetitorsProps {
  competitors: Competitor[]
  onAddCompetitor: (competitor: Omit<Competitor, 'id' | 'userId' | 'createdAt' | 'lastUpdated'>) => void
  onEditCompetitor: (competitor: Competitor) => void
}

export function Competitors({ competitors, onAddCompetitor, onEditCompetitor }: CompetitorsProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [sizeFilter, setSizeFilter] = useState<string>("all")
  const [industryFilter, setIndustryFilter] = useState<string>("all")

  const filteredCompetitors = competitors.filter((competitor) => {
    const matchesSearch = competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competitor.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSize = sizeFilter === "all" || competitor.size === sizeFilter
    const matchesIndustry = industryFilter === "all" || competitor.industry === industryFilter
    
    return matchesSearch && matchesSize && matchesIndustry
  })

  const industries = Array.from(new Set(competitors.map(c => c.industry))).filter(Boolean)

  const handleViewCompetitor = (competitor: Competitor) => {
    // For now, just log - in a real app this would open a detailed view
    console.log("Viewing competitor:", competitor)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('competitors.title')}</h1>
          <p className="text-muted-foreground">
            {t('competitors.subtitle')}
          </p>
        </div>
        <AddCompetitorDialog onAdd={onAddCompetitor} />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('competitors.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('competitors.allSizes')}</SelectItem>
              <SelectItem value="startup">{t('size.startup')}</SelectItem>
              <SelectItem value="small">{t('size.small')}</SelectItem>
              <SelectItem value="medium">{t('size.medium')}</SelectItem>
              <SelectItem value="large">{t('size.large')}</SelectItem>
              <SelectItem value="enterprise">{t('size.enterprise')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('competitors.allIndustries')}</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {t('competitors.showing')} {filteredCompetitors.length} {t('competitors.of')} {competitors.length} {t('competitors.competitors')}
      </div>

      {/* Competitors Grid */}
      {filteredCompetitors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitors.map((competitor) => (
            <CompetitorCard
              key={competitor.id}
              competitor={competitor}
              onEdit={onEditCompetitor}
              onView={handleViewCompetitor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('competitors.noCompetitorsFound')}</h3>
          <p className="text-muted-foreground mb-4">
            {competitors.length === 0 
              ? t('competitors.noCompetitorsDescription')
              : t('competitors.adjustFilters')
            }
          </p>
          {competitors.length === 0 && (
            <AddCompetitorDialog onAdd={onAddCompetitor} />
          )}
        </div>
      )}
    </div>
  )
}