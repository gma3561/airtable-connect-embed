import { PropertyListItem } from "../domain/Property.js";
import { PropertySearchQuery } from "../domain/SearchQuery.js";

export interface PropertyRepository {
  search(query: PropertySearchQuery): Promise<PropertyListItem[]>;
  findById(id: string): Promise<PropertyListItem | null>;
  delete(id: string): Promise<void>;
}
