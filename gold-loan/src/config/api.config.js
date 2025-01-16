import axios from 'axios'

const API_BASE_URL = 'http://localhost:4000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL
})

const getRequest = async ({ url, params = {}, headers = {} }) => {
    try {
        const res = await axiosInstance.get(url, { params, headers });
        return res.data
    } catch (error) {
        return error
    }
}

export const postRequest = async ({ url, data = {}, params = {} }) => {
    try {
        const res = await axiosInstance.post(url, data, { params });
        return res.data;
    } catch (err) {
        // return err;
        return { error: err.response ? err.response.data : err.message };
    };
};

export const requests = {
    get: getRequest,
    post: postRequest,
}