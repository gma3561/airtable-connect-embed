import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { PropertyListResponse, SearchParams, PropertyCreateRequest, PropertyListItem, PropertyDetail } from "../types";

/**
 * Fetches property list data based on search parameters using Supabase RPC
 */
export const fetchProperties = async (params: SearchParams): Promise<PropertyListResponse> => {
  // 로컬 미설정 시, 임시 목데이터로 프리뷰 가능하게 처리
  if (!isSupabaseConfigured) {
    const items: PropertyListItem[] = Array.from({ length: 25 }).map((_, i) => ({
      id: `${i + 1}`,
      registrationDate: '2025-08-12',
      sharedStatus: i % 2 === 0,
      agent: ['성문이', '서지혜', '정선혜'][i % 3],
      propertyStatus: ['거래가능', '매물확인됨', '거래완료'][i % 3],
      propertyType: ['아파트', '빌라/연립', '오피스텔', '단독주택'][i % 4],
      transactionType: ['매매', '전세', '월세', '렌트'][i % 4],
      price: i % 4 === 0 ? '45억' : i % 4 === 1 ? '20억' : i % 4 === 2 ? '2억/600' : '2,100/700',
      propertyName: ['동일파크스위트', '건영빌라', '공신아파트', '타워팰리스'][i % 4],
      buildingDong: ['-', '101', 'A', 'B'][i % 4],
      buildingHo: ['801', '201', '1303', '402'][i % 4],
      areaSupplySqm: ['171.19', '194.39', '175.13', '223.68'][i % 4],
      areaExclusiveSqm: ['148.75', '174.52', '149.34', '204.2'][i % 4],
      areaSupplyPy: ['51.78', '58.88', '52.97', '67.63'][i % 4],
      areaExclusivePy: ['44.99', '52.79', '45.17', '61.24'][i % 4],
      floor: ['8', '2', '13', '11'][i % 4],
      floorsTotal: ['13', '3', '18', '15'][i % 4],
      address: '삼성동 100-14',
      updatedAt: new Date().toISOString(),
    }))
    return { items }
  }

  const { data, error } = await supabase.rpc('search_properties', {
    q: params.q ?? null,
    f_property_type: params.propertyType ?? null,
    f_transaction_type: params.transactionType ?? null,
    f_property_status: params.propertyStatus ?? null,
    f_agent: params.agent ?? null,
    f_shared_only: params.sharedOnly ?? null,
    limit_count: params.limit ?? 100,
    offset_count: params.offset ?? 0,
  });

  if (error) {
    throw new Error(error.message);
  }

  const items: PropertyListItem[] = (data ?? []).map((row: any) => {
    // Heuristic: if row has `fields` JSON, map from Airtable-like structure
    if (row && row.fields) {
      const f = row.fields || {}
      const registrationDate = (row.createdTime || '').slice(0, 10) || null
      const propertyName = f['매물명'] ?? f['매물명 '] ?? null
      const propertyType = f['매물종류'] ?? f['매물종류'] ?? f['매물종류 '] ?? null
      const propertyStatus = f['매물상태'] ?? f['매물상태 '] ?? null
      const agent = f['담당자'] ?? null
      const price = f['금액'] ?? f['가격'] ?? null
      const buildingDong = f['동'] ?? null
      const buildingHo = f['호'] ?? null
      const sharedRaw = f['공유'] ?? f['공유여부']
      const sharedStatus = typeof sharedRaw === 'boolean' ? sharedRaw : sharedRaw === '공유' ? true : sharedRaw === '비공유' ? false : null
      const areaM = f['공급/전용(㎡)'] ?? null
      const areaP = f['공급/전용(평)'] ?? null
      const parsePair = (val: string | null, unit: string) => {
        if (!val || typeof val !== 'string') return [null, null]
        const m = val.replace(/\s/g, '').split('/')
        const a = m[0]?.replace(unit, '')
        const b = m[1]?.replace(unit, '')
        return [Number(a), Number(b)]
      }
      const [areaSupplySqm, areaExclusiveSqm] = parsePair(areaM, '㎡')
      const [areaSupplyPy, areaExclusivePy] = parsePair(areaP, '평')
      const floorPair = (f['층/총층'] as string) || ''
      const parseFloor = (val: string) => {
        const m = val.match(/(\d+)\/(\d+)/)
        if (!m) return [null, null]
        return [Number(m[1]), Number(m[2])]
      }
      const [floor, floorsTotal] = parseFloor(floorPair)
      return {
        id: String(row.id),
        registrationDate,
        sharedStatus,
        agent: agent ?? null,
        propertyStatus: propertyStatus ?? null,
        propertyType: propertyType ?? null,
        transactionType: f['거래유형'] ?? null,
        price: price ?? null,
        propertyName: propertyName ?? null,
        buildingDong: buildingDong ?? null,
        buildingHo: buildingHo ?? null,
        areaSupplySqm: Number.isFinite(areaSupplySqm) ? areaSupplySqm : null,
        areaExclusiveSqm: Number.isFinite(areaExclusiveSqm) ? areaExclusiveSqm : null,
        areaSupplyPy: Number.isFinite(areaSupplyPy) ? areaSupplyPy : null,
        areaExclusivePy: Number.isFinite(areaExclusivePy) ? areaExclusivePy : null,
        floor: Number.isFinite(floor) ? floor : null,
        floorsTotal: Number.isFinite(floorsTotal) ? floorsTotal : null,
        address: f['소재지'] ?? f['주소'] ?? null,
        updatedAt: row.updated_at || new Date().toISOString(),
      }
    }

    // Default mapping for normalized rows
    return {
      id: row.id,
      registrationDate: row.registration_date ?? null,
      sharedStatus: row.shared_status ?? null,
      agent: row.agent ?? null,
      propertyStatus: row.property_status ?? null,
      propertyType: row.property_type ?? null,
      transactionType: row.transaction_type ?? null,
      price: row.price ?? null,
      propertyName: row.property_name ?? null,
      buildingDong: row.building_dong ?? null,
      buildingHo: row.building_ho ?? null,
      areaSupplySqm: row.area_supply_sqm ?? null,
      areaExclusiveSqm: row.area_exclusive_sqm ?? null,
      areaSupplyPy: row.area_supply_py ?? null,
      areaExclusivePy: row.area_exclusive_py ?? null,
      floor: row.floor ?? null,
      floorsTotal: row.floors_total ?? null,
      address: row.address ?? null,
      updatedAt: row.updated_at,
    }
  });

  return { items };
};

