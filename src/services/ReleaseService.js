import axiosInstance from "../helpers/HttpInterceptor";
import baseUrl from "../helpers/BaseUrl";

const endpoint = "api/theme-store/private/v1/themes/releases";

export default {
    getAll(theme_id, page) {
        return axiosInstance.get(`${endpoint}?page=${page}&theme_id=${theme_id}`);
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

    download(id) {
        return axiosInstance.get(`${endpoint}/${id}/download`);
    },

    getImageUploadEndpoint(id) {
        return `${baseUrl}/${endpoint}/${id}/upload`;
    },
};
