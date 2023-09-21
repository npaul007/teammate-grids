import { eq, find, groupBy, pick, some } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { GameInstructionsModal } from "../components";
import AlertModal from "../components/AlertModal";
import PlayerModal from "../components/PlayerModal";
import { fetchPlayers } from "../modules/api";
import {
  gamebarStyles,
  gameStyles,
  IComparePlayers,
  IPlayer,
  RequestState,
} from "../modules/constants";
import {
  countNonNullItems,
  getRandomIndex,
  mapToArray,
} from "../modules/utils";

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
  one: IPlayer | null;
  two: IPlayer | null;
  three: IPlayer | null;
  four: IPlayer | null;
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
  const MAX_CHANCES = 10;

  const [chances, setChances] = useState(MAX_CHANCES);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [playerSelectModalOpen, setPlayerSelectModalOpen] = useState(false);

  const [players, setPlayers] = useState<IPlayer[] | []>([]);

  const [axisPlayers, setAxisPlayers] = useState<IAxisPlayers>({
    player1: null,
    player2: null,
    player3: null,
    player4: null,
  });

  const selectedPlayersMap = new Map<string, IPlayer>();
  const [selectedPlayers, setSelectedPlayers] =
    useState<Map<string, IPlayer>>(selectedPlayersMap);

  const selPlayer1 = selectedPlayers.get("one") ?? null;
  const selPlayer2 = selectedPlayers.get("two") ?? null;
  const selPlayer3 = selectedPlayers.get("three") ?? null;
  const selPlayer4 = selectedPlayers.get("four") ?? null;

  const score = countNonNullItems([
    selPlayer1,
    selPlayer2,
    selPlayer3,
    selPlayer4,
  ]);

  const gameWon = eq(score, 4);
  const gameLost = eq(chances, 0);

  const [playersToCompare, setPlayersToCompare] = useState<IComparePlayers>({
    player1: null,
    player2: null,
    playerToSet: null,
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

  const onPlayerSelected = useCallback(
    (playerToSet: string, player: IPlayer) => {
      const newSelectedPlayers = new Map(selectedPlayers);
      newSelectedPlayers.set(playerToSet, player);
      setSelectedPlayers(newSelectedPlayers);
    },
    [playersToCompare]
  );

  const resetGame = useCallback(() => {
    setChances(MAX_CHANCES);
    setSelectedPlayers(new Map<string, IPlayer>());
  }, [MAX_CHANCES, setChances, setSelectedPlayers]);

  return (
    <View style={gameStyles.container}>
      <GameBar chances={chances} score={score} />

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
            if (!selPlayer1) {
              setPlayersToCompare({
                player1: player1,
                player2: player3,
                playerToSet: "one",
              });
              setPlayerSelectModalOpen(true);
            }
          }}
        >
          <Text style={gameStyles.cellText}>
            {selPlayer1?.first_name} {selPlayer1?.last_name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={gameStyles.cell}
          onPress={() => {
            if (!selPlayer2) {
              setPlayersToCompare({
                player1: player2,
                player2: player3,
                playerToSet: "two",
              });
              setPlayerSelectModalOpen(true);
            }
          }}
        >
          <Text style={gameStyles.cellText}>
            {selPlayer2?.first_name} {selPlayer2?.last_name}
          </Text>
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
            if (!selPlayer3) {
              setPlayersToCompare({
                player1: player1,
                player2: player4,
                playerToSet: "three",
              });
              setPlayerSelectModalOpen(true);
            }
          }}
        >
          <Text style={gameStyles.cellText}>
            {selPlayer3?.first_name} {selPlayer3?.last_name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={gameStyles.cell}
          onPress={() => {
            if (!selPlayer4) {
              setPlayersToCompare({
                player1: player2,
                player2: player4,
                playerToSet: "four",
              });
              setPlayerSelectModalOpen(true);
            }
          }}
        >
          <Text style={gameStyles.cellText}>
            {selPlayer4?.first_name} {selPlayer4?.last_name}
          </Text>
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
        setChances={(newChances: number) => setChances(newChances)}
        playersToCompare={playersToCompare}
        onPlayerSelected={onPlayerSelected}
        onCloseModal={() => {
          setPlayerSelectModalOpen(false);
        }}
      />
      <AlertModal
        gameLost={gameLost}
        gameWon={gameWon}
        visible={some([gameWon, gameLost])}
        onPressButton={resetGame}
      />
    </View>
  );
};
