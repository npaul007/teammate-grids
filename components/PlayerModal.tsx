import { eq, every, get } from "lodash";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { IComparePlayers, IPlayer, modalStyles } from "../modules/constants";
import { hasCommonItem } from "../modules/utils";

interface PlayerModalProps {
  isVisible: boolean;
  players: IPlayer[] | [];
  playersToCompare: IComparePlayers;
  chances: number;
  setChances: (newChances: number) => void;
  onPlayerSelected: (playerToSet: string, player: IPlayer) => void;
  onCloseModal: () => void;
}

interface ITeamsPlayed {
  team_id: number;
  season: string;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  isVisible,
  players,
  playersToCompare,
  chances,
  setChances,
  onPlayerSelected,
  onCloseModal,
}) => {
  const [searchText, setSearchText] = useState("");
  const filteredPlayers = players.filter((player) => {
    const fullName = player.first_name + " " + player.last_name;
    return fullName.toLowerCase().includes(searchText.toLowerCase());
  });

  useEffect(() => {
    setSearchText("");
  }, [isVisible]);

  const handlePlayerSelection = useCallback(
    (player: IPlayer) => {
      const { player1, player2, playerToSet } = playersToCompare;
      const teamsPlayed1 = get(player1, "teams_played", "[]");
      const teamsPlayed2 = get(player2, "teams_played", "[]");
      const teamsPlayed = get(player, "teams_played", "[]");
      const list1: ITeamsPlayed[] = JSON.parse(teamsPlayed1);
      const list2: ITeamsPlayed[] = JSON.parse(teamsPlayed2);
      const list: ITeamsPlayed[] = JSON.parse(teamsPlayed);

      if (hasCommonItem(list, list1, list2)) {
        if (playerToSet && player) {
          onPlayerSelected(playerToSet, player);
        }
      } else {
        setChances(chances - 1);
      }

      onCloseModal();
    },
    [playersToCompare, chances, setChances, onCloseModal]
  );

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <TextInput
            placeholder="Search for a player...Click one to choose..."
            onChangeText={(text) => setSearchText(text)}
            value={String(searchText)}
          />
          <ScrollView style={{ maxHeight: 200, width: "100%" }}>
            <View
              style={{
                marginVertical: 20,
                justifyContent: "center",
                alignItems: !filteredPlayers.length ? "center" : "left",
              }}
            >
              {filteredPlayers.length ? (
                filteredPlayers.map((player, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handlePlayerSelection(player)}
                    style={{ backgroundColor: "#ccc", margin: 2, padding: 5 }}
                  >
                    <Text>{player.first_name + " " + player.last_name}</Text>
                  </Pressable>
                ))
              ) : (
                <Text>No Players Found</Text>
              )}
            </View>
          </ScrollView>
          <Text>{"\n"}</Text>
          <Text style={{ color: "green", fontSize: 20, fontWeight: "bold" }}>
            Chances Left: {chances}
          </Text>
          <Text>{"\n"}</Text>
          <Button title="Close" onPress={onCloseModal} />
        </View>
      </View>
    </Modal>
  );
};

export default PlayerModal;
