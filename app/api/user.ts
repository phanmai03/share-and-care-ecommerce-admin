import * as User from "@/interface/user"
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const USER_URL ='/users/all'

export const getAllUser = async (userId: string, accessToken: string): Promise<User.UserDataResponse> => {
    try {
        const response = await api.get(`${USER_URL}`,{
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