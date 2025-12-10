import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7076/api",
  withCredentials: true, // cookies HttpOnly se envían automáticamente
});

export default axiosClient;

/*

ANTES DEL ULTIMO CAMBIO

import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7076/api",
  withCredentials: true, // 👈 cookies JWT y HttpOnly se envían automáticamente
  // NO ponemos Content-Type aquí, Axios lo maneja automáticamente
});

export default axiosClient;

*/