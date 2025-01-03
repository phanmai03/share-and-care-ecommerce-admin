export interface ProductData {
  name: string,
  mainImage: string,
  subImages: Array<string>,
  price: number,
  originalPrice: number,
  quantity: number,
  description: string,
  category: Array<Category>,
  attributes: Array<string>,
  variants: Array<Variants>,
  skuList: Array<SkuList>,
}

export interface ProductDataEdit {
  productId: string,
  name: string,
  mainImage: string,
  subImages: Array<string>,
  price: number,
  originalPrice: number,
  quantity: number,
  description: string,
  category: Array<Category>,
  attributes: Array<string>,
  variants: Array<Variants>,
  skuList: Array<SkuList>,
}

export interface ProductDataResponse {
  id: string,
  name: string,
  slug: string,
  mainImage: string,
  price: number,
  originalPrice: number,
  quantity: number,
  sold: number,
  status: string,
  rating: number,
  views: number[],
  uniqueViews: number,
  variants: Array<Variants>,
}

export interface ProductDetailResponse {
  products: ProductDataResponse,
  skuList: Array<SkuListData>,
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
  name: string; //color or size
  images: string[];
  options: string[]; //color or size
}

export interface SkuList {
  tierIndex: number[];
  isDefault: boolean;
  price: number;
  quantity: number;
}


export interface SkuListData {
  id: string;
  slug: string;
  tierIndex: number[];
  isDefault: boolean;
  price: number;
  quantity: number;
  sold: number;
  status: string;
}

export interface VariantData{
  skuList: SkuListData[];
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
  skuList: SkuListData[];
}

export interface ProductDataDetailResponse {
  product: ProductDataDetail;
  skuList: {
    skuList: Array<SkuListData>,
  }
}

export interface ProductUpdate {
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
  attributes: string[],
  status: string,
  rating: number,
  views: number,
  uniqueViews: number,
  variants: Array<Variants>,
}


export interface ProductUpdateResponse {
  products: ProductUpdate[],
}

export interface UploadProduct {
  file: File;
}

export interface UploadProductResponse {
  metadata: string;
}

export interface PublishProductResponse {
  status: string,
  updatedAt: string,
}

export interface PublicVariantResponse {
  variant: PublicVariant;
}

export interface PublicVariant{
  id: string;
  name: string;
  slug: string 
  status: string;
}

export interface PublicAllVariant{
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: string | null;
  upsertedCount: number;
  matchedCount: number;
}


export interface SkuListDataPublic {
  id: string;
  slug: string;
  tierIndex: number[];
  isDefault: boolean;
  price: number;
  quantity: number;
}

export interface VariantDataPublic{
  skuList: SkuListDataPublic[];
}
