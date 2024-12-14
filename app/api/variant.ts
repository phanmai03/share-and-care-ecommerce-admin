import * as Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';
import { VariantData } from "@/interface/product";

const VARIANT_URL = '/variants';

export const getAllVariant = async (id: string, userId: string, accessToken: string ): Promise<VariantData> => {
    try {
        const response = await api.get(`${VARIANT_URL}/${id}`, {
                headers: {
                    'x-client-id': userId,
                    'Authorization': accessToken
                }
            }
        );
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}
export const getPublicVariant = async (id: string, userId: string, accessToken: string ): Promise<Product.VariantDataPublic> => {
  try {
      const response = await api.get(`${VARIANT_URL}/public/${id}`, {
              headers: {
                  'x-client-id': userId,
                  'Authorization': accessToken
              }
          }
      );
      return response.data.metadata;
  } catch (error) {
      const errorMessage = get(error, 'response.data.error.message', '');

      if (errorMessage) {
          toast.error(errorMessage);
      }
      throw new Error(errorMessage || 'An unknown error occurred.');
  }
}

export const publicVariant = async (id: string, userId: string, accessToken: string): Promise<Product.PublishProductResponse> => {
    try {
      const response = await api.patch(`${VARIANT_URL}/public/${id}`, null, {
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
  
  export const unPublicVariant = async (id: string, userId: string, accessToken: string): Promise<Product.PublicVariantResponse> => {
    try {
      const response = await api.patch(`${VARIANT_URL}/unpublic/${id}`, null, {
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


  export const publicAllVariant = async (id: string, userId: string, accessToken: string): Promise<Product.PublicAllVariant> => {
    try {
      const response = await api.patch(`${VARIANT_URL}/product/public/${id}`, null, {
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
  
  export const unPublicAlllVariant = async (id: string, userId: string, accessToken: string): Promise<Product.PublicAllVariant> => {
    try {
      const response = await api.patch(`${VARIANT_URL}/product/unpublic/${id}`, null, {
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