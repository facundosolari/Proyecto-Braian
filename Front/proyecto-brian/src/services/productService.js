import axiosClient from "./axiosClient";

export const getProducts = async () => {
  const response = await axiosClient.get("/Product/AllProducts");
  return response.data;
};