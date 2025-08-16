import { PropertyListItem } from "../domain/Property.js";
import { PropertySearchQuery } from "../domain/SearchQuery.js";

export interface PropertyRepository {
  search(query: PropertySearchQuery): Promise<PropertyListItem[]>;
}
