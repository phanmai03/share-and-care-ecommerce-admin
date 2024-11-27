import * as Category from "@/interface/category"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const CATEGORY_URL = '/categories';

export const createCategories = async (data: Category.CategoryData): Promise<Category.CategoriesDataResponse> => {
    try {
        const response = await api.post(`${CATEGORY_URL}`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};


export const getAllCategories = async (): Promise<Array<Category.CategoryDataResponse>> => {
    try {
        const response = await api.get(`${CATEGORY_URL}/all`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getChildCategories = async (data: string): Promise<Array<Category.CategoryDataResponse>> => {
    try {
        const response = await api.get(`${CATEGORY_URL}/?parentId=${data}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const deleteCategories = async (data: string) => {
    try {
        const response = await api.delete(`${CATEGORY_URL}/?categoryId=${data}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

export const updateCategories = async (data: Category.CategoryData): Promise<Array<Category.CategoriesDataResponse>> => {
    try {
        const response = await api.patch(`${CATEGORY_URL}` , data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};


