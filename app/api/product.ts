import * as   Product from "@/interface/product"

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
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || 'An unknown error occurred.');
  }
};

export const getAllProduct = async (
  userId: string,
  accessToken: string,
  page: number,
  size: number,
): Promise<Product.ProductResponse> => {
  try {
    const response = await api.get(`${PRODUCT_URL}/?page=${page}&size=${size}`, {
      headers: {
        "x-client-id": userId,
        Authorization: accessToken,
      },
    });

    // Return metadata containing products and pagination details
    return response.data.metadata;
  } catch (error) {
    const errorMessage = get(error, "response.data.error.message", "");

    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || "An unknown error occurred.");
  }
};

export const getAllSearchProduct = async (search: string, userId: string, accessToken: string, page: number,
  size: number): Promise<Product.ProductResponse> => {
  try {
      const response = await api.get(`${PRODUCT_URL}/?search=${search}&page=${page}&size=${size}`, {
        headers: {
          "x-client-id": userId,
          Authorization: accessToken,
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
}

export const getTopCategoriesProduct = async (categoryId: string): Promise<Product.ProductResponse> => {
  try {
      const response = await api.get(`${PRODUCT_URL}?size=10&category=${categoryId}`);
      return response.data.metadata;
  } catch (error) {
      const errorMessage = get(error, 'response.data.error.message', '');

      if (errorMessage) {
          toast.error(errorMessage);
      }
      throw new Error(errorMessage || 'An unknown error occurred.');
  }
}

export const getPriceFilterProduct = async (minPrice: number, maxPrice: number): Promise<Product.ProductResponse> => {
  try {
      const response = await api.get(`${PRODUCT_URL}?minPrice=${minPrice}&maxPrice=${maxPrice}`);
      return response.data.metadata;
  } catch (error) {
      const errorMessage = get(error, 'response.data.error.message', '');

      if (errorMessage) {
          toast.error(errorMessage);
      }
      throw new Error(errorMessage || 'An unknown error occurred.');
  }
}

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

export const updateProduct = async (data: Product.ProductData, userId: string, accessToken: string): Promise<Product.ProductUpdateResponse> => {
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

export const publishProduct = async (id: string, userId: string, accessToken: string): Promise<Product.PublishProductResponse> => {
  try {
    const response = await api.patch(`${PRODUCT_URL}/publish/${id}`, null, {
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

export const unPublishProduct = async (id: string, userId: string, accessToken: string): Promise<Product.PublishProductResponse> => {
  try {
    const response = await api.patch(`${PRODUCT_URL}/unpublish/${id}`, null, {
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

export const deleteProduct = async (id: string, userId: string, accessToken: string) => {
  try {
      const response = await api.delete(`${PRODUCT_URL}/${id}`,{
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

//Đang thực hiện
export const undateProductView = async (productId: string, deviceId: string, userId: string, accessToken: string) => {
  try {
    const response = await api.patch(`${PRODUCT_URL}/update-views`, {productId, deviceId}, {
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

export const importProduct = async (
  data: { id: string, quantity: number } | { id: string, skuList: { id: string, quantity: number }[] }, 
  userId: string, 
  accessToken: string
) => {
  try {
    // Send the appropriate data structure depending on whether it's a single product or a list of SKUs
    const response = await api.patch(
      `${PRODUCT_URL}/update-quantity`,
      data,
      {
        headers: {
          'x-client-id': userId,
          'Authorization': accessToken
        }
      }
    );
      return response.data.metadata;; // Indicating successful update
  } catch (error) {
    // Detailed error handling
    const errorMessage = get(error, 'response.data.error.message', 'An unknown error occurred.');
    toast.error(errorMessage);
    throw new Error(errorMessage); // Propagate the error for further handling
  }
};