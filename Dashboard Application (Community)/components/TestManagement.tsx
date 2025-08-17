import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { 
  TestTube, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Target,
  Activity,
  Settings,
  BarChart3,
  Users,
  Clock,
  Zap,
  Trophy,
  Brain,
  Heart,
  Dumbbell
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

interface TestCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  testCount: number
  isActive: boolean
  createdAt: string
}

interface TestType {
  id: string
  name: string
  categoryId: string
  categoryName: string
  description: string
  unit: string
  isCalculated: boolean
  fieldCount: number
  sessionCount: number
  isActive: boolean
  createdAt: string
}

interface TestField {
  id: string
  testTypeId: string
  testTypeName: string
  fieldName: string
  inputType: string
  unit: string
  isRequired: boolean
  order: number
  isActive: boolean
  createdAt: string
}

const mockCategories: TestCategory[] = [
  {
    id: "1",
    name: "체력 테스트",
    description: "운동 능력 및 신체 역량 테스트",
    icon: "💪",
    color: "bg-blue-500",
    testCount: 12,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "2", 
    name: "기술 테스트",
    description: "종목별 전문 기술 능력 테스트",
    icon: "⚽",
    color: "bg-green-500",
    testCount: 8,
    isActive: true,
    createdAt: "2024-01-12"
  },
  {
    id: "3",
    name: "심리 테스트",
    description: "정신적 준비도 및 심리적 지구력 테스트",
    icon: "🧠",
    color: "bg-purple-500",
    testCount: 6,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "4",
    name: "심혈관 테스트",
    description: "심장 및 혈관 건강 테스트",
    icon: "❤️",
    color: "bg-red-500",
    testCount: 5,
    isActive: true,
    createdAt: "2024-01-18"
  },
  {
    id: "5",
    name: "협응력 테스트",
    description: "균형감각, 민첩성 및 협응력 테스트",
    icon: "🎯",
    color: "bg-orange-500",
    testCount: 7,
    isActive: true,
    createdAt: "2024-01-20"
  }
]

const mockTestTypes: TestType[] = [
  // 체력 테스트
  {
    id: "1",
    name: "30미터 스프린트",
    categoryId: "1",
    categoryName: "체력 테스트",
    description: "단거리 속도 테스트",
    unit: "초",
    isCalculated: false,
    fieldCount: 3,
    sessionCount: 45,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "2",
    name: "쿠퍼 테스트",
    categoryId: "1", 
    categoryName: "체력 테스트",
    description: "12분 달리기 지구력 테스트",
    unit: "미터",
    isCalculated: true,
    fieldCount: 2,
    sessionCount: 32,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    name: "수직 점프",
    categoryId: "1",
    categoryName: "체력 테스트", 
    description: "다리 근력 및 폭발적 파워 테스트",
    unit: "cm",
    isCalculated: false,
    fieldCount: 2,
    sessionCount: 38,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "4",
    name: "벤치프레스 1RM",
    categoryId: "1",
    categoryName: "체력 테스트",
    description: "최대 근력 테스트",
    unit: "kg",
    isCalculated: true,
    fieldCount: 4,
    sessionCount: 28,
    isActive: true,
    createdAt: "2024-01-11"
  },

  // 기술 테스트
  {
    id: "5",
    name: "축구 드리블링",
    categoryId: "2",
    categoryName: "기술 테스트",
    description: "콘 슬라럼 드리블링 테스트",
    unit: "초",
    isCalculated: false,
    fieldCount: 3,
    sessionCount: 22,
    isActive: true,
    createdAt: "2024-01-12"
  },
  {
    id: "6",
    name: "농구 슛 테스트",
    categoryId: "2",
    categoryName: "기술 테스트",
    description: "다양한 위치에서의 슛 정확도",
    unit: "점",
    isCalculated: true,
    fieldCount: 5,
    sessionCount: 18,
    isActive: true,
    createdAt: "2024-01-12"
  },

  // 심리 테스트
  {
    id: "7",
    name: "집중력 테스트",
    categoryId: "3",
    categoryName: "심리 테스트",
    description: "주의력 및 집중력 수준 측정",
    unit: "점",
    isCalculated: true,
    fieldCount: 8,
    sessionCount: 15,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "8",
    name: "스트레스 관리",
    categoryId: "3",
    categoryName: "심리 테스트",
    description: "스트레스 상황에서의 성과 테스트",
    unit: "점",
    isCalculated: true,
    fieldCount: 6,
    sessionCount: 12,
    isActive: true,
    createdAt: "2024-01-15"
  },

  // 심혈관 테스트
  {
    id: "9",
    name: "안정시 심박수",
    categoryId: "4",
    categoryName: "심혈관 테스트",
    description: "휴식시 심장 박동수 측정",
    unit: "회/분",
    isCalculated: false,
    fieldCount: 1,
    sessionCount: 42,
    isActive: true,
    createdAt: "2024-01-18"
  },
  {
    id: "10",
    name: "VO2 Max",
    categoryId: "4",
    categoryName: "심혈관 테스트",
    description: "최대 산소 섭취량 테스트",
    unit: "ml/kg/분",
    isCalculated: true,
    fieldCount: 4,
    sessionCount: 25,
    isActive: true,
    createdAt: "2024-01-18"
  }
]

