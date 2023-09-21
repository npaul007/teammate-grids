import AsyncStorage from "@react-native-async-storage/async-storage";
import { includes, some } from "lodash";
import { IPlayer } from "../constants";

export const setAuthCookie = async (token: string) => {
  try {
    await AsyncStorage.setItem("auth", token);
  } catch (error) {}
};

export const getAuthCookie = () => {
  return AsyncStorage.getItem("auth");
};

export const mapToArray = (map: Map<any, any>): any[] => {
  return [...map.values()];
};

export const getRandomIndex = (array: any[] | undefined): number => {
  if (array?.length === 0 || !array) {
    return -1;
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return randomIndex;
};

export const hasCommonItem = (arr1: any[], arr2: any[], arr3: any[]) => {
  return some(arr1, (item) => includes(arr2, item) && includes(arr3, item));
};
