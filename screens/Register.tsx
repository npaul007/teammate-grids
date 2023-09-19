import React, { useCallback, useState } from "react";
import { Text, View, Pressable, TextInput } from "react-native";
import { Screens, styles } from "../modules/constants";
import { Icon } from "react-native-elements";
import { Exist } from "../components";
import { register } from "../modules/api";
import { eq } from "lodash";
import { setAuthCookie } from "../modules/utils";

export const Register = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = useCallback(() => {
    if (!email.length || !password.length || !confirmPassword.length) {
      setErrorMessage("Please fill all fields");
    } else {
      if (!eq(password, confirmPassword)) {
        setErrorMessage("The passwords do not match");
      } else {
        register(email, password, (data) => {
          if (!eq(data, null)) {
            if (data?.message) {
              setErrorMessage(`${data?.message}`);
            } else if (data?.token) {
              setAuthCookie(data?.token);
            }
          }
        });
      }
    }
  }, [email, password, confirmPassword]);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Register {"\n"}</Text>
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
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.button.text}>Submit</Text>
      </Pressable>
      <Text>
        {"\n"}Already have an account?{" "}
        <Pressable onPress={() => navigation.navigate(Screens.LOGIN)}>
          <Text style={styles.url}>Click Here to Login!</Text>
        </Pressable>
      </Text>
    </View>
  );
};
