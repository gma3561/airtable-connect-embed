import { PostgrestError } from "@supabase/supabase-js";
import { PropertyListItem } from "../domain/Property.js";
import { PropertySearchQuery } from "../domain/SearchQuery.js";
import { getSupabaseServiceClient } from "../infra/SupabaseClient.js";

export class SupabasePropertyRepository {
  async search(query: PropertySearchQuery): Promise<PropertyListItem[]> {
    const client = getSupabaseServiceClient();

    const { data, error } = await client.rpc(
      "search_properties",
      {
        q: query.text ?? null,
        f_property_type: query.propertyType ?? null,
        f_transaction_type: query.transactionType ?? null,
        f_property_status: query.propertyStatus ?? null,
        f_agent: query.agent ?? null,
        f_shared_only: query.sharedOnly ?? null,
        limit_count: query.limit ?? 50,
        offset_count: query.offset ?? 0
      }
    );

    if (error) {
      throw new Error(`Supabase RPC failed: ${(error as PostgrestError).message}`);
    }

    return (data ?? []).map((row: any): PropertyListItem => ({
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
      updatedAt: row.updated_at
    }));
  }
}
