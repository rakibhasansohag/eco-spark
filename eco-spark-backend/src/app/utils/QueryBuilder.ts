import { IQueryParams } from "../interfaces/query.interface.js";

interface PrismaDelegate {
  findMany(args?: Record<string, unknown>): Promise<unknown[]>;
  count(args?: Record<string, unknown>): Promise<number>;
}

interface QueryBuilderOptions {
  searchableFields?: string[];
  filterableFields?: string[];
}

class QueryBuilder {
  private readonly model: PrismaDelegate;
  private readonly query: IQueryParams;
  private readonly options: QueryBuilderOptions;

  private whereClause: Record<string, unknown> = {};
  private skip = 0;
  private take = 10;
  private orderBy: Record<string, string>[] = [{ createdAt: "desc" }];
  private includeClause: Record<string, unknown> = {};

  constructor(
    model: PrismaDelegate,
    query: IQueryParams,
    options: QueryBuilderOptions = {}
  ) {
    this.model = model;
    this.query = query;
    this.options = options;
  }

  search(): this {
    const searchTerm = this.query.searchTerm as string | undefined;
    const { searchableFields = [] } = this.options;

    if (searchTerm && searchableFields.length > 0) {
      const searchConditions = searchableFields.map((field) => {
        const parts = field.split(".");
        if (parts.length === 1) {
          return { [field]: { contains: searchTerm, mode: "insensitive" } };
        }
        const [relation, nestedField] = parts;
        return {
          [relation as string]: {
            [nestedField as string]: { contains: searchTerm, mode: "insensitive" },
          },
        };
      });

      this.whereClause = {
        ...this.whereClause,
        OR: searchConditions,
      };
    }
    return this;
  }

  filter(): this {
    const { searchTerm: _s, page: _p, limit: _l, sortBy: _sb, sortOrder: _so, fields: _f, include: _i, ...rest } =
      this.query;
    const { filterableFields = [] } = this.options;

    const filters: Record<string, unknown> = {};
    for (const [key, rawValue] of Object.entries(rest)) {
      if (filterableFields.includes(key) && rawValue !== undefined) {
        const value = typeof rawValue === "string" ? rawValue : String(rawValue);
        if (value === "true") filters[key] = true;
        else if (value === "false") filters[key] = false;
        else filters[key] = value;
      }
    }

    this.whereClause = { ...this.whereClause, ...filters };
    return this;
  }

  paginate(): this {
    const page = Math.max(1, parseInt((this.query.page as string | undefined) ?? "1", 10));
    const limit = Math.min(100, parseInt((this.query.limit as string | undefined) ?? "10", 10));
    this.skip = (page - 1) * limit;
    this.take = limit;
    return this;
  }

  sort(): this {
    const sortBy = (this.query.sortBy as string | undefined) ?? "createdAt";
    const sortOrder = (this.query.sortOrder as string | undefined) ?? "desc";
    this.orderBy = [{ [sortBy]: sortOrder }];
    return this;
  }

  include(): this {
    const include = this.query.include as string | undefined;
    if (include) {
      for (const key of include.split(",")) {
        this.includeClause[key.trim()] = true;
      }
    }
    return this;
  }

  async execute(): Promise<{ data: unknown[]; meta: { page: number; limit: number } }> {
    const page = Math.max(1, parseInt((this.query.page as string | undefined) ?? "1", 10));
    const limit = Math.min(100, parseInt((this.query.limit as string | undefined) ?? "10", 10));

    const data = await this.model.findMany({
      where: this.whereClause,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
      ...(Object.keys(this.includeClause).length > 0 && { include: this.includeClause }),
    });

    return { data, meta: { page, limit } };
  }

  async count(): Promise<number> {
    return this.model.count({ where: this.whereClause });
  }
}

export default QueryBuilder;
