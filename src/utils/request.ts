import axios, { AxiosRequestConfig } from "axios";
import router from "@/router";
import { RestResponse } from "@/utils/vos";

export const get = function(url: string) {
    const query: AxiosRequestConfig<object> = {
        url: url,
        method: "get",
        withCredentials: true,
        timeout: 30000,
        data: {},
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "request-ajax": true,
        },
    };
    return request(query);
};

export const postWithoutJson = function(url: string, param: object) {
    const query: AxiosRequestConfig<object> = {
        url: url,
        method: "post",
        withCredentials: true,
        timeout: 30000,
        data: param,
        headers: {
            "Content-Type": "application/json",
            "request-ajax": true,
        },
    };
    return request(query);
};

export const post = function(url: string) {
    const query: AxiosRequestConfig<object> = {
        url: url,
        method: "post",
        withCredentials: true,
        timeout: 30000,
        data: {},
        headers: {
            "Content-Type": "application/json",
            "request-ajax": true,
        },
    };
    return request(query);
};

const request = function(query: object) {
    return axios
        .request(query)
        .then((res: any) => {
            console.log(res);
            if (res.data.code == 416) {
                router.push({ path: "/login" });
            }
            return res;
        })
        .catch((e: any) => {
            console.log(e);
        });
};