import React, { useState } from "react";
import { Text, View, Pressable, TextInput } from "react-native";
import { Screens, styles } from "../modules/constants";
import { Icon } from "react-native-elements";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export const Register = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    //   onLogin(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Register {"\n"}</Text>
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
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          style={styles.input}
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
