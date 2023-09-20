import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { GameInstructionsModal } from "../components";
import {
  gamebarStyles,
  gameStyles,
  IPlayer,
  RequestState,
} from "../modules/constants";

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

const FirstRow = () => {
  return (
    <View style={gameStyles.row}>
      <View style={gameStyles.cellCorner}></View>
      <View style={gameStyles.cellHeader}>
        <Text style={gameStyles.cellHeaderText}>X0</Text>
      </View>
      <View style={gameStyles.cellHeader}>
        <Text style={gameStyles.cellHeaderText}>X1</Text>
      </View>
    </View>
  );
};

export const Game = () => {
  const [chances, setChances] = useState(9);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [players, setPlayers] = useState<IPlayer[] | []>([]);
  const [playersRequestState, setPlayersRequestState] = useState(
    RequestState.IDLE
  );

  return (
    <View style={gameStyles.container}>
      <GameBar />

      <Text style={gameStyles.header}>Sudoku Board</Text>

      <FirstRow />
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

      <Pressable onPress={() => setTutorialModalOpen(true)}>
        <Text style={gameStyles.instructionsText}>{"\n"}View Instructions</Text>
      </Pressable>

      <GameInstructionsModal
        isVisible={tutorialModalOpen}
        onClose={() => setTutorialModalOpen(false)}
      />
    </View>
  );
};
