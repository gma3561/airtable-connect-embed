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
}
