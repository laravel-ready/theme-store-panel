import axiosInstance from "../helpers/HttpInterceptor";
import baseUrl from "../helpers/BaseUrl";

const endpoint = "api/theme-store/private/v1/authors";

export default {
    getAll(page = 1, all = false) {
        return axiosInstance.get(`${endpoint}?page=${page}&all=${all}`);
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

    patch(id, data) {
        return axiosInstance.patch(`${endpoint}/${id}`, data);
    },

    delete(id) {
        return axiosInstance.delete(`${endpoint}/${id}`);
    },

    getImageUploadEndpoint(id) {
        return `${baseUrl}/${endpoint}/${id}/upload`;
    },
};
