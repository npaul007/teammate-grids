import React, { useState, useEffect } from "react";
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

interface PlayerModalProps {
  isVisible: boolean;
  players: IPlayer[] | [];
  playersToCompare: IComparePlayers;
  chances: number;
  setChances: (newChances: number) => void;
  onPlayerSelected: (selectedPlayer: IPlayer) => void;
  onCloseModal: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  isVisible,
  players,
  chances,
  onPlayerSelected,
  onCloseModal,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);

  const filteredPlayers = players.filter((player) => {
    const fullName = player.first_name + " " + player.last_name;
    return fullName.toLowerCase().includes(searchText.toLowerCase());
  });

  useEffect(() => {
    setSelectedPlayer(null);
    setSearchText("");
  }, [isVisible]);

  const handlePlayerSelection = (player: IPlayer) => {
    setSelectedPlayer(player);
  };

  const handleSubmit = () => {
    if (selectedPlayer) {
      //   onPlayerSelected(selectedPlayer);
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <TextInput
            placeholder="Search for a player..."
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
