import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAuthCookie = async (token: string) => {
  try {
    await AsyncStorage.setItem("auth", token);
  } catch (error) {}
};

export const getAuthCookie = () => {
  return AsyncStorage.getItem("auth");
};
