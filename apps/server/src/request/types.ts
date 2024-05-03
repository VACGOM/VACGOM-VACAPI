export interface RequestService {
  get<T>(url: string): Promise<T>;

  post<D, T>(url: string, data: D): Promise<T>;
}
