import * as Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const PRODUCT_URL = '/products'

export const createProduct = async (data: Product.ProductData, userId: string, accessToken: string): Promise<Product.ProductDataResponse> => {
  try {
    const response = await api.post(`${PRODUCT_URL}`, data, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken
      }
    });
    return response.data.metadata;
  } catch (error) {

    const errorMessage = get(error, 'response.data.error.message', '');

    if (errorMessage) {
      console.log('Error Message:', errorMessage); // Log thông báo lỗi chi tiết
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || 'An unknown error occurred.');
  }
};

export const getAllProduct = async (userId: string, accessToken: string): Promise<Product.ProductResponse> => {
  try {
    const response = await api.get(`${PRODUCT_URL}`, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken,
      },
    });
    return response.data.metadata; // Check if metadata contains products
  } catch (error) {
    const errorMessage = get(error, 'response.data.error.message', '');

    if (errorMessage) {
      console.log('Error Message:', errorMessage);
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || 'An unknown error occurred.');
  }
};

export const getProductDetail = async (id: string, userId: string, accessToken: string): Promise<Product.ProductDataDetailResponse> => {
  try {
    const response = await api.get(`${PRODUCT_URL}/${id}`, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken,
      },
    });

    return response.data.metadata;
  } catch (error) {
    const errorMessage = get(error, 'response.data.error.message', '');

    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || 'An unknown error occurred.');
  }
};

export const updateProduct = async (data: Product.ProductResponse, userId: string, accessToken: string): Promise<Product.ProductUpdateResponse> => {
  try {
    const response = await api.patch(`${PRODUCT_URL}`, data, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken
      }
    });
    return response.data.metadata;
  } catch (error) {
    const errorMessage = get(error, 'response.data.error.message', '');

    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || 'An unknown error occurred.');
  }
};

