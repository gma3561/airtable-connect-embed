import { useState } from "react"
import { AppLayout } from "./components/AppLayout"
import { Dashboard } from "./components/Dashboard"
import { ClubRegistration } from "./components/ClubRegistration"
import { ClubManagement } from "./components/ClubManagement"
import { SportsManagement } from "./components/SportsManagement"
import { DepartmentManagement } from "./components/DepartmentManagement"
import { LicenseTypeManagement } from "./components/LicenseTypeManagement"
import { PlayerPositionManagement } from "./components/PlayerPositionManagement"
import { TestManagement } from "./components/TestManagement"
import { TestSessionManagement } from "./components/TestSessionManagement"

type AppView = "dashboard" | "management" | "registration" | "stats" | "reports" | "users" | "sports" | "departments" | "licenses" | "positions" | "tests" | "test-sessions" | "settings"

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard")

  const handleViewChange = (view: string) => {
    setCurrentView(view as AppView)
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />
      
      case "management":
        return (
          <ClubManagement 
            onNewRegistration={() => setCurrentView("registration")} 
          />
        )
      
      case "registration":
        return (
          <div className="p-6">
            <ClubRegistration />
            {/* Back to management button */}
            <div className="fixed bottom-6 right-6">
              <button
                onClick={() => setCurrentView("management")}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
              >
                ← 클럽 관리로 돌아가기
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
      
      case "sports":
        return <SportsManagement />
      
      case "departments":
        return <DepartmentManagement />
      
      case "licenses":
        return <LicenseTypeManagement />
      
      case "positions":
        return <PlayerPositionManagement />
      
      case "tests":
        return <TestManagement />
      
      case "test-sessions":
        return <TestSessionManagement />
      
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
    <AppLayout currentView={currentView} onViewChange={handleViewChange}>
      {renderContent()}
    </AppLayout>
  )
}