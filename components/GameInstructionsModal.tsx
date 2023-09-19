import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { modalStyles } from "../modules/constants";

export const GameInstructionsModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const instructions = `Click on a white square and select a Hockey Player that has played with the players listed in the adjacent corners (black background/white text). You have 9 chances to pick correctly. Use your chances wisely!`;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>Game Instructions</Text>
          <Text style={modalStyles.instructionsText}>{instructions}</Text>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
