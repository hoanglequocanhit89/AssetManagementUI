export interface Category {
  id: number;
  name: string;
  prefix: string;
}

export type CategoryListResponse = Omit<Category, "prefix">

export type CreateCategoryRequest = Omit<Category, "id">