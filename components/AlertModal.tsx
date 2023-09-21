import React from "react";
import { View, Text, TouchableOpacity, Alert, Modal } from "react-native";
import { modalStyles } from "../modules/constants";

interface AlertModalProps {
  gameWon: boolean;
  gameLost: boolean;
  visible: boolean | undefined;
  onPressButton: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  onPressButton,
  visible,
  gameWon,
  gameLost,
}) => {
  const showAlert = () => {
    Alert.alert("Alert", "This is a simple alert modal.");
  };

  let text = "";
  if (gameWon) {
    text =
      "CONGRATS!! You've one the game!\nClick the Button below to Play Again!\n";
  }

  if (gameLost) {
    text = "Sadly you LOST. Click the Button below to Try Again!\n";
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <Text>{text}</Text>
            <TouchableOpacity
              onPress={onPressButton}
              style={{ padding: 10, backgroundColor: "blue", borderRadius: 5 }}
            >
              <Text style={{ color: "white" }}>Play Again!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
