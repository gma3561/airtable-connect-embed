import { useParams, Link } from 'react-router-dom'
import { usePropertyDetail } from '../hooks/usePropertyDetail'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
// import Badge from './Badge'

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>()

  // Fetch property details using our custom hook
  const { data: property, isLoading, isError, error, refetch } = usePropertyDetail(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>목록으로</span>
          </Link>
        </div>
        <LoadingState rows={10} />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>목록으로</span>
          </Link>
        </div>
        <ErrorState 
          message={error instanceof Error ? error.message : "매물 정보를 불러올 수 없습니다."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Link 
          to="/"
          className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>목록으로</span>
        </Link>
        <Link 
          to={`/property/edit/${property.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          수정
        </Link>
      </div>

      {/* 매물 제목 및 메타 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.propertyName}</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
            property.propertyStatus === '거래가능' ? 'bg-blue-100 text-blue-800' :
            property.propertyStatus === '계약중' ? 'bg-yellow-100 text-yellow-800' :
            property.propertyStatus === '계약완료' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {property.propertyStatus}
          </span>
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
            {property.propertyType}
          </span>
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
            {property.transactionType}
          </span>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
            property.sharedStatus ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {property.sharedStatus ? '공유' : '비공유'}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          담당자: <span className="font-medium text-gray-900">{property.agent}</span>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">주소</label>
            <p className="mt-1 text-sm text-gray-900">{property.address}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">동/호</label>
            <p className="mt-1 text-sm text-gray-900">
              {property.buildingDong && property.buildingHo 
                ? `${property.buildingDong} ${property.buildingHo}` 
                : '-'
              }
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">준공일</label>
            <p className="mt-1 text-sm text-gray-900">{property.completionDate || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">등록일</label>
            <p className="mt-1 text-sm text-gray-900">
              {property.registrationDate ? new Date(property.registrationDate).toLocaleDateString('ko-KR') : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* 거래 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">거래 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">매매가/보증금</label>
            <p className="mt-1 text-sm text-gray-900">{property.price || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">월세</label>
            <p className="mt-1 text-sm text-gray-900">{property.rentalAmount || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">계약기간</label>
            <p className="mt-1 text-sm text-gray-900">{property.contractPeriod || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">거주자</label>
            <p className="mt-1 text-sm text-gray-900">{property.resident || '-'}</p>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">상세 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">담당자 메모</label>
            <p className="mt-1 text-sm text-gray-900">{property.agentMemo || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">특이사항</label>
            <p className="mt-1 text-sm text-gray-900">{property.specialNotes || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">재등록 사유</label>
            <p className="mt-1 text-sm text-gray-900">{property.reregistrationReason || '-'}</p>
          </div>
        </div>
      </div>

      {/* 첨부 파일 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">첨부 파일</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">사진</label>
            <p className="mt-1 text-sm text-gray-900">
              {property.photos.length > 0 ? `${property.photos.length}개` : '없음'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">영상</label>
            <p className="mt-1 text-sm text-gray-900">
              {property.videos.length > 0 ? `${property.videos.length}개` : '없음'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">문서</label>
            <p className="mt-1 text-sm text-gray-900">
              {property.documents.length > 0 ? `${property.documents.length}개` : '없음'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const DetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
      
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j}>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}


export default PropertyDetail
