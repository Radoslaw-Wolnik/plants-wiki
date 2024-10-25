// types/api/common.ts
export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
    };
  }