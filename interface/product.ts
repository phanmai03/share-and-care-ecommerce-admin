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

  export interface Category {
    id: string,
    name: string,
  }
  
  export interface Variants{
    name: string,
    images: Array<string>,
    options: Array<string>,
  }
  
  export interface SkuList {
    tierIndex: (number | string)[],
    isDefault: boolean,
    price: number,
    quantity: number,
  }
  
export interface ProductDataResponse {
    id: string,
    name: string,
    slug:string,
    mainImage: string,
    subImages:Array<string>,
    price: number,
    originalPrice: number,
    quantity: number,
    sold: number,
    description: string,
    category:Array<Category>,
    attributes:Array<string>,
    status:string,
    rating: number,
    views: number,
    uniqueViews: number,
    variants:Array<Variants>,
}

export interface ProductDetailResponse {
  products: ProductDataResponse[],
}

export interface ProductResponse {
    totalPages: number,
    totalProducts: number,
    currentPage: number,
    products: ProductDataResponse[],
}

export interface ProductDetail {
  name: string,
  description: string,
  category: Array<Category>,
  attributes:Array<string>,
}

export interface ImageUpload {
  mainImage: string,
  subImages: Array<string>,
}

export interface Properties {
  price: number,
  originalPrice: number,
  quantity: number,
}
