// Generic query options interface
// Usage: QueryOptions<User, UserFilter>
// Where T is the entity type and F is the filter type
export interface QueryOptions<T, F = Partial<T>> {
    filters?: F;
    sort?: { [key in keyof T]?: 'asc' | 'desc' };
    skip?: number;
    take?: number;
}
