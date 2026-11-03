export type StudioSort = "newest" | "rating" | "price-asc" | "price-desc";

export interface StudioFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: StudioSort;
}
