export interface CategoryData {
    name: string,
    parentId: null | string,
}

export interface CategoiesData {
    categoryId: string,
    name: string,
}

export interface CategoriesDataResponse{
    id: string,
    name: string,
    parentId: null,
}
export interface CategoryDataResponse {
    id: string,
    name: string,
    parentId: null,
    children: Array<null>,
}

