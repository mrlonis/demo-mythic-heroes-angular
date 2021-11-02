export interface SpringDataRestResponse<T> {
  _embedded: {
    data: T[];
  };
  _links: {
    first?: {
      href: string;
    };
    prev?: {
      href: string;
    };
    self: {
      href: string;
    };
    next?: {
      href: string;
    };
    last?: {
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
