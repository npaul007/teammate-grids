import React, { useState, useEffect } from "react";
import { View, Text, Modal, Button, TextInput } from "react-native";
import { IPlayer, modalStyles } from "../modules/constants";

interface PlayerModalProps {
  isVisible: boolean;
  players: IPlayer[] | [];
  chances: number;
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
          <View style={{ marginVertical: 20 }}>
            {players
              .filter(
                (player) =>
                  searchText.toLowerCase().includes(player.first_name) ||
                  searchText.toLowerCase().includes(player.last_name)
              )
              .map((player, index) => (
                <Button
                  key={index}
                  title={player.first_name + " " + player.last_name}
                  onPress={() => handlePlayerSelection(player)}
                />
              ))}
          </View>

          <Button title="Close" onPress={onCloseModal} />
        </View>
      </View>
    </Modal>
  );
};

export default PlayerModal;
