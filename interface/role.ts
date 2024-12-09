export interface RoleResponse {
    totalRoles: number;
    totalPages: number; // Thêm thuộc tính này
    currentPage: number;
    roles: Role[];
  }
export interface Role{
    id: string;  
    name: string;
}

export interface RoleDetailResponse {
    id: string;
    name: string;
    permissions: {
      [category: string]: {
        [entity: string]: {
          [action: string]: boolean;
        };
      };
    };
  }
  
export interface RoleData {
  name: string;
  permissions: {
    [key: string]: {
      [entity: string]: {
        [action: string]: boolean | Record<string, boolean>;
      };
    };
  };
}

