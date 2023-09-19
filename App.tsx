import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Exist } from "./components";
import { getAuthCookie } from "./modules/utils";
import { Game, Login, Register } from "./screens";

const Stack = createStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getAuthCookie();
      if (token) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    })();

    return () => {};
  }, [isSignedIn, setIsSignedIn]);

  return (
    <NavigationContainer>
      <Exist when={isSignedIn}>
        <Stack.Navigator initialRouteName="Game">
          <Stack.Screen name="Game" component={Game} />
        </Stack.Navigator>
      </Exist>
      <Exist when={!isSignedIn}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </Exist>
    </NavigationContainer>
  );
}
