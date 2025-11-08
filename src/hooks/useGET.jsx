import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { getToken, removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

// const baseURL = import.meta.env.VITE_API_URL;
const baseURL = "https://circulokinesiologossursantafe.com/estampillas/circulo_estampillas_be/api/";

export const useGET = (consult) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!consult) return;

    let isMounted = true; 

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = getToken();
      // const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const response = await axios.get(`${baseURL}${consult}`);
        // const response = await axios.get(`${baseURL}${consult}`, { headers });

        if (response.status < 200 || response.status >= 300) {
          throw new Error("Error en la red: " + response.statusText);
        }

        if (isMounted) setData(response.data);

      } catch (err) {
        if (err.response && [401, 403].includes(err.response.status)) {
          removeToken();
          navigate("/login");
          return;
        }

        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; 
    };
  }, [consult, navigate]);

  return [data, loading, error];
};

useGET.propTypes = {
  consult: PropTypes.string,
};
