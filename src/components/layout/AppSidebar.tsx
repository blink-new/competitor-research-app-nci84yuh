import { 
  BarChart3, 
  Building2, 
  FileText, 
  Home, 
  Settings, 
  TrendingUp,
  Users
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { t } = useLanguage()

  const items = [
    {
      title: t('nav.dashboard'),
      key: "dashboard",
      icon: Home,
    },
    {
      title: t('nav.competitors'),
      key: "competitors",
      icon: Building2,
    },
    {
      title: t('nav.analytics'),
      key: "analytics",
      icon: BarChart3,
    },
    {
      title: t('nav.comparison'),
      key: "comparison",
      icon: TrendingUp,
    },
    {
      title: t('nav.reports'),
      key: "reports",
      icon: FileText,
    },
  ]

  const secondaryItems = [
    {
      title: t('nav.team'),
      key: "team",
      icon: Users,
    },
    {
      title: t('nav.settings'),
      key: "settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="text-lg font-semibold text-primary">
            CompeteIQ
          </div>
          <LanguageSwitcher />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeTab === item.key}
                  >
                    <button
                      onClick={() => onTabChange(item.key)}
                      className="w-full"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeTab === item.key}
                  >
                    <button
                      onClick={() => onTabChange(item.key)}
                      className="w-full"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}