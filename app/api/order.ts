import * as Order from "@/interface/order"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const ORDER_URL = '/order';

export const getAllOrder = async (
  userId: string,
  accessToken: string,
  page: number,
  size: number
): Promise<Order.OrderRespone> => {
  try {
    const response = await api.get(`${ORDER_URL}/all`, {
      headers: {
        "x-client-id": userId,
        Authorization: accessToken,
      },
      params: {
        page,
        size,
      },
    });
    return response.data.metadata; // Đảm bảo trả về đúng cấu trúc dữ liệu
  } catch (error) {
    const errorMessage = get(error, "response.data.error.message", "");
    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || "An unknown error occurred.");
  }
};

