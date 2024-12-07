export interface ShippingAddress {
    fullname: string;
    phone: string;
  }
  
  export interface DeliveryMethod {
    id: string;
    name: string;
  }
  
  export interface Order {
    id: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    deliveryMethod: DeliveryMethod;
    totalPrice: number;
    status: string;
    nextStatus: string;
  }
  
  export interface OrderRespone{
    totalPages: number;
    totalOrders: number;
    currentPage: number;
    orders: Order[];
  }