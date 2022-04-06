import axios from "axios";
import store from "store";

const token = store.get("userAccessToken");

const axiosInstance = axios.create({
    defaults: {
        baseURL: window.themeStoreApiUrl,
        timeout: 30000,
    },
});

if (token) {
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
}

if (process.env.NODE_ENV === "development") {
    axiosInstance.defaults.baseURL = "http://localhost:8000";
}

export default axiosInstance;
