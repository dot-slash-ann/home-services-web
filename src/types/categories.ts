export interface Category {
  id: number;
  name: string;
}

export interface CategoriesListResponse {
  data: Category[];
}

export interface CategoryResponse {
  data: Category;
}
