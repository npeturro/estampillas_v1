import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { getToken, removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL;

export const useGET = (consult) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // función reutilizable para volver a consultar
  const fetchData = useCallback(
    async (showLoading = true) => {
      if (!consult) return;
      if (showLoading) setLoading(true);
      setError(null);

      const token = getToken();

      try {
        const response = await axios.get(`${baseURL}${consult}`, {
          // headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.status < 200 || response.status >= 300) {
          throw new Error("Error en la red: " + response.statusText);
        }

        setData(response.data);
      } catch (err) {
        if (err.response && [401, 403].includes(err.response.status)) {
          removeToken();
          navigate("/login");
          return;
        }

        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [consult, navigate]
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  return [data, loading, error, fetchData];
};

useGET.propTypes = {
  consult: PropTypes.string,
};
