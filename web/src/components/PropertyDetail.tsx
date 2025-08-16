import { useParams, Link } from 'react-router-dom'
import { usePropertyDetail } from '../hooks/usePropertyDetail'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
// import Badge from './Badge'

type PropertyDetailProps = { id?: string }

const PropertyDetail = ({ id: idProp }: PropertyDetailProps) => {
  const { id: routeId } = useParams<{ id: string }>()
  const id = idProp ?? routeId

  // Fetch property details using our custom hook
  const { data: property, isLoading, isError, error, refetch } = usePropertyDetail(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        {!idProp && (
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
        )}
        <LoadingState rows={10} />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="space-y-6">
        {!idProp && (
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
        )}
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
      {!idProp && (
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
            to={`/property/${property.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            수정
          </Link>
        </div>
      )}

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
            <label className="block text-sm font-medium text-gray-700">재등록 사유</label>
            <p className="mt-1 text-sm text-gray-900">{(property as any).reregistrationReason || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">등록일</label>
            <p className="mt-1 text-sm text-gray-900">{property.registrationDate || '-'}</p>
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
            <label className="block text-sm font-medium text-gray-700">임차금액</label>
            <p className="mt-1 text-sm text-gray-900">{(property as any).rentalAmount || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">계약기간</label>
            <p className="mt-1 text-sm text-gray-900">{(property as any).contractPeriod || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">거주자</label>
            <p className="mt-1 text-sm text-gray-900">{(property as any).resident || '-'}</p>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">상세 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">담당자 메모</label>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{(property as any).agentMemo || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">특이사항</label>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{(property as any).specialNotes || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">거래완료날짜</label>
            <p className="mt-1 text-sm text-gray-900">{(property as any).completionDate || '-'}</p>
          </div>
        </div>
      </div>

      {/* 첨부 파일 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">첨부 파일</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">사진</label>
            <p className="mt-1 text-sm text-gray-900">{(property as any).photos?.length ? `${(property as any).photos.length}개` : '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">영상</label>
            <p className="mt-1 text-sm text-gray-900">{(property as any).videos?.length ? `${(property as any).videos.length}개` : '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">문서</label>
            <p className="mt-1 text-sm text-gray-900">{(property as any).documents?.length ? `${(property as any).documents.length}개` : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton removed (unused)


export default PropertyDetail
