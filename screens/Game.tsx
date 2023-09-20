import { eq, find, groupBy, pick } from "lodash";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { GameInstructionsModal } from "../components";
import { fetchPlayers } from "../modules/api";
import {
  gamebarStyles,
  gameStyles,
  IPlayer,
  RequestState,
} from "../modules/constants";
import { getRandomIndex, getRandomIndexes, mapToArray } from "../modules/utils";

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

const findPlayersWithSameTeams = (players: IPlayer[]) => {
  const groupedPlayers = new Map();

  players &&
    players.forEach((player) => {
      try {
        const teamsPlayed = JSON.parse(player?.teams_played);
        teamsPlayed &&
          teamsPlayed.forEach((team: { team_id: number; season: string }) => {
            const key = String(team?.team_id) + "-" + team?.season;
            if (groupedPlayers.get(key) === undefined) {
              const array = [];
              array.push(player);
              groupedPlayers.set(key, array);
            } else {
              const current = groupedPlayers.get(key);
              current.push(player);
              groupedPlayers.set(key, current);
            }
          });
      } catch (error: any) {}
    });

  return groupedPlayers;
};

interface IAxisPlayers {
  player1: IPlayer | null;
  player2: IPlayer | null;
  player3: IPlayer | null;
  player4: IPlayer | null;
}

const getAxisPlayers = (groupedPlayers: any[] = []): IAxisPlayers => {
  const pIdx1 = getRandomIndex(groupedPlayers);
  const pIdx2 = getRandomIndex(groupedPlayers);

  const playerList1: [] = groupedPlayers[pIdx1];
  const playerList2: [] = groupedPlayers[pIdx2];

  const p1Idx1 = getRandomIndex(playerList1);
  const p1Idx2 = getRandomIndex(playerList1);
  const p2Idx1 = getRandomIndex(playerList2);
  const p2Idx2 = getRandomIndex(playerList2);

  return {
    player1: playerList1 ? playerList1[p1Idx1] : null,
    player2: playerList1 ? playerList1[p1Idx2] : null,
    player3: playerList2 ? playerList2[p2Idx1] : null,
    player4: playerList2 ? playerList2[p2Idx2] : null,
  };
};

export const Game = () => {
  const [chances, setChances] = useState(9);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [players, setPlayers] = useState<IPlayer[] | []>([]);

  const [axisPlayers, setAxisPlayers] = useState<IAxisPlayers>({
    player1: null,
    player2: null,
    player3: null,
    player4: null,
  });

  const { player1, player2, player3, player4 } = axisPlayers;

  const [playersRequestState, setPlayersRequestState] = useState(
    RequestState.IDLE
  );

  useEffect(() => {
    if (eq(RequestState.IDLE, playersRequestState)) {
      setPlayersRequestState(RequestState.REQUESTED);
      fetchPlayers((data) => {
        if (data.players && data.players?.length) {
          const { players } = data;
          setPlayers(players);

          const groupedPlayersMap = findPlayersWithSameTeams(players);
          const groupedPlayers = mapToArray(groupedPlayersMap);
          const { player1, player2, player3, player4 } =
            getAxisPlayers(groupedPlayers);
          setAxisPlayers({ player1, player2, player3, player4 });
        }

        setPlayersRequestState(RequestState.RECEIVED);
      });
    }
  }, [
    playersRequestState,
    fetchPlayers,
    setPlayers,
    setPlayersRequestState,
    setAxisPlayers,
  ]);

  return (
    <View style={gameStyles.container}>
      <GameBar />

      <Text style={gameStyles.header}>Sudoku Board</Text>

      <View style={gameStyles.row}>
        <View style={gameStyles.cellCorner}></View>
        <View style={gameStyles.cellHeader}>
          <Text style={gameStyles.cellHeaderText}>
            {" "}
            {player1?.first_name} {player1?.last_name}
          </Text>
        </View>
        <View style={gameStyles.cellHeader}>
          <Text style={gameStyles.cellHeaderText}>
            {" "}
            {player2?.first_name} {player2?.last_name}
          </Text>
        </View>
      </View>

      <View style={gameStyles.row}>
        <View style={gameStyles.cellHeader}>
          <Text style={gameStyles.cellHeaderText}>
            {player3?.first_name} {player3?.last_name}
          </Text>
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
          <Text style={gameStyles.cellHeaderText}>
            {player4?.first_name} {player4?.last_name}
          </Text>
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

      <Pressable
        onPress={() => {
          setTutorialModalOpen(true);
        }}
      >
        <Text style={gameStyles.instructionsText}>{"\n"}View Instructions</Text>
      </Pressable>

      <GameInstructionsModal
        isVisible={tutorialModalOpen}
        onClose={() => setTutorialModalOpen(false)}
      />
    </View>
  );
};
