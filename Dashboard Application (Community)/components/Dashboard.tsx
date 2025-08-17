import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Building2, Users, Trophy, TrendingUp, Plus, Eye, TestTube, Calendar } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const statsData = [
  { title: "전체 클럽", value: "156", change: "+12", icon: Building2, color: "text-blue-600", bgColor: "bg-blue-50" },
  { title: "활성 회원", value: "24,847", change: "+1,205", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
  { title: "테스트 세션", value: "1,248", change: "+89", icon: Calendar, color: "text-purple-600", bgColor: "bg-purple-50" },
  { title: "활성 테스트", value: "47", change: "+5", icon: TestTube, color: "text-orange-600", bgColor: "bg-orange-50" },
]

const monthlyData = [
  { month: "1월", clubs: 120, members: 18500 },
  { month: "2월", clubs: 125, members: 19200 },
  { month: "3월", clubs: 132, members: 20100 },
  { month: "4월", clubs: 138, members: 21300 },
  { month: "5월", clubs: 145, members: 22800 },
  { month: "6월", clubs: 152, members: 24200 },
  { month: "7월", clubs: 156, members: 24847 },
]

const sportsData = [
  { name: "축구", value: 45, color: "#8884d8" },
  { name: "농구", value: 30, color: "#82ca9d" },
  { name: "배구", value: 25, color: "#ffc658" },
  { name: "수영", value: 20, color: "#ff7300" },
  { name: "테니스", value: 15, color: "#00ff88" },
  { name: "기타", value: 21, color: "#ff8888" },
]

const recentActivities = [
  { type: "테스트 완료", description: "김철수 - 30미터 스프린트 테스트 완료", time: "1시간 전", color: "bg-green-100 text-green-800" },
  { type: "신규 클럽", description: "서울 청소년 SC 등록이 완료되었습니다", time: "2시간 전", color: "bg-green-100 text-green-800" },
  { type: "테스트 계획", description: "5명의 선수에 대한 쿠퍼 테스트가 계획되었습니다", time: "3시간 전", color: "bg-blue-100 text-blue-800" },
  { type: "업데이트", description: "부산 스포츠클럽 정보가 업데이트되었습니다", time: "4시간 전", color: "bg-blue-100 text-blue-800" },
  { type: "테스트 승인", description: "12개 테스트 결과가 승인 대기 중입니다", time: "6시간 전", color: "bg-yellow-100 text-yellow-800" },
  { type: "종목 추가", description: "태권도 종목이 시스템에 추가되었습니다", time: "1일 전", color: "bg-purple-100 text-purple-800" },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">환영합니다!</h1>
          <p className="text-muted-foreground">시스템 전체 현황 및 최근 활동</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            보고서 보기
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            새 클럽
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span>{stat.change} 이번 달</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>월별 성장</CardTitle>
            <CardDescription>클럽 및 회원 수 증가 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clubs" stroke="#8884d8" strokeWidth={2} name="클럽 수" />
                <Line type="monotone" dataKey="members" stroke="#82ca9d" strokeWidth={2} name="회원 수" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sports Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>종목 분포</CardTitle>
            <CardDescription>스포츠 종목별 클럽 분포 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sportsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sportsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {sportsData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
          <CardDescription>시스템에서의 최근 작업 및 업데이트</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <Badge variant="secondary" className={activity.color}>
                  {activity.type}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}