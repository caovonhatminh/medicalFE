import { URL } from "../constants";

import axios from "axios";

const axiosAuth = axios.create({
    baseURL: URL,
    headers: {
        "Content-type": "application/json",
    },
});

axiosAuth.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem("access_token");
        config.headers.Authorization = "Bearer " + access_token;
        return config;
    },
    (error) => Promise.reject(error)
);

axiosAuth.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const config = error.config;
        // Access Token was expired
        if (error.response && error.response.status === 403 && !config._retry) {
            config._retry = true;
            try {
                const refresh_token = localStorage.getItem("refresh_token");
                if (refresh_token) {
                    const res = await axios({
                        url: URL + "/user/renew-access-token",
                        method: "post",
                        data: {
                            refresh_token: refresh_token,
                        },
                    });
                    if (res.data.access_token) {
                        localStorage.setItem(
                            "access_token",
                            res.data.access_token
                        );
                        localStorage.setItem(
                            "refresh_token",
                            res.data.refresh_token
                        );
                    }
                    return axiosAuth(config);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

const axiosNotAuth = axios.create();
axiosNotAuth.interceptors.request.use(
    (config) => {
        config.baseURL = URL;
        return config;
    },
    (error) => Promise.reject(error)
);

export { axiosAuth, axiosNotAuth };
