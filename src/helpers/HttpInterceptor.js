import baseUrl from "./BaseUrl";

import axios from "axios";
import store from "store";
import router from "./../router/index";

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

// 401 response interceptor
axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (401 === error.response.status) {
            store.remove("user");
            store.remove("userAccessToken");

            router.push("/login");
        } else {
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;
