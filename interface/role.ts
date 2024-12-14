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

export interface RoleUpdate{
roleId: string
}

export interface RoleResponse{
id: string;  
role: Role[];
}

export interface RoleDetailResponse {
  metadata(metadata: any): unknown;
  id: string;
  name: string;
  permissions: {
    [types: string]: {
      [entity: string]: {
        [action: string]: boolean;
      };
    };
  };
}

export interface RoleData {
name: string;
permissions: {
  [types: string]: {
    [entity: string]: {
      [action: string]: boolean;
    };
  };
};
}

// ADMIN: 'ADMIN.GRANTED',
//BASIC: 'BASIC.PUBLIC',
//Category:Page; entity: PANEL, DASHBOARD; 
    //Category: MANAGE_PRODUCT, ENTITY: PRODUCT((CREATE, VIEW, UPDATE, DELETE)), CATEGORY(CREATE, VIEW, UPDATE, DELETE), SKU(CREATE, VIEW, UPDATE, DELETE), UPLOAD(CREATE, DELETE), COUPON(CREATE, VIEW, UPDATE, DELETE)
    //Category: SYSTEM: ENTITY: USER(CREATE, VIEW, UPDATE, DELETE), ROLE action: CREATE, VIEW, UPDATE, DELETE
    //Category: MANAGE_ORDER,  ENTITY: REVIEW(UPDATE, DELETE), ORDER:CREATE, VIEW, UPDATE, DELETE
    //Category: SETTING,  ENTITY: PAYMENT_TYPE (CREATE, UPDATE, DELETE), DELIVERY_TYPE(CREATE, VIEW, UPDATE, DELETE), CITY(CREATE, UPDATE, DELETE)