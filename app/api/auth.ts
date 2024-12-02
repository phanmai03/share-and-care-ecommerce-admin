import * as Auth from "@/interface/auth"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const AUTH_URL = '/auth';

export const resendEmailVerification = async (data: Auth.ResendData): Promise<Auth.ResendDataResponse> => {
    try {
        const response = await api.post(`${AUTH_URL}/resend-email-verification`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

export const loginRequest = async (data: Auth.LoginData): Promise<Auth.LoginDataResponse> => {
    try {
        const response = await api.post(`${AUTH_URL}/login`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

export const checkAdmin = async (clientId: string, accessToken: string) => {
    try {
        const response = await api.get(`${AUTH_URL}/admin-panel`, {
            headers: {
                'x-client-id': clientId,
                'Authorization': accessToken,
            },
        });
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', 'An unknown error occurred.');
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};


export const logoutRequest = async (clientId: string, accessToken: string) => {
    try {
        const response = await api.post(`${AUTH_URL}/logout`, null, {
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

export const forgotPassword = async (data: Auth.ForgotPasswordData) => {
    try {
        const response = await api.post(`${AUTH_URL}/forgot-password`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};


// export const forgotPassword = async (data: Auth.ForgotPasswordData, isPanel: boolean) => {
//     try {
//         // Add `isPanel` to the data object before sending the request
//         const requestData = { ...data, isPanel };
        
//         console.log('Request Data:', requestData);  // Log the request data

//         const response = await api.post(`${AUTH_URL}/forgot-password`, requestData);

//         console.log('API Response:', response.data);  // Log the response data

//         return response.data.metadata;
//     } catch (error) {
//         const errorMessage = get(error, 'response.data.error.message', '');
//         if (errorMessage) {
//             toast.error(errorMessage);
//         }
//         throw new Error(errorMessage || 'An unknown error occurred.');
//     }
// };



export const resetPassword = async (data: Auth.ResetPasswordData) => {
    try {
        const response = await api.post(`${AUTH_URL}/reset-password`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

