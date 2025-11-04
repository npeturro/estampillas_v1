import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_API_URL;

export function usePut() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const put = async (url, payload = {}) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${baseURL}${url}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });
            setData(response.data);
            if (response.data.message) {
                toast.success(response.data.message)
            }
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || "Error inesperado");
        } finally {
            setLoading(false);
        }
    };

    return { put, loading, error, data };
}
