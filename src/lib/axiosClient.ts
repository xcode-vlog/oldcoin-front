"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

export type NetworkError = {
  message: string;
};

export interface ResponseModel<T> {
  code: string;
  message: string;
  data: T;
}

const baseUrl = process.env.NEXT_PUBLIC_BACK_URL;

export const successCode = "LIME_200";

export const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  async (response) => {
    // const { config } = response;
    // const originalRequest = config;

    return response;
  },
  async (error) => {
    console.log(error);
    if (error.name == "AxiosError") {
      const data: ResponseModel<any> = {
        code: "NETWORK_ERROR",
        message: error.message,
        data: error.toJSON(),
      };
      return Promise.resolve(data);
    }

    return Promise.reject(error);
  }
);
