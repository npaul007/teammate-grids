import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { gamebarStyles, gameStyles } from "../modules/constants";

const playerPool = ["Player 1", "Player 2", "Player 3", "Player 4"];

const GameBar = () => {
  return (
    <View>
      <View style={gamebarStyles.row}>
        <View>
          <Text style={gamebarStyles.headerText}>Your High Score</Text>
          <Text>0</Text>
        </View>
        <View>
          <Text style={gamebarStyles.headerText}>Score</Text>
          <Text>0/4</Text>
        </View>
        <View>
          <Text style={gamebarStyles.headerText}>Chances Left</Text>
          <Text>10</Text>
        </View>
      </View>
    </View>
  );
};

export const Game = () => {
  const [selectedPlayers, setSelectedPlayers] = useState(Array(9).fill(null));

  const handlePlayerSelection = (cellIndex: number, player: any) => {
    setSelectedPlayers((prevSelectedPlayers) => {
      const newSelectedPlayers = [...prevSelectedPlayers];
      newSelectedPlayers[cellIndex] = player;
      return newSelectedPlayers;
    });
  };

  return (
    <View style={gameStyles.container}>
      <GameBar />
      <Text style={gameStyles.header}>Sudoku Board</Text>
      <View style={gameStyles.row}>
        <View style={gameStyles.cellCorner}></View>
        <View style={gameStyles.cellHeader}>
          <Text style={gameStyles.cellHeaderText}>X0</Text>
        </View>
        <View style={gameStyles.cellHeader}>
          <Text style={gameStyles.cellHeaderText}>X1</Text>
        </View>
      </View>
      <View style={gameStyles.row}>
        <View style={gameStyles.cellHeader}>
          <Text style={gameStyles.cellHeaderText}>Y0</Text>
        </View>
        <TouchableOpacity style={gameStyles.cell}>
          <Text style={gameStyles.cellText}></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={gameStyles.cell}
          // onPress={() =>
          //   handlePlayerSelection(
          //     index,
          //     player === null ? playerPool[0] : null
          //   )
          // }
        >
          <Text style={gameStyles.cellText}></Text>
        </TouchableOpacity>
      </View>
      <View style={gameStyles.row}>
        <View style={gameStyles.cellHeader}>
          <Text style={gameStyles.cellHeaderText}>Y1</Text>
        </View>
        <TouchableOpacity style={gameStyles.cell}>
          <Text style={gameStyles.cellText}></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={gameStyles.cell}
          // onPress={() =>
          //   handlePlayerSelection(
          //     index,
          //     player === null ? playerPool[0] : null
          //   )
          // }
        >
          <Text style={gameStyles.cellText}></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
