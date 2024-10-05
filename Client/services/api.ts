import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

export const createUser = async (user: { name: string; email: string; phone: string; password: string }) => {
    try {
        const response = await axios.post(API_URL, user, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; 
    } catch (error:any) {
        throw new Error(error.response?.data?.message || 'Failed to create user');
    }
};
