import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  User,
  Clock,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  FileText
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

interface TestSession {
  id: string
  playerId: string
  playerName: string
  sessionDate: string
  testId: string
  testName: string
  testCategory: string
  notes: string
  status: "planned" | "in_progress" | "completed" | "cancelled"
  results: TestResult[]
  createdBy: string
  createdAt: string
}

interface TestResult {
  id: string
  testTypeId: string
  testTypeName: string
  calculatedValue: number
  rawResults: { [key: string]: any }
  comments: string
  isValid: boolean
  judgement: string
  approvalStatus: "pending" | "approved" | "rejected"
  scoreLevel: string
  scoreCode: string
}

interface Player {
  id: string
  name: string
  position: string
  age: number
  team: string
}

interface TestType {
  id: string
  name: string
  categoryName: string
  unit: string
}

// Mock data
const mockPlayers: Player[] = [
  { id: "1", name: "김철수", position: "골키퍼", age: 24, team: "A팀" },
  { id: "2", name: "이영희", position: "수비수", age: 22, team: "A팀" },
  { id: "3", name: "박민수", position: "미드필더", age: 26, team: "A팀" },
  { id: "4", name: "정하늘", position: "공격수", age: 23, team: "A팀" },
  { id: "5", name: "최우진", position: "윙어", age: 25, team: "B팀" }
]

const mockTestTypes: TestType[] = [
  { id: "1", name: "30미터 스프린트", categoryName: "체력", unit: "초" },
  { id: "2", name: "쿠퍼 테스트", categoryName: "체력", unit: "미터" },
  { id: "3", name: "수직 점프", categoryName: "체력", unit: "cm" },
  { id: "4", name: "축구 드리블링", categoryName: "기술", unit: "초" },
  { id: "5", name: "집중력 테스트", categoryName: "심리", unit: "점" }
]

const mockTestSessions: TestSession[] = [
  {
    id: "1",
    playerId: "1",
    playerName: "김철수",
    sessionDate: "2024-01-25",
    testId: "1",
    testName: "30미터 스프린트",
    testCategory: "체력",
    notes: "시즌 전 정기 테스트",
    status: "completed",
    results: [
      {
        id: "1",
        testTypeId: "1",
        testTypeName: "30미터 스프린트",
        calculatedValue: 4.25,
        rawResults: { "1차 시도": 4.32, "2차 시도": 4.25, "최고기록": 4.25 },
        comments: "좋은 성과",
        isValid: true,
        judgement: "성공",
        approvalStatus: "approved",
        scoreLevel: "보통",
        scoreCode: "B"
      }
    ],
    createdBy: "박트레이너",
    createdAt: "2024-01-20"
  },
  {
    id: "2",
    playerId: "2",
    playerName: "이영희",
    sessionDate: "2024-01-26",
    testId: "2",
    testName: "쿠퍼 테스트",
    testCategory: "체력",
    notes: "지구력 평가",
    status: "in_progress",
    results: [],
    createdBy: "박트레이너",
    createdAt: "2024-01-25"
  },
  {
    id: "3",
    playerId: "3",
    playerName: "박민수",
    sessionDate: "2024-01-27",
    testId: "3",
    testName: "수직 점프",
    testCategory: "체력",
    notes: "폭발적인 힘 테스트",
    status: "planned",
    results: [],
    createdBy: "박트레이너",
    createdAt: "2024-01-25"
  },
  {
    id: "4",
    playerId: "4",
    playerName: "정하늘",
    sessionDate: "2024-01-24",
    testId: "4",
    testName: "축구 드리블링",
    testCategory: "기술",
    notes: "기술 능력 평가",
    status: "completed",
    results: [
      {
        id: "2",
        testTypeId: "4",
        testTypeName: "축구 드리블링",
        calculatedValue: 12.8,
        rawResults: { "1차 시도": 13.2, "2차 시도": 12.8, "3차 시도": 13.1 },
        comments: "표준 성과",
        isValid: true,
        judgement: "보통",
        approvalStatus: "pending",
        scoreLevel: "보통",
        scoreCode: "C"
      }
    ],
    createdBy: "김코치",
    createdAt: "2024-01-22"
  },
  {
    id: "5",
    playerId: "5",
    playerName: "최우진",
    sessionDate: "2024-01-23",
    testId: "5",
    testName: "집중력 테스트",
    testCategory: "심리",
    notes: "정신적 준비도 테스트",
    status: "cancelled",
    results: [],
    createdBy: "심리상담사 이선생",
    createdAt: "2024-01-22"
  }
]

const statusLabels = {
  "planned": "계획됨",
  "in_progress": "진행 중",
  "completed": "완료",
  "cancelled": "취소됨"
}

const statusColors = {
  "planned": "bg-blue-100 text-blue-800",
  "in_progress": "bg-yellow-100 text-yellow-800",
  "completed": "bg-green-100 text-green-800",
  "cancelled": "bg-red-100 text-red-800"
}

const approvalStatusLabels = {
  "pending": "대기 중",
  "approved": "승인됨",
  "rejected": "거부됨"
}

