import { Text, View, Button } from "react-native";

// Create screen components
export const Login = ({ navigation }: { navigation: any }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Login Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation?.navigate("Details")}
      />
    </View>
  );
};
