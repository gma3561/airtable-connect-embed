import { supabase } from '../lib/supabase';
import type { PropertyListResponse, SearchParams, PropertyCreateRequest, PropertyListItem, PropertyDetail } from "../types";

/**
 * Fetches property list data based on search parameters using Supabase RPC
 */
export const fetchProperties = async (params: SearchParams): Promise<PropertyListResponse> => {
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

  const items: PropertyListItem[] = (data ?? []).map((row: any) => ({
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
    address: row.address ?? null,
    updatedAt: row.updated_at,
  }));

  return { items };
};

/**
 * Fetches a single property by ID
 */
export const fetchPropertyById = async (id: string): Promise<PropertyDetail> => {
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