import { useState } from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/hooks/useLanguage"
import type { Competitor } from "@/types/competitor"

interface AddCompetitorDialogProps {
  onAdd: (competitor: Omit<Competitor, 'id' | 'userId' | 'createdAt' | 'lastUpdated'>) => void
}

export function AddCompetitorDialog({ onAdd }: AddCompetitorDialogProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    industry: '',
    size: 'medium' as const,
    location: '',
    logoUrl: '',
    socialMedia: {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: '',
    },
    metrics: {
      monthlyVisitors: 0,
      marketShare: 0,
      revenue: 0,
      employees: 0,
      growthRate: 0,
    },
    products: [] as string[],
    strengths: [] as string[],
    weaknesses: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setOpen(false)
    setFormData({
      name: '',
      website: '',
      description: '',
      industry: '',
      size: 'medium',
      location: '',
      logoUrl: '',
      socialMedia: {
        twitter: '',
        linkedin: '',
        facebook: '',
        instagram: '',
      },
      metrics: {
        monthlyVisitors: 0,
        marketShare: 0,
        revenue: 0,
        employees: 0,
        growthRate: 0,
      },
      products: [],
      strengths: [],
      weaknesses: [],
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('competitors.addCompetitor')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addCompetitor.title')}</DialogTitle>
          <DialogDescription>
            {t('addCompetitor.description')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('addCompetitor.companyName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">{t('addCompetitor.website')} *</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Select
                value={formData.size}
                onValueChange={(value: any) => setFormData({ ...formData, size: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">{t('size.startup')}</SelectItem>
                  <SelectItem value="small">{t('size.small')}</SelectItem>
                  <SelectItem value="medium">{t('size.medium')}</SelectItem>
                  <SelectItem value="large">{t('size.large')}</SelectItem>
                  <SelectItem value="enterprise">{t('size.enterprise')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <Label>Key Metrics</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyVisitors">Monthly Visitors</Label>
                <Input
                  id="monthlyVisitors"
                  type="number"
                  value={formData.metrics.monthlyVisitors}
                  onChange={(e) => setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, monthlyVisitors: Number(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  value={formData.metrics.employees}
                  onChange={(e) => setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, employees: Number(e.target.value) }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('addCompetitor.cancel')}
            </Button>
            <Button type="submit">{t('addCompetitor.add')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}