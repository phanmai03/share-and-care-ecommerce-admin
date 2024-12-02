  export interface ProductData{
    name: string,
    mainImage: string,
    subImages: Array<string>,
    price: number,
    originalPrice: number,
    quantity: number,
    description: string,
    category: Array<Category>,
    attributes: Array<string>,
    variants:Array<Variants>,
    skuList: Array<SkuList>,
  }
  
export interface ProductDataResponse {
    id: string,
    name: string,
    slug:string, 
    mainImage: string, 
    price: number,
    originalPrice: number,
    quantity: number,
    sold: number,
    status:string,
    rating: number,
    views: number,
    uniqueViews: number, 
    variants:Array<Variants>,
}

export interface ProductResponse {
    totalPages: number,
    totalProducts: number,
    currentPage: number,
    products: ProductDataResponse[],
}

export interface Category {
  id: string;
  name: string;
}

export interface Variants {
  name: string;
  images: string[];
  options: string[];
}

export interface SkuList {
  id: string;
  slug: string;
  tierIndex: (number | string)[];
  isDefault: boolean;
  price: number;
  quantity: number;
  sold: number;
  status: string;
}

export interface ProductDataDetail {
  id: string;
  name: string;
  slug: string;
  mainImage: string;
  subImages: string[];
  price: number;
  originalPrice: number;
  quantity: number;
  sold: number;
  description: string;
  category: Category[];
  attributes: string[];
  status: string;
  rating: number;
  views: number;
  uniqueViews: number;
  variants: Variants[];
  skuList: SkuList[];
}

export interface ProductDataDetailResponse {
  product: ProductDataDetail[];
  skuList: SkuList[];
}


export interface ProductUpdate{
  id: string,
  name: string,
  slug: string, 
  mainImage: string, 
  subImages: Array<string>,
  price: number,
  originalPrice: number,
  quantity: number,
  sold: number,
  description: string,
  category: Category[]
  attributes: string [],
  status:string,
  rating: number,
  views: number,
  uniqueViews: number, 
  variants:Array<Variants>,
}


export interface ProductUpdateResponse{
  products: ProductUpdate[],
}
