import React, { useCallback, useState } from "react";
import { Text, View, Pressable, TextInput } from "react-native";
import { Screens, styles } from "../modules/constants";
import { Icon } from "react-native-elements";
import { Exist } from "../components";
import { login } from "../modules/api";
import { setAuthCookie } from "../modules/utils";
import { eq } from "lodash";

export const Login = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = useCallback(() => {
    if (!email.length || !password.length) {
      setErrorMessage("Please fill all fields");
    } else {
      login(email, password, (data) => {
        if (!eq(data, null)) {
          if (data?.message) {
            setErrorMessage(`${data?.message}`);
          } else if (data?.token) {
            setAuthCookie(data?.token);
            setErrorMessage("");
          }
        }
        console.log("data--", data);
      });
    }
  }, [email, password]);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Welcome to TEAMMATE GRIDS!</Text>
      <Text style={styles.h2}>Login to Play! {"\n"}</Text>
      <Exist when={!!errorMessage.length}>
        <Text style={styles.errorText}>
          {errorMessage}
          {"\n"}
        </Text>
      </Exist>
      <View style={styles.inputContainer}>
        <Icon name="email" size={24} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.button.text}>Login</Text>
      </Pressable>
      <Text>
        {"\n"}Don't have an account?{" "}
        <Pressable onPress={() => navigation.navigate(Screens.REGISTER)}>
          <Text style={styles.url}>Register here!</Text>
        </Pressable>
      </Text>
    </View>
  );
};