/**
 * Fetches a single property by ID
 */
export const fetchPropertyById = async (id: string): Promise<PropertyDetail> => {
  if (!isSupabaseConfigured) {
    // 목데이터 단건 상세
    return {
      id,
      registrationDate: '2025-08-12',
      sharedStatus: true,
      agent: '성문이',
      propertyStatus: '거래가능',
      propertyType: '아파트',
      transactionType: '매매',
      price: '45억',
      propertyName: '동일파크스위트',
      buildingDong: '101',
      buildingHo: '801',
      address: '삼성동 100-14',
      updatedAt: new Date().toISOString(),
      contractPeriod: null,
      rentalAmount: null,
      rentalType: null,
      resident: null,
      completionDate: null,
      reregistrationReason: '-',
      agentMemo: '한강뷰\n보은서구, 골드스 도보권거리\n보은초, 보은중, 경기고 등 최고의 학교',
      specialNotes: '조용하고 관리 잘 된 단지',
      photos: [],
      videos: [],
      documents: []
    }
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Map snake_case to typed camelCase
  const result: PropertyDetail = {
    id: data.id,
    registrationDate: data.registration_date ?? null,
    sharedStatus: data.shared_status ?? null,
    agent: data.agent ?? null,
    propertyStatus: data.property_status ?? null,
    propertyType: data.property_type ?? null,
    transactionType: data.transaction_type ?? null,
    price: data.price ?? null,
    propertyName: data.property_name ?? null,
    buildingDong: data.building_dong ?? null,
    buildingHo: data.building_ho ?? null,
    address: data.address ?? null,
    updatedAt: data.updated_at,
    contractPeriod: data.contract_period ?? null,
    rentalAmount: data.rental_amount ?? null,
    rentalType: data.rental_type ?? null,
    resident: data.resident ?? null,
    completionDate: data.completion_date ?? null,
    reregistrationReason: data.reregistration_reason ?? null,
    agentMemo: data.agent_memo ?? null,
    specialNotes: data.special_notes ?? null,
    photos: data.photos ?? null,
    videos: data.videos ?? null,
    documents: data.documents ?? null,
  };

  return result;
};

/**
 * Creates a new property
 */
export const createProperty = async (body: PropertyCreateRequest): Promise<{ id: string }> => {
  // Map camelCase to snake_case for DB
  const dbPayload = {
    property_name: body.propertyName,
    address: body.address,
    building_dong: body.buildingDong,
    building_ho: body.buildingHo,
    property_type: body.propertyType,
    transaction_type: body.transactionType,
    property_status: body.propertyStatus,
    price: body.price,
    contract_period: body.contractPeriod,
    rental_amount: body.rentalAmount,
    rental_type: body.rentalType,
    resident: body.resident,
    completion_date: body.completionDate,
    reregistration_reason: body.reregistrationReason,
    agent_memo: body.agentMemo,
    special_notes: body.specialNotes,
    registration_date: body.registrationDate,
    shared_status: body.sharedStatus,
    agent: body.agent
  };

  const { data, error } = await supabase
    .from('properties')
    .insert(dbPayload)
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { id: data.id };
};

/**
 * Updates an existing property
 */
export const updateProperty = async (id: string, body: PropertyCreateRequest): Promise<void> => {
  const dbPayload = {
    property_name: body.propertyName,
    address: body.address,
    building_dong: body.buildingDong,
    building_ho: body.buildingHo,
    property_type: body.propertyType,
    transaction_type: body.transactionType,
    property_status: body.propertyStatus,
    price: body.price,
    contract_period: body.contractPeriod,
    rental_amount: body.rentalAmount,
    rental_type: body.rentalType,
    resident: body.resident,
    completion_date: body.completionDate,
    reregistration_reason: body.reregistrationReason,
    agent_memo: body.agentMemo,
    special_notes: body.specialNotes,
    registration_date: body.registrationDate,
    shared_status: body.sharedStatus,
    agent: body.agent
  };

  const { error } = await supabase
    .from('properties')
    .update(dbPayload)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Deletes a property by ID
 */
export const deleteProperty = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};