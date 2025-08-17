import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from './components/AppLayout'
import { Dashboard } from './components/Dashboard'
import PropertyListSimple from './components/PropertyListSimple'
import PropertyForm from './components/PropertyForm'
import './App.css'

const queryClient = new QueryClient()

type AppView = "dashboard" | "properties" | "new-property" | "stats" | "reports" | "users" | "settings"

function App() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard")

  const handleViewChange = (view: string) => {
    setCurrentView(view as AppView)
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />
      
      case "properties":
        return <PropertyListSimple />
      
      case "new-property":
        return (
          <div className="p-6">
            <PropertyForm />
            {/* Back to properties button */}
            <div className="fixed bottom-6 right-6">
              <button
                onClick={() => setCurrentView("properties")}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
              >
                ← 매물 목록으로 돌아가기
              </button>
            </div>
          </div>
        )
      
      case "stats":
        return (
          <div className="p-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">통계</h2>
              <p className="text-muted-foreground">상세 통계 페이지가 곧 추가될 예정입니다</p>
            </div>
          </div>
        )
      
      case "reports":
        return (
          <div className="p-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">보고서</h2>
              <p className="text-muted-foreground">보고서 시스템이 곧 추가될 예정입니다</p>
            </div>
          </div>
        )
      
      case "users":
        return (
          <div className="p-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">사용자 관리</h2>
              <p className="text-muted-foreground">사용자 관리 시스템이 곧 추가될 예정입니다</p>
            </div>
          </div>
        )
      
      case "settings":
        return (
          <div className="p-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">시스템 설정</h2>
              <p className="text-muted-foreground">설정 페이지가 곧 추가될 예정입니다</p>
            </div>
          </div>
        )
      
      default:
        return <Dashboard />
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout currentView={currentView} onViewChange={handleViewChange}>
        {renderContent()}
      </AppLayout>
    </QueryClientProvider>
  )
}

export default App
