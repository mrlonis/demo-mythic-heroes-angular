export interface SpringDataRestResponse<T> {
  _embedded: {
    data: T[];
  };
  _links: {
    self: {
      href: string;
    };
    profile: {
      href: string;
    };
    search: {
      href: string;
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