export function TestSessionManagement() {
  const [sessions, setSessions] = useState<TestSession[]>(mockTestSessions)
  const [players] = useState<Player[]>(mockPlayers)
  const [testTypes] = useState<TestType[]>(mockTestTypes)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isAddingSession, setIsAddingSession] = useState(false)
  const [selectedSession, setSelectedSession] = useState<TestSession | null>(null)
  const [newSession, setNewSession] = useState<Partial<TestSession>>({
    playerId: "",
    sessionDate: "",
    testId: "",
    notes: "",
    status: "planned"
  })

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.testCategory.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || session.status === filterStatus
    const matchesCategory = filterCategory === "all" || session.testCategory === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleAddSession = () => {
    if (newSession.playerId && newSession.sessionDate && newSession.testId) {
      const selectedPlayer = players.find(p => p.id === newSession.playerId)
      const selectedTest = testTypes.find(t => t.id === newSession.testId)
      
      const session: TestSession = {
        id: Date.now().toString(),
        playerId: newSession.playerId!,
        playerName: selectedPlayer?.name || "알 수 없음",
        sessionDate: newSession.sessionDate!,
        testId: newSession.testId!,
        testName: selectedTest?.name || "알 수 없음",
        testCategory: selectedTest?.categoryName || "알 수 없음",
        notes: newSession.notes || "",
        status: newSession.status as any || "planned",
        results: [],
        createdBy: "시스템 관리자",
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setSessions([...sessions, session])
      setNewSession({
        playerId: "",
        sessionDate: "",
        testId: "",
        notes: "",
        status: "planned"
      })
      setIsAddingSession(false)
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
  }

  const updateSessionStatus = (sessionId: string, newStatus: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, status: newStatus as any } : s
    ))
  }

  const totalSessions = sessions.length
  const completedSessions = sessions.filter(s => s.status === "completed").length
  const pendingSessions = sessions.filter(s => s.status === "planned" || s.status === "in_progress").length
  const cancelledSessions = sessions.filter(s => s.status === "cancelled").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">테스트 세션</h1>
          <p className="text-muted-foreground mt-1">선수 테스트 세션을 관리하고 결과를 추적하세요</p>
        </div>
        <Button onClick={() => setIsAddingSession(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          새 테스트 세션
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">전체 세션</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">완료됨</p>
                <p className="text-2xl font-bold">{completedSessions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">대기 중</p>
                <p className="text-2xl font-bold">{pendingSessions}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">취소됨</p>
                <p className="text-2xl font-bold">{cancelledSessions}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">검색</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="선수 이름, 테스트 이름으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Label>상태 필터</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Label>카테고리 필터</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  <SelectItem value="체력">체력</SelectItem>
                  <SelectItem value="기술">기술</SelectItem>
                  <SelectItem value="심리">심리</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Session Form */}
      {isAddingSession && (
        <Card>
          <CardHeader>
            <CardTitle>새 테스트 세션</CardTitle>
            <CardDescription>새로운 테스트 세션을 계획하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>선수</Label>
                <Select 
                  value={newSession.playerId || ""} 
                  onValueChange={(value) => setNewSession({...newSession, playerId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선수 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map(player => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} - {player.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>테스트 유형</Label>
                <Select 
                  value={newSession.testId || ""} 
                  onValueChange={(value) => setNewSession({...newSession, testId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="테스트 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypes.map(testType => (
                      <SelectItem key={testType.id} value={testType.id}>
                        {testType.name} - {testType.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>세션 날짜</Label>
                <Input
                  type="date"
                  value={newSession.sessionDate || ""}
                  onChange={(e) => setNewSession({...newSession, sessionDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>상태</Label>
                <Select 
                  value={newSession.status || "planned"} 
                  onValueChange={(value) => setNewSession({...newSession, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>메모</Label>
              <Textarea
                value={newSession.notes || ""}
                onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                placeholder="테스트 세션에 대한 메모..."
              />
            </div>
            
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingSession(false)}>
                <X className="w-4 h-4 mr-2" />
                취소
              </Button>
              <Button onClick={handleAddSession}>
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSessions.map(session => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {session.playerName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{session.testCategory}</Badge>
                    <Badge variant="secondary">{session.testName}</Badge>
                    <Badge className={statusColors[session.status]}>
                      {statusLabels[session.status]}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.sessionDate).toLocaleDateString('ko-KR')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.createdBy}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.notes && (
                <p className="text-sm text-muted-foreground">{session.notes}</p>
              )}
              
              {/* Test Results */}
              {session.results.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">테스트 결과</Label>
                  {session.results.map(result => (
                    <div key={result.id} className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.testTypeName}</Badge>
                          <Badge variant={result.isValid ? "default" : "destructive"}>
                            {result.isValid ? "유효" : "무효"}
                          </Badge>
                          <Badge className={
                            result.approvalStatus === "approved" ? "bg-green-100 text-green-800" :
                            result.approvalStatus === "rejected" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }>
                            {approvalStatusLabels[result.approvalStatus]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">{result.calculatedValue}</span>
                          <span className="text-sm text-muted-foreground">
                            {testTypes.find(t => t.id === result.testTypeId)?.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>평가: {result.judgement}</p>
                        <p>레벨: {result.scoreLevel} ({result.scoreCode})</p>
                        {result.comments && <p>코멘트: {result.comments}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  생성일: {new Date(session.createdAt).toLocaleDateString('ko-KR')}
                </span>
                
                <div className="flex items-center gap-2">
                  {session.status === "planned" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSessionStatus(session.id, "in_progress")}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      시작
                    </Button>
                  )}
                  
                  {session.status === "in_progress" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSessionStatus(session.id, "completed")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      완료
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSession(session)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    상세
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>테스트 세션 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                          이 테스트 세션을 삭제하시겠습니까?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSession(session.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">테스트 세션을 찾을 수 없음</h3>
            <p className="text-muted-foreground">검색 조건에 맞는 테스트 세션이 없습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}