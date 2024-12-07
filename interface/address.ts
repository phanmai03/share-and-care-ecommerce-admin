export interface Address {
    id: string;
    name: string;
    phone: string;
    placeId: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    location: {
      lat: number;
      lng: number;
    };
    type: "DEFAULT" | "SHIPPING" | string;
}
  