const mockTestFields: TestField[] = [
  // 30미터 스프린트 필드
  {
    id: "1",
    testTypeId: "1",
    testTypeName: "30미터 스프린트",
    fieldName: "1차 시도",
    inputType: "number",
    unit: "초",
    isRequired: true,
    order: 1,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "2",
    testTypeId: "1",
    testTypeName: "30미터 스프린트",
    fieldName: "2차 시도",
    inputType: "number",
    unit: "초",
    isRequired: true,
    order: 2,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    testTypeId: "1",
    testTypeName: "30미터 스프린트",
    fieldName: "최고 기록",
    inputType: "number",
    unit: "초",
    isRequired: false,
    order: 3,
    isActive: true,
    createdAt: "2024-01-10"
  },

  // 쿠퍼 테스트 필드
  {
    id: "4",
    testTypeId: "2",
    testTypeName: "쿠퍼 테스트",
    fieldName: "달린 거리",
    inputType: "number",
    unit: "미터",
    isRequired: true,
    order: 1,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "5",
    testTypeId: "2",
    testTypeName: "쿠퍼 테스트",
    fieldName: "소요 시간",
    inputType: "time",
    unit: "분",
    isRequired: true,
    order: 2,
    isActive: true,
    createdAt: "2024-01-10"
  },

  // 수직 점프 필드
  {
    id: "6",
    testTypeId: "3",
    testTypeName: "수직 점프",
    fieldName: "리치 높이",
    inputType: "number",
    unit: "cm",
    isRequired: true,
    order: 1,
    isActive: true,
    createdAt: "2024-01-10"
  },
  {
    id: "7",
    testTypeId: "3",
    testTypeName: "수직 점프",
    fieldName: "점프 높이",
    inputType: "number",
    unit: "cm",
    isRequired: true,
    order: 2,
    isActive: true,
    createdAt: "2024-01-10"
  }
]

const inputTypeLabels = {
  "number": "숫자",
  "text": "텍스트",
  "time": "시간",
  "date": "날짜",
  "boolean": "예/아니오",
  "select": "선택 목록"
}

