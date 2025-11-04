import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { getToken } from "../utils/auth"; // o donde tengas tu helper


// const baseURL = import.meta.env.VITE_API_URL;
const baseURL = "https://circulokinesiologossursantafe.com/estampillas/circulo_estampillas_be/api/"

export const useGET = (consult) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!consult) return;

    let isMounted = true; 

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = getToken(); 
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const maxRetries = 3;
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success && isMounted) {
        try {
          const response = await axios.get(
            `${baseURL}${consult}`,
            { headers }
          );

          if (response.status < 200 || response.status >= 300) {
            throw new Error("Error en la red: " + response.statusText);
          }

          if (isMounted) {
            setData(response.data);
          }
          success = true;
        } catch (err) {
          attempt++;
          if (attempt >= maxRetries && isMounted) {
            setError(err);
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [consult]);

  return [data, loading, error];
};

useGET.propTypes = {
  consult: PropTypes.string,
};
