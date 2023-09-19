import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { gameStyles } from "../modules/constants";

const playerPool = ["Player 1", "Player 2", "Player 3", "Player 4"];

export const Game = () => {
  const [selectedPlayers, setSelectedPlayers] = useState(Array(6).fill(null));

  const handlePlayerSelection = (cellIndex: number, player: any) => {
    setSelectedPlayers((prevSelectedPlayers) => {
      const newSelectedPlayers = [...prevSelectedPlayers];
      newSelectedPlayers[cellIndex] = player;
      return newSelectedPlayers;
    });
  };

  return (
    <View style={gameStyles.container}>
      <Text style={gameStyles.header}>Sudoku Game</Text>
      <View style={gameStyles.gridContainer}>
        {selectedPlayers.map((player, index) => (
          <TouchableOpacity
            key={index}
            style={gameStyles.cell}
            onPress={() =>
              handlePlayerSelection(
                index,
                player === null ? playerPool[0] : null
              )
            }
          >
            <Text style={gameStyles.cellText}>
              {player !== null ? player : "-"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