export function TestManagement() {
  const [categories, setCategories] = useState<TestCategory[]>(mockCategories)
  const [testTypes, setTestTypes] = useState<TestType[]>(mockTestTypes)
  const [testFields, setTestFields] = useState<TestField[]>(mockTestFields)
  const [activeTab, setActiveTab] = useState("categories")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTestType, setSelectedTestType] = useState<string>("all")

  // Category Management
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState<Partial<TestCategory>>({
    name: "",
    description: "",
    icon: "🏃",
    color: "bg-blue-500",
    isActive: true
  })

  // Test Type Management
  const [isAddingTestType, setIsAddingTestType] = useState(false)
  const [newTestType, setNewTestType] = useState<Partial<TestType>>({
    name: "",
    categoryId: "",
    description: "",
    unit: "",
    isCalculated: false,
    isActive: true
  })

  // Test Field Management
  const [isAddingTestField, setIsAddingTestField] = useState(false)
  const [newTestField, setNewTestField] = useState<Partial<TestField>>({
    testTypeId: "",
    fieldName: "",
    inputType: "number",
    unit: "",
    isRequired: true,
    order: 1,
    isActive: true
  })

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTestTypes = testTypes.filter(testType => {
    const matchesSearch = testType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testType.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || testType.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredTestFields = testFields.filter(field => {
    const matchesSearch = field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.testTypeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTestType = selectedTestType === "all" || field.testTypeId === selectedTestType
    return matchesSearch && matchesTestType
  })

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.description) {
      const category: TestCategory = {
        id: Date.now().toString(),
        name: newCategory.name!,
        description: newCategory.description!,
        icon: newCategory.icon!,
        color: newCategory.color!,
        testCount: 0,
        isActive: newCategory.isActive!,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setCategories([...categories, category])
      setNewCategory({
        name: "",
        description: "",
        icon: "🏃",
        color: "bg-blue-500",
        isActive: true
      })
      setIsAddingCategory(false)
    }
  }

  const handleAddTestType = () => {
    if (newTestType.name && newTestType.categoryId && newTestType.description) {
      const selectedCategory = categories.find(c => c.id === newTestType.categoryId)
      const testType: TestType = {
        id: Date.now().toString(),
        name: newTestType.name!,
        categoryId: newTestType.categoryId!,
        categoryName: selectedCategory?.name || "알 수 없음",
        description: newTestType.description!,
        unit: newTestType.unit!,
        isCalculated: newTestType.isCalculated!,
        fieldCount: 0,
        sessionCount: 0,
        isActive: newTestType.isActive!,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setTestTypes([...testTypes, testType])
      setNewTestType({
        name: "",
        categoryId: "",
        description: "",
        unit: "",
        isCalculated: false,
        isActive: true
      })
      setIsAddingTestType(false)
    }
  }

  const handleAddTestField = () => {
    if (newTestField.testTypeId && newTestField.fieldName) {
      const selectedTestType = testTypes.find(t => t.id === newTestField.testTypeId)
      const field: TestField = {
        id: Date.now().toString(),
        testTypeId: newTestField.testTypeId!,
        testTypeName: selectedTestType?.name || "알 수 없음",
        fieldName: newTestField.fieldName!,
        inputType: newTestField.inputType!,
        unit: newTestField.unit!,
        isRequired: newTestField.isRequired!,
        order: newTestField.order!,
        isActive: newTestField.isActive!,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setTestFields([...testFields, field])
      setNewTestField({
        testTypeId: "",
        fieldName: "",
        inputType: "number",
        unit: "",
        isRequired: true,
        order: 1,
        isActive: true
      })
      setIsAddingTestField(false)
    }
  }

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId))
  }

  const deleteTestType = (testTypeId: string) => {
    setTestTypes(testTypes.filter(t => t.id !== testTypeId))
  }

  const deleteTestField = (fieldId: string) => {
    setTestFields(testFields.filter(f => f.id !== fieldId))
  }

  const totalTests = testTypes.length
  const totalCategories = categories.length
  const totalFields = testFields.length
  const totalSessions = testTypes.reduce((sum, test) => sum + test.sessionCount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">테스트 관리</h1>
          <p className="text-muted-foreground mt-1">선수 테스트 및 평가 시스템을 관리하세요</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">전체 카테고리</p>
                <p className="text-2xl font-bold">{totalCategories}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">전체 테스트</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
              <TestTube className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">전체 필드</p>
                <p className="text-2xl font-bold">{totalFields}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">전체 세션</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">테스트 카테고리</TabsTrigger>
          <TabsTrigger value="types">테스트 유형</TabsTrigger>
          <TabsTrigger value="fields">테스트 필드</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="카테고리 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
            <Button onClick={() => setIsAddingCategory(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              새 카테고리
            </Button>
          </div>

          {/* Add Category Form */}
          {isAddingCategory && (
            <Card>
              <CardHeader>
                <CardTitle>새 테스트 카테고리</CardTitle>
                <CardDescription>시스템에 새로운 테스트 카테고리를 추가하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>카테고리 이름</Label>
                    <Input
                      value={newCategory.name || ""}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="예: 체력 테스트"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>아이콘</Label>
                    <Input
                      value={newCategory.icon || ""}
                      onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                      placeholder="예: 💪"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    value={newCategory.description || ""}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="카테고리 설명..."
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                  <Button onClick={handleAddCategory}>
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(category => (
              <Card key={category.id} className={`${!category.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white text-xl`}>
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge variant="secondary">{category.testCount} 테스트</Badge>
                      </div>
                    </div>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "활성" : "비활성"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
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
                            <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              이 카테고리를 삭제하시겠습니까?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCategory(category.id)}>
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
        </TabsContent>

        {/* Test Types Tab */}
        <TabsContent value="types" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="테스트 유형 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAddingTestType(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              새 테스트 유형
            </Button>
          </div>

          {/* Add Test Type Form */}
          {isAddingTestType && (
            <Card>
              <CardHeader>
                <CardTitle>새 테스트 유형</CardTitle>
                <CardDescription>시스템에 새로운 테스트 유형을 추가하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>테스트 이름</Label>
                    <Input
                      value={newTestType.name || ""}
                      onChange={(e) => setNewTestType({...newTestType, name: e.target.value})}
                      placeholder="예: 30미터 스프린트"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>카테고리</Label>
                    <Select 
                      value={newTestType.categoryId || ""} 
                      onValueChange={(value) => setNewTestType({...newTestType, categoryId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>단위</Label>
                    <Input
                      value={newTestType.unit || ""}
                      onChange={(e) => setNewTestType({...newTestType, unit: e.target.value})}
                      placeholder="예: 초, 미터, kg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    value={newTestType.description || ""}
                    onChange={(e) => setNewTestType({...newTestType, description: e.target.value})}
                    placeholder="테스트 설명..."
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingTestType(false)}>
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                  <Button onClick={handleAddTestType}>
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Types List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTestTypes.map(testType => (
              <Card key={testType.id} className={`${!testType.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{testType.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{testType.categoryName}</Badge>
                        <Badge variant="secondary">{testType.unit}</Badge>
                        {testType.isCalculated && <Badge variant="default">계산됨</Badge>}
                      </div>
                    </div>
                    <Badge variant={testType.isActive ? "default" : "secondary"}>
                      {testType.isActive ? "활성" : "비활성"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{testType.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">{testType.fieldCount}</div>
                      <div className="text-xs text-blue-800">필드</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-semibold text-green-600">{testType.sessionCount}</div>
                      <div className="text-xs text-green-800">세션</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      {new Date(testType.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
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
                            <AlertDialogTitle>테스트 유형 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              이 테스트 유형을 삭제하시겠습니까?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTestType(testType.id)}>
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
        </TabsContent>

        {/* Test Fields Tab */}
        <TabsContent value="fields" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="테스트 필드 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={selectedTestType} onValueChange={setSelectedTestType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 테스트 유형</SelectItem>
                  {testTypes.map(testType => (
                    <SelectItem key={testType.id} value={testType.id}>
                      {testType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAddingTestField(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              새 테스트 필드
            </Button>
          </div>

          {/* Add Test Field Form */}
          {isAddingTestField && (
            <Card>
              <CardHeader>
                <CardTitle>새 테스트 필드</CardTitle>
                <CardDescription>시스템에 새로운 테스트 필드를 추가하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>테스트 유형</Label>
                    <Select 
                      value={newTestField.testTypeId || ""} 
                      onValueChange={(value) => setNewTestField({...newTestField, testTypeId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="테스트 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {testTypes.map(testType => (
                          <SelectItem key={testType.id} value={testType.id}>
                            {testType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>필드 이름</Label>
                    <Input
                      value={newTestField.fieldName || ""}
                      onChange={(e) => setNewTestField({...newTestField, fieldName: e.target.value})}
                      placeholder="예: 1차 시도"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>입력 유형</Label>
                    <Select 
                      value={newTestField.inputType || ""} 
                      onValueChange={(value) => setNewTestField({...newTestField, inputType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(inputTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>단위</Label>
                    <Input
                      value={newTestField.unit || ""}
                      onChange={(e) => setNewTestField({...newTestField, unit: e.target.value})}
                      placeholder="예: 초, cm, kg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>순서</Label>
                    <Input
                      type="number"
                      value={newTestField.order || 1}
                      onChange={(e) => setNewTestField({...newTestField, order: parseInt(e.target.value)})}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingTestField(false)}>
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                  <Button onClick={handleAddTestField}>
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Fields List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTestFields.map(field => (
              <Card key={field.id} className={`${!field.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{field.fieldName}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{field.testTypeName}</Badge>
                        <Badge variant="secondary">{inputTypeLabels[field.inputType as keyof typeof inputTypeLabels]}</Badge>
                        {field.isRequired && <Badge variant="default">필수</Badge>}
                      </div>
                    </div>
                    <Badge variant={field.isActive ? "default" : "secondary"}>
                      {field.isActive ? "활성" : "비활성"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">단위: {field.unit}</span>
                    <span className="text-sm text-muted-foreground">순서: {field.order}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      {new Date(field.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
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
                            <AlertDialogTitle>테스트 필드 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              이 테스트 필드를 삭제하시겠습니까?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTestField(field.id)}>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}