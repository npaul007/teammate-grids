import React, { useState } from "react";
import { Text, View, Pressable, TextInput } from "react-native";
import { styles } from "../modules/constants";
import { Icon } from "react-native-elements";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

// Create screen components
export const Login = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    //   onLogin(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Welcome to TEAMMATE GRIDS!</Text>
      <Text style={styles.h2}>Login to Play! {"\n"}</Text>
      <View style={styles.inputContainer}>
        <Icon name="email" size={24} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
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
        />
      </View>
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.button.text}>Login</Text>
      </Pressable>
      <Text>{"\n"}Don't have an account? Register here!</Text>
    </View>
  );
};
