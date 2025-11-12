import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// const baseURL = import.meta.env.VITE_API_URL;
const baseURL = import.meta.env.VITE_API_URL;


export function usePost() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const post = async (url, payload, method = 'POST') => {
        setLoading(true);
        setError(null);

        try {
            // const token = sessionStorage.getItem('token');

            const response = await axios({
                url: `${baseURL}${url}`,
                method,
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                },
                // headers: {
                //     'Content-Type': 'application/json',
                //     'Authorization': token ? `Bearer ${token}` : '',
                // },
            });

            setData(response.data);

            if (response.data.message) {
                toast.success(response.data.message);
            }

            return response.data;

        } catch (err) {
            const message = err.response?.data?.message || err.message;
            setError(message);

            if (err.response?.data?.messages?.error) {
                toast.error(err.response.data.messages.error);
            } else {
                toast.error(message);
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    return { post, loading, error, data };
}
