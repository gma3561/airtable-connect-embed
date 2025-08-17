import { useState } from "react"
import { ClubList } from "./ClubList"
import { ClubDetail } from "./ClubDetail"
import { Button } from "./ui/button"
import { ArrowLeft, Plus } from "lucide-react"

export interface Club {
  id: string
  logo?: string
  clubName: string
  clubAddress: string
  clubPhone: string
  clubEmail: string
  contactName: string
  contactPhone: string
  contactEmail: string
  adminRole: string
  adminEmail: string
  selectedSports: string[]
  createdAt: string
  status: "active" | "pending" | "suspended"
  memberCount: number
  city: string
  district: string
}

// Mock data for demonstration
const mockClubs: Club[] = [
  {
    id: "CLB-001",
    clubName: "서울 FC",
    clubAddress: "서울특별시 강남구 테헤란로 123",
    clubPhone: "02-123-4567",
    clubEmail: "info@seoulfc.com",
    contactName: "김철수",
    contactPhone: "010-1234-5678",
    contactEmail: "kim@seoulfc.com",
    adminRole: "회장",
    adminEmail: "admin@seoulfc.com",
    selectedSports: ["축구", "농구", "배구", "수영"],
    createdAt: "2024-01-15",
    status: "active",
    memberCount: 45000,
    city: "서울",
    district: "강남구"
  },
  {
    id: "CLB-002",
    clubName: "부산 스포츠클럽",
    clubAddress: "부산광역시 해운대구 센텀시티로 456",
    clubPhone: "051-234-5678",
    clubEmail: "info@busansports.org",
    contactName: "이영희",
    contactPhone: "010-2345-6789",
    contactEmail: "lee@busansports.org",
    adminRole: "회장",
    adminEmail: "admin@busansports.org",
    selectedSports: ["축구", "농구", "수영", "육상"],
    createdAt: "2024-01-20",
    status: "active",
    memberCount: 52000,
    city: "부산",
    district: "해운대구"
  },
  {
    id: "CLB-003",
    clubName: "대구 스포츠클럽",
    clubAddress: "대구광역시 중구 동성로 789",
    clubPhone: "053-345-6789",
    clubEmail: "info@daegusports.org",
    contactName: "박민수",
    contactPhone: "010-3456-7890",
    contactEmail: "park@daegusports.org",
    adminRole: "회장",
    adminEmail: "admin@daegusports.org",
    selectedSports: ["축구", "농구", "배구", "테니스"],
    createdAt: "2024-02-01",
    status: "active",
    memberCount: 48000,
    city: "대구",
    district: "중구"
  },
  {
    id: "CLB-004",
    clubName: "인천 청소년 스포츠클럽",
    clubAddress: "인천광역시 연수구 송도동 101",
    clubPhone: "032-456-7890",
    clubEmail: "info@inchyouthsc.com",
    contactName: "정하늘",
    contactPhone: "010-4567-8901",
    contactEmail: "jung@inchyouthsc.com",
    adminRole: "총괄 코디네이터",
    adminEmail: "admin@inchyouthsc.com",
    selectedSports: ["육상", "수영", "테니스", "배드민턴"],
    createdAt: "2024-02-10",
    status: "active",
    memberCount: 1200,
    city: "인천",
    district: "연수구"
  },
  {
    id: "CLB-005",
    clubName: "광주 종합 스포츠클럽",
    clubAddress: "광주광역시 서구 상무대로 202",
    clubPhone: "062-567-8901",
    clubEmail: "info@gwangjusc.org.kr",
    contactName: "최우진",
    contactPhone: "010-5678-9012",
    contactEmail: "choi@gwangjusc.org.kr",
    adminRole: "회장",
    adminEmail: "admin@gwangjusc.org.kr",
    selectedSports: ["축구", "농구", "요트", "수영"],
    createdAt: "2024-02-15",
    status: "pending",
    memberCount: 850,
    city: "광주",
    district: "서구"
  },
  {
    id: "CLB-006",
    clubName: "대전 시민 스포츠클럽",
    clubAddress: "대전광역시 유성구 대학로 303",
    clubPhone: "042-678-9012",
    clubEmail: "info@daejeonsc.com",
    contactName: "김미래",
    contactPhone: "010-6789-0123",
    contactEmail: "kim@daejeonsc.com",
    adminRole: "사무총장",
    adminEmail: "admin@daejeonsc.com",
    selectedSports: ["배구", "체조", "피트니스", "필라테스"],
    createdAt: "2024-03-01",
    status: "active",
    memberCount: 650,
    city: "대전",
    district: "유성구"
  }
]

export function ClubManagement({ onNewRegistration }: { onNewRegistration: () => void }) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [clubs, setClubs] = useState<Club[]>(mockClubs)

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club)
  }

  const handleBackToList = () => {
    setSelectedClub(null)
  }

  const handleClubUpdate = (updatedClub: Club) => {
    setClubs(prev => prev.map(club => 
      club.id === updatedClub.id ? updatedClub : club
    ))
    setSelectedClub(updatedClub)
  }

  const handleClubDelete = (clubId: string) => {
    setClubs(prev => prev.filter(club => club.id !== clubId))
    setSelectedClub(null)
  }

  if (selectedClub) {
    return (
      <ClubDetail
        club={selectedClub}
        onBack={handleBackToList}
        onUpdate={handleClubUpdate}
        onDelete={handleClubDelete}
      />
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">클럽 관리</h1>
          <p className="text-muted-foreground mt-1">등록된 클럽을 관리하고 업데이트하세요</p>
        </div>
        <Button onClick={onNewRegistration} className="gap-2">
          <Plus className="w-4 h-4" />
          새 클럽 등록
        </Button>
      </div>

      {/* Club List */}
      <ClubList clubs={clubs} onClubSelect={handleClubSelect} />
    </div>
  )
}