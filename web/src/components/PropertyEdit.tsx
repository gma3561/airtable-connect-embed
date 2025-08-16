import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchPropertyById, updateProperty, deleteProperty } from '../services/supabaseApi'
import type { PropertyCreateRequest } from '../types'

const PropertyEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PropertyCreateRequest>({
    propertyName: '',
    address: '',
    agent: '',
    propertyType: '',
    transactionType: '',
    propertyStatus: '',
    sharedStatus: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const property = await fetchPropertyById(id);
        
        // Map PropertyListItem to PropertyCreateRequest format
        setForm({
          propertyName: property.propertyName || '',
          address: property.address || '',
          buildingDong: property.buildingDong || '',
          buildingHo: property.buildingHo || '',
          agent: property.agent || '',
          propertyType: property.propertyType || '',
          transactionType: property.transactionType || '',
          propertyStatus: property.propertyStatus || '',
          price: property.price || '',
          sharedStatus: property.sharedStatus || false
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '매물 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!form.propertyName.trim()) {
      setError('매물명은 필수입니다.');
      return;
    }
    
    if (!id) {
      setError('매물 ID가 없습니다.');
      return;
    }
    
    try {
      setSubmitting(true);
      await updateProperty(id, form);
      navigate(`/property/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '수정 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!id) return;
    
    if (!window.confirm('정말로 이 매물을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      setDeleting(true);
      await deleteProperty(id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Link 
          to={`/property/${id}`}
          className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>상세보기로</span>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">매물 수정</h1>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">매물명 *</label>
              <input 
                name="propertyName" 
                value={form.propertyName} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2" 
                placeholder="예: 한남 트윈빌" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">소재지</label>
              <input 
                name="address" 
                value={form.address || ''} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2" 
                placeholder="예: 한남동 26-10" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
              <input 
                name="agent" 
                value={form.agent || ''} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">매물종류</label>
              <input 
                name="propertyType" 
                value={form.propertyType || ''} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2" 
                placeholder="아파트/오피스텔 등" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">거래유형</label>
              <input 
                name="transactionType" 
                value={form.transactionType || ''} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2" 
                placeholder="매매/전세/월세" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">매물상태</label>
              <input 
                name="propertyStatus" 
                value={form.propertyStatus || ''} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2" 
                placeholder="거래가능/거래완료 등" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
              <input 
                name="price" 
                value={form.price || ''} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2" 
                placeholder="예: 10억 5000" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">건물 동</label>
              <input 
                name="buildingDong" 
                value={form.buildingDong || ''} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">건물 호</label>
              <input 
                name="buildingHo" 
                value={form.buildingHo || ''} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2" 
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              id="sharedStatus" 
              type="checkbox" 
              name="sharedStatus" 
              checked={!!form.sharedStatus} 
              onChange={onChange} 
              className="h-4 w-4" 
            />
            <label htmlFor="sharedStatus" className="text-sm text-gray-700">공유 매물</label>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-3">
              <button 
                disabled={submitting || deleting} 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? '저장 중...' : '저장'}
              </button>
              <Link 
                to={`/property/${id}`} 
                className="px-4 py-2 rounded-lg border text-gray-700"
              >
                취소
              </Link>
            </div>
            <button
              type="button"
              onClick={onDelete}
              disabled={submitting || deleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyEdit