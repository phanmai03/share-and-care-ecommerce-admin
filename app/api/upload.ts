import * as Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const PRODUCT_URL = '/uploads/products'

export const uploadProductImage = async (clientId: string, accessToken: string, file: File): Promise<Product.ProductDetailResponse> => {
    try {
        const formData = new FormData();
        formData.append("mainImage", file); // Adjust based on backend requirements
        
        const response = await api.post(`${PRODUCT_URL}`, formData, {
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
  