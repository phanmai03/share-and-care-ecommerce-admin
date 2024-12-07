export interface CouponData{
    name: string;
    code: string;
    description: string;
    startDate: string; // Date in ISO format
    endDate: string; // Date in ISO format
    type: "PERCENT"  // Enum-like type for coupon type
    value: number;
    minValue: number;
    maxValue: number;
    maxUses: number;
    maxUsesPerUser: number;
    targetType: "Order"; // Enum-like type for target
    // targetIds?: string[]; // Optional array of target IDs
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
    // targetType: "Order" | "Product" | "Category";
    targetIds: string[]; // Array of target IDs
    isActive: boolean;
}

export interface CouponsDataResponse {
    coupon: CouponDataResponse[];
}

