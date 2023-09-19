import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { Exist } from "./components";
import { getAuthCookie, setAuthCookie } from "./modules/utils";
import { Game, Login, Register } from "./screens";

const Stack = createStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getAuthCookie();
      if (token) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    checkAuthentication();
  }, [setIsSignedIn, getAuthCookie]);

  const logout = useCallback(() => {
    setAuthCookie("");
    setIsSignedIn(false);
  }, [setAuthCookie, setIsSignedIn]);

  return (
    <NavigationContainer>
      <Exist when={isSignedIn}>
        <Stack.Navigator initialRouteName="Game">
          <Stack.Screen
            name="Teammate Grids"
            component={Game}
            options={{
              headerRight: () => (
                <Pressable onPress={logout}>
                  <Text style={{ paddingRight: 10, fontWeight: 500 }}>
                    Logout
                  </Text>
                </Pressable>
              ),
            }}
          />
        </Stack.Navigator>
      </Exist>
      <Exist when={!isSignedIn}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            initialParams={{ setIsSignedIn: setIsSignedIn }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            initialParams={{ setIsSignedIn: setIsSignedIn }}
          />
        </Stack.Navigator>
      </Exist>
    </NavigationContainer>
  );
}
