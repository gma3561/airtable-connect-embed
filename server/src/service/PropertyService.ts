import { PropertySearchQuery } from "../domain/SearchQuery.js";
import { PropertyListItem } from "../domain/Property.js";
import { SupabasePropertyRepository } from "../repository/SupabasePropertyRepository.js";

export class PropertyService {
  private readonly repository: SupabasePropertyRepository;

  constructor(repository?: SupabasePropertyRepository) {
    this.repository = repository ?? new SupabasePropertyRepository();
  }

  async search(query: PropertySearchQuery): Promise<PropertyListItem[]> {
    return this.repository.search(query);
  }

  async create(payload: Record<string, unknown>): Promise<string> {
    // Map camelCase to snake_case for DB
    const dbPayload: Record<string, any> = mapCamelToSnakeForDb(payload);
    return this.repository.create(dbPayload);
  }

  async update(id: string, payload: Record<string, unknown>): Promise<void> {
    const dbPayload: Record<string, any> = mapCamelToSnakeForDb(payload);
    await this.repository.update(id, dbPayload);
  }
}

function mapCamelToSnakeForDb(input: Record<string, unknown>): Record<string, any> {
  const mapping: Record<string, string> = {
    propertyName: 'property_name',
    address: 'address',
    buildingDong: 'building_dong',
    buildingHo: 'building_ho',
    propertyType: 'property_type',
    transactionType: 'transaction_type',
    propertyStatus: 'property_status',
    price: 'price',
    contractPeriod: 'contract_period',
    rentalAmount: 'rental_amount',
    rentalType: 'rental_type',
    resident: 'resident',
    completionDate: 'completion_date',
    reregistrationReason: 'reregistration_reason',
    agentMemo: 'agent_memo',
    specialNotes: 'special_notes',
    registrationDate: 'registration_date',
    sharedStatus: 'shared_status',
    agent: 'agent'
  };
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    const dbKey = mapping[key] ?? key;
    out[dbKey] = value;
  }
  return out;
}
