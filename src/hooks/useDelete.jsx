import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_API_URL;

export function useDelete() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const remove = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const token = sessionStorage.getItem('token');

            const response = await axios.delete(`${baseURL}${url}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });

            setData(response.data);
            if (response.data.message) {
                toast.success(response.data.message);
            }
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);

            if (err.response?.data?.messages?.error) {
                toast.error(err.response.data.messages.error);
            } else {
                toast.error('Error al eliminar');
            }
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error, data };
}
