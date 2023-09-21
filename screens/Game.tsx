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
import PlayerModal from "../components/PlayerModal";
import { fetchPlayers } from "../modules/api";
import {
  gamebarStyles,
  gameStyles,
  IComparePlayers,
  IPlayer,
  RequestState,
} from "../modules/constants";
import { getRandomIndex, mapToArray } from "../modules/utils";

const GameBar = ({ score, chances }: { score: number; chances: number }) => {
  return (
    <View>
      <View style={gamebarStyles.row}>
        <View>
          <Text style={gamebarStyles.headerText}>Score</Text>
          <Text>{score}/4</Text>
        </View>
        <View>
          <Text style={gamebarStyles.headerText}>Chances Left</Text>
          <Text>{chances}</Text>
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

interface ISelectedPlayers {
  playerX0Y0: IPlayer | null;
  playerX1Y0: IPlayer | null;
  playerX0Y1: IPlayer | null;
  playerX1Y1: IPlayer | null;
}

const getAxisPlayers = (groupedPlayers: any[] = []): IAxisPlayers => {
  const pIdx = getRandomIndex(groupedPlayers);
  const playerList: [] = groupedPlayers[pIdx];

  const pIdz1 = getRandomIndex(playerList);
  const pIdz2 = getRandomIndex(playerList);
  const pIdz3 = getRandomIndex(playerList);
  const pIdz4 = getRandomIndex(playerList);

  return {
    player1: playerList ? playerList[pIdz1] : null,
    player2: playerList ? playerList[pIdz2] : null,
    player3: playerList ? playerList[pIdz3] : null,
    player4: playerList ? playerList[pIdz4] : null,
  };
};

export const Game = () => {
  const [chances, setChances] = useState(10);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [playerSelectModalOpen, setPlayerSelectModalOpen] = useState(false);

  const [players, setPlayers] = useState<IPlayer[] | []>([]);

  const [axisPlayers, setAxisPlayers] = useState<IAxisPlayers>({
    player1: null,
    player2: null,
    player3: null,
    player4: null,
  });

  const [selectedPlayers, setSelectedPlayers] = useState<ISelectedPlayers>({
    playerX0Y0: null,
    playerX1Y0: null,
    playerX0Y1: null,
    playerX1Y1: null,
  });

  const [playersToCompare, setPlayersToCompare] = useState<IComparePlayers>({
    player1: null,
    player2: null,
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
      <GameBar chances={chances} score={0} />

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
        <TouchableOpacity
          style={gameStyles.cell}
          onPress={() => {
            setPlayersToCompare({
              player1: player1,
              player2: player3,
            });
            setPlayerSelectModalOpen(true);
          }}
        >
          <Text style={gameStyles.cellText}></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={gameStyles.cell}
          onPress={() => {
            setPlayersToCompare({
              player1: player2,
              player2: player3,
            });
            setPlayerSelectModalOpen(true);
          }}
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
        <TouchableOpacity
          style={gameStyles.cell}
          onPress={() => {
            setPlayersToCompare({
              player1: player1,
              player2: player4,
            });
            setPlayerSelectModalOpen(true);
          }}
        >
          <Text style={gameStyles.cellText}></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={gameStyles.cell}
          onPress={() => {
            setPlayersToCompare({
              player1: player2,
              player2: player4,
            });
            setPlayerSelectModalOpen(true);
          }}
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
      <PlayerModal
        isVisible={playerSelectModalOpen}
        players={players}
        chances={chances}
        playersToCompare={playersToCompare}
        onPlayerSelected={() => {}}
        onCloseModal={() => {
          setPlayerSelectModalOpen(false);
        }}
      />
    </View>
  );
};
