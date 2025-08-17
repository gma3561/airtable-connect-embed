import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Building2, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { usePropertySearch } from '../hooks/usePropertySearch'
import type { PropertyListItem } from '../types'

export function Dashboard() {
  // Fetch all properties to calculate statistics
  const { data } = usePropertySearch({ limit: 10000 })
  
  const properties = data?.items || []
  
  // Calculate statistics
  const totalProperties = properties.length
  const availableProperties = properties.filter((p: PropertyListItem) => p.propertyStatus === '거래가능').length
  const completedDeals = properties.filter((p: PropertyListItem) => 
    p.propertyStatus === '거래완료' || p.propertyStatus === '계약완료'
  ).length
  const recentProperties = properties.filter((p: PropertyListItem) => {
    if (!p.registrationDate) return false
    const date = new Date(p.registrationDate)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return date >= thirtyDaysAgo
  }).length

  const stats = [
    {
      title: "전체 매물",
      value: totalProperties.toLocaleString(),
      description: "등록된 전체 매물 수",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "거래 가능",
      value: availableProperties.toLocaleString(),
      description: "현재 거래 가능한 매물",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "최근 등록",
      value: recentProperties.toLocaleString(),
      description: "최근 30일 내 등록",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "거래 완료",
      value: completedDeals.toLocaleString(),
      description: "완료된 거래 수",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  // Get recent properties
  const recent = properties.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Properties */}
      <Card>
        <CardHeader>
          <CardTitle>최근 등록 매물</CardTitle>
          <CardDescription>
            최근에 등록된 매물 목록입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                등록된 매물이 없습니다
              </p>
            ) : (
              recent.map((property: PropertyListItem) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{property.propertyName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{property.propertyType}</span>
                      <span>{property.transactionType}</span>
                      <span>{property.price}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={property.propertyStatus === '거래가능' ? 'default' : 'secondary'}
                  >
                    {property.propertyStatus}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}