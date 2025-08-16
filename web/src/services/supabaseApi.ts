import { supabase } from '../lib/supabase';
import type { PropertyListResponse, SearchParams, PropertyCreateRequest, PropertyListItem } from "../types";

/**
 * Fetches property list data based on search parameters using Supabase RPC
 */
export const fetchProperties = async (params: SearchParams): Promise<PropertyListResponse> => {
  const { data, error } = await supabase.rpc('search_properties', {
    q: params.q || null,
    f_property_type: params.propertyType || null,
    f_transaction_type: params.transactionType || null,
    f_property_status: params.propertyStatus || null,
    f_agent: params.agent || null,
    f_shared_only: params.sharedOnly || null,
    limit_count: params.limit || 50,
    offset_count: params.offset || 0
  });

  if (error) {
    throw new Error(error.message);
  }

  return { items: data || [] };
};

/**
 * Fetches a single property by ID
 */
export const fetchPropertyById = async (id: string): Promise<PropertyListItem> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Map snake_case to camelCase
  const result: any = {
    id: data.id,
    registrationDate: data.registration_date,
    sharedStatus: data.shared_status,
    agent: data.agent,
    propertyStatus: data.property_status,
    propertyType: data.property_type,
    transactionType: data.transaction_type,
    price: data.price,
    propertyName: data.property_name,
    buildingDong: data.building_dong,
    buildingHo: data.building_ho,
    address: data.address,
    updatedAt: data.updated_at
  };

  // Add optional fields if they exist
  if (data.contract_period) result.contractPeriod = data.contract_period;
  if (data.rental_amount) result.rentalAmount = data.rental_amount;
  if (data.rental_type) result.rentalType = data.rental_type;
  if (data.resident) result.resident = data.resident;
  if (data.completion_date) result.completionDate = data.completion_date;
  if (data.reregistration_reason) result.reregistrationReason = data.reregistration_reason;
  if (data.agent_memo) result.agentMemo = data.agent_memo;
  if (data.special_notes) result.specialNotes = data.special_notes;
  if (data.photos) result.photos = data.photos;
  if (data.videos) result.videos = data.videos;
  if (data.documents) result.documents = data.documents;

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