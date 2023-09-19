import axios, { AxiosError } from "axios";
import { API_HOST } from "../constants/hosts";
import { getAuthCookie, setAuthCookie } from "../utils";

const getAuthHeaders = async () => {
  const authToken = await getAuthCookie();
  return {
    "Content-Type": "application/json",
    "auth-token": authToken,
  };
};

export const login = async (
  email: string,
  password: string,
  callback: (data: any) => void
) => {
  axios
    .post(
      `${API_HOST}login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.log("Failed to make request due to error:", error);
      callback(null);
    });
};

export const register = (
  email: string,
  password: string,
  callback: (data: any) => void
) => {
  axios
    .post(
      `${API_HOST}register`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.log("Failed to make request due to error:", error);
      callback(null);
    });
};
