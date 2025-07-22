import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'ru'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.competitors': 'Competitors',
    'nav.analytics': 'Analytics',
    'nav.comparison': 'Comparison',
    'nav.reports': 'Reports',
    'nav.team': 'Team',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Overview of your competitive intelligence',
    'dashboard.totalCompetitors': 'Total Competitors',
    'dashboard.avgTraffic': 'Avg. Monthly Traffic',
    'dashboard.marketGrowth': 'Market Growth',
    'dashboard.topPerformer': 'Top Performer',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.marketInsights': 'Market Insights',
    'dashboard.noActivity': 'No recent activity',
    'dashboard.addFirstCompetitor': 'Add your first competitor to see insights',
    
    // Competitors
    'competitors.title': 'Competitors',
    'competitors.subtitle': 'Manage and track your competitive landscape',
    'competitors.addCompetitor': 'Add Competitor',
    'competitors.searchPlaceholder': 'Search competitors...',
    'competitors.allSizes': 'All Sizes',
    'competitors.allIndustries': 'All Industries',
    'competitors.showing': 'Showing',
    'competitors.of': 'of',
    'competitors.competitors': 'competitors',
    'competitors.noCompetitorsFound': 'No competitors found',
    'competitors.noCompetitorsDescription': 'Start building your competitive intelligence by adding your first competitor.',
    'competitors.adjustFilters': 'Try adjusting your search or filter criteria.',
    
    // Add Competitor Dialog
    'addCompetitor.title': 'Add New Competitor',
    'addCompetitor.description': 'Enter the details of your competitor to start tracking them.',
    'addCompetitor.companyName': 'Company Name',
    'addCompetitor.website': 'Website',
    'addCompetitor.description': 'Description',
    'addCompetitor.industry': 'Industry',
    'addCompetitor.companySize': 'Company Size',
    'addCompetitor.location': 'Location',
    'addCompetitor.logoUrl': 'Logo URL',
    'addCompetitor.keyMetrics': 'Key Metrics',
    'addCompetitor.monthlyVisitors': 'Monthly Visitors',
    'addCompetitor.employees': 'Employees',
    'addCompetitor.cancel': 'Cancel',
    'addCompetitor.add': 'Add Competitor',
    
    // Company Sizes
    'size.startup': 'Startup',
    'size.small': 'Small',
    'size.medium': 'Medium',
    'size.large': 'Large',
    'size.enterprise': 'Enterprise',
    
    // Analytics
    'analytics.title': 'Analytics',
    'analytics.subtitle': 'Deep dive into competitor performance data',
    'analytics.trafficComparison': 'Traffic Comparison',
    'analytics.companySizeDistribution': 'Company Size Distribution',
    'analytics.industryBreakdown': 'Industry Breakdown',
    'analytics.topPerformers': 'Top Performers',
    'analytics.monthlyVisitors': 'Monthly Visitors',
    'analytics.noData': 'No data available',
    'analytics.addCompetitors': 'Add competitors to see analytics',
    
    // Common
    'common.loading': 'Loading...',
    'common.signIn': 'Sign In',
    'common.welcome': 'Welcome to CompeteIQ',
    'common.pleaseSignIn': 'Please sign in to continue',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.comingSoon': 'Coming soon...',
    
    // Language Switcher
    'language.english': 'English',
    'language.russian': 'Русский',
  },
  ru: {
    // Navigation
    'nav.dashboard': 'Панель управления',
    'nav.competitors': 'Конкуренты',
    'nav.analytics': 'Аналитика',
    'nav.comparison': 'Сравнение',
    'nav.reports': 'Отчеты',
    'nav.team': 'Команда',
    'nav.settings': 'Настройки',
    
    // Dashboard
    'dashboard.title': 'Панель управления',
    'dashboard.subtitle': 'Обзор вашей конкурентной разведки',
    'dashboard.totalCompetitors': 'Всего конкурентов',
    'dashboard.avgTraffic': 'Средний месячный трафик',
    'dashboard.marketGrowth': 'Рост рынка',
    'dashboard.topPerformer': 'Лидер',
    'dashboard.recentActivity': 'Недавняя активность',
    'dashboard.marketInsights': 'Рыночная аналитика',
    'dashboard.noActivity': 'Нет недавней активности',
    'dashboard.addFirstCompetitor': 'Добавьте первого конкурента для просмотра аналитики',
    
    // Competitors
    'competitors.title': 'Конкуренты',
    'competitors.subtitle': 'Управляйте и отслеживайте конкурентную среду',
    'competitors.addCompetitor': 'Добавить конкурента',
    'competitors.searchPlaceholder': 'Поиск конкурентов...',
    'competitors.allSizes': 'Все размеры',
    'competitors.allIndustries': 'Все отрасли',
    'competitors.showing': 'Показано',
    'competitors.of': 'из',
    'competitors.competitors': 'конкурентов',
    'competitors.noCompetitorsFound': 'Конкуренты не найдены',
    'competitors.noCompetitorsDescription': 'Начните создавать конкурентную разведку, добавив первого конкурента.',
    'competitors.adjustFilters': 'Попробуйте изменить критерии поиска или фильтрации.',
    
    // Add Competitor Dialog
    'addCompetitor.title': 'Добавить нового конкурента',
    'addCompetitor.description': 'Введите данные конкурента для начала отслеживания.',
    'addCompetitor.companyName': 'Название компании',
    'addCompetitor.website': 'Веб-сайт',
    'addCompetitor.description': 'Описание',
    'addCompetitor.industry': 'Отрасль',
    'addCompetitor.companySize': 'Размер компании',
    'addCompetitor.location': 'Местоположение',
    'addCompetitor.logoUrl': 'URL логотипа',
    'addCompetitor.keyMetrics': 'Ключевые метрики',
    'addCompetitor.monthlyVisitors': 'Месячные посетители',
    'addCompetitor.employees': 'Сотрудники',
    'addCompetitor.cancel': 'Отмена',
    'addCompetitor.add': 'Добавить конкурента',
    
    // Company Sizes
    'size.startup': 'Стартап',
    'size.small': 'Малая',
    'size.medium': 'Средняя',
    'size.large': 'Крупная',
    'size.enterprise': 'Корпорация',
    
    // Analytics
    'analytics.title': 'Аналитика',
    'analytics.subtitle': 'Глубокий анализ данных о производительности конкурентов',
    'analytics.trafficComparison': 'Сравнение трафика',
    'analytics.companySizeDistribution': 'Распределение по размеру компаний',
    'analytics.industryBreakdown': 'Разбивка по отраслям',
    'analytics.topPerformers': 'Лидеры',
    'analytics.monthlyVisitors': 'Месячные посетители',
    'analytics.noData': 'Данные недоступны',
    'analytics.addCompetitors': 'Добавьте конкурентов для просмотра аналитики',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.signIn': 'Войти',
    'common.welcome': 'Добро пожаловать в CompeteIQ',
    'common.pleaseSignIn': 'Пожалуйста, войдите для продолжения',
    'common.view': 'Просмотр',
    'common.edit': 'Редактировать',
    'common.comingSoon': 'Скоро...',
    
    // Language Switcher
    'language.english': 'English',
    'language.russian': 'Русский',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved as Language) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export { LanguageContext }