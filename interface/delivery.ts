export interface DeliveryData {
    name: string;
    description: string;
    maxDistance: number;
    baseFee: number;
    pricing: Pricing[];  
}

export interface DeliveryDataResponse{
    id: string;
    name: string;
    description: string;
    maxDistance: number;
    baseFee: number;
    pricing: Pricing[];
    isActive: boolean;
}

export interface Pricing {
    // price: ReactNode;
    threshold: number; 
    feePerKm: number;  
}

// ##GET###
export interface DeliveriesData{
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface DeliveriesDataResponse{
    deliveries:DeliveriesData[];
}
