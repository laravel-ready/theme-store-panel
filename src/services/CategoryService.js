import axiosInstance from "../helpers/HttpInterceptor";

const endpoint = "api/theme-store/private/v1/category";

export default {
    getAll(page) {
        return axiosInstance.get(endpoint + "?page=" + page);
    },

    get(id) {
        return axiosInstance.get(`${endpoint}/${id}`);
    },

    create(data) {
        return axiosInstance.post(endpoint, data);
    },

    update(id, data) {
        return axiosInstance.put(`${endpoint}/${id}`, data);
    },

    delete(id) {
        return axiosInstance.delete(`${endpoint}/${id}`);
    },
};