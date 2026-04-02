export interface ICategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCategoryPayload {
  name: string;
  slug?: string;
}

export interface IUpdateCategoryPayload {
  name?: string;
  slug?: string;
}
