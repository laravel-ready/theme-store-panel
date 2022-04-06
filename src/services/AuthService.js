import axiosInstance from "../helpers/HttpInterceptor";

export default {
    initCookieSession() {
        return axiosInstance.get("sanctum/csrf-cookie");
    },

    login(credentials) {
        return axiosInstance.post("api/theme-store/v1/auth/login", {
            email: credentials.email,
            password: credentials.password,
        });
    },
};
