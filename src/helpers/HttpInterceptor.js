import baseUrl from "./BaseUrl";

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

axiosInstance.defaults.baseURL = baseUrl;

export default axiosInstance;
