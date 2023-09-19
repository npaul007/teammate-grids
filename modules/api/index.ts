import axios from "axios";
import { API_HOST } from "../constants/hosts";
import { getAuthCookie, setAuthCookie } from "../utils";

const getAuthHeaders = async () => {
  const authToken = await getAuthCookie();
  return {
    "Content-Type": "application/json",
    "auth-token": authToken,
  };
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_HOST}admin/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { data } = response;

    return data;
  } catch (err) {
    console.log("Failed to make request due to error:", err);
  }

  return null;
};

export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_HOST}admin/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { data } = response;

    return data;
  } catch (err) {
    console.log("Failed to make request due to error:", err);
  }

  return null;
};
