import * as Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const PRODUCT_URL = '/products'

export const createProduct = async (data: Product.ProductData, clientId: string, accessToken: string): Promise<Product.ProductDataResponse> => {
    try {
        const response = await api.post(`${PRODUCT_URL}`, data, {
            headers: {
                'x-client-id': clientId,
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

  export const getAllProduct = async (clientId: string, accessToken: string ): Promise<Product.ProductResponse>=> {
      try {
        const response = await api.get(`${PRODUCT_URL}`, {
          headers: {
            'x-client-id': clientId,
            'Authorization': accessToken,
          },
        });
    
        return response.data.metadata; // Check if metadata contains products
      } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        
        if (errorMessage) {
          toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
      }
    };
    
    export const getProductDetail = async (data : Product.ProductResponse, clientId: string, accessToken: string ): Promise<Product.ProductDataDetailResponse>=> {
      try {
        const response = await api.get(`${PRODUCT_URL}/${data}`, {
          headers: {
            'x-client-id': clientId,
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

  export const updateProduct = async (data: Product.ProductResponse, clientId: string, accessToken: string): Promise<Product.ProductUpdateResponse> => {
    try {
        const response = await api.patch(`${PRODUCT_URL}`, data, {
            headers: {
                'x-client-id': clientId,
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

