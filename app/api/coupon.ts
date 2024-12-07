import * as Coupon from "@/interface/coupon"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const COUPON_URL = '/coupon';

export const createCoupon = async (data: Coupon.CouponData, userId: string, accessToken: string): Promise<Coupon.CouponDataResponse> => {
    try {
        const response = await api.post(`${COUPON_URL}`, data, {
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
