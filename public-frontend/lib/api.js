import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

export const getStandards =
  async () => {
    const response = await api.get(
      "/standards"
    );

    return response.data.data;
  };

export const getStandardBySlug =
  async (slug) => {
    const response = await api.get(
      `/standards/${slug}`
    );

    return response.data.data;
  };

export default api;