export interface CouponData {
    name: string;
    code: string;
    description: string;
    startDate: string;
    endDate: string;
    type: "PERCENT" | "FIXED";
    value: number | null;
    minValue: number | null;
    maxValue: number | null;
    maxUses: number | null;
    maxUsesPerUser: number | null;
    targetType: "Order" | "Delivery" | "Product";
    targetIds: string[];
  }
  
export interface CouponDataResponse {
    name: string;
    code: string;
    description: string;
    startDate: string; // Date in ISO format
    endDate: string; // Date in ISO format
    type: "PERCENT";
    value: number;
    minValue: number;
    maxValue: number;
    maxUses: number;
    maxUsesPerUser: number;
    targetType: "Order" | "Delivery" | "Product";
    targetIds: string[]; // Array of target IDs
    isActive: boolean;
}

export interface CouponsDataResponse {
    coupon: CouponDataResponse[];
}

export interface getAllCoupons{
    id: string;
    name: string;
    code: string;
    startDate: string; // Date in ISO format
    endDate: string; // Date in ISO format
    type: "PERCENT";
    value: number;
    targetType: "Order" | "Delivery" | "Product";
    isActive: boolean;
}
export interface getAllCouponsResponse {
    totalRoles: number;
    totalPages: number; // Thêm thuộc tính này
    currentPage: number;
    coupons: getAllCoupons[];
}
