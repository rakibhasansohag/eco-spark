export interface IQueryParams {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
  fields?: string;
  include?: string;
  [key: string]: string | undefined;
}
