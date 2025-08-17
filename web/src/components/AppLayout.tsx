import { useState } from "react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Badge } from "./ui/badge"
import { 
  Home, 
  Building2, 
  Plus, 
  BarChart3, 
  Settings, 
  Users, 
  FileText,
  Bell,
  LogOut,
  User,
  Shield,
  Building
} from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: string) => void
}

const navigationItems = [
  {
    title: "메인",
    items: [
      { title: "대시보드", icon: Home, id: "dashboard" },
      { title: "매물 목록", icon: Building2, id: "properties" },
      { title: "신규 매물 등록", icon: Plus, id: "new-property" },
    ]
  },
  {
    title: "분석 & 보고서",
    items: [
      { title: "통계", icon: BarChart3, id: "stats" },
      { title: "보고서", icon: FileText, id: "reports" },
      { title: "사용자", icon: Users, id: "users" },
    ]
  },
  {
    title: "시스템",
    items: [
      { title: "설정", icon: Settings, id: "settings" },
    ]
  }
]

// Mock user data
const currentUser = {
  name: "김철수",
  email: "kimcs@property.co.kr",
  role: "시스템 관리자",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  initials: "김철"
}

export function AppLayout({ children, currentView, onViewChange }: AppLayoutProps) {
  const [notifications] = useState(3) // Mock notification count

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarContent>
            {/* Logo/Brand */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">부동산 관리</h2>
                  <p className="text-xs text-muted-foreground">매물 관리 시스템</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            {navigationItems.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          onClick={() => onViewChange(item.id)}
                          isActive={currentView === item.id}
                          className="w-full"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}

            {/* User Info in Sidebar */}
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center justify-between h-full px-6">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="font-semibold text-foreground">
                    {navigationItems
                      .flatMap(group => group.items)
                      .find(item => item.id === currentView)?.title || "대시보드"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {currentView === 'dashboard' && '매물 현황을 한눈에 확인하세요'}
                    {currentView === 'properties' && '전체 매물 목록을 관리합니다'}
                    {currentView === 'new-property' && '새로운 매물을 등록합니다'}
                    {currentView === 'stats' && '통계 및 분석 데이터를 확인합니다'}
                    {currentView === 'reports' && '각종 보고서를 생성하고 관리합니다'}
                    {currentView === 'users' && '사용자 계정을 관리합니다'}
                    {currentView === 'settings' && '시스템 설정을 관리합니다'}
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>{currentUser.initials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium leading-none">{currentUser.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                        <div className="flex items-center gap-1 pt-1">
                          <Shield className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{currentUser.role}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>프로필</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>설정</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>알림</span>
                      {notifications > 0 && (
                        <Badge variant="secondary" className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {notifications}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}