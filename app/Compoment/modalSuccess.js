import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const ModalSuccess = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Icon name="check-circle" size={60} color="green" />
          <Text style={styles.successText}>Lưu thành công!</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 250,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default ModalSuccess;