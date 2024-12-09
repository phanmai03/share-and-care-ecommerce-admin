import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';
import { Sale } from "@/interface/statics";

const STATISTICS_URL = '/statistics'

export const getSale = async (userId: string, accessToken: string): Promise<Sale> => {
    try {
      const response = await api.get(`${STATISTICS_URL}/count`, {
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
  