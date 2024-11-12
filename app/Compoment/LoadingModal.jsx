import React from "react";
import { View, ActivityIndicator, Modal, StyleSheet,Text } from "react-native";

const LoadingModal = ({ visible }) => {
  return (
    <Modal transparent={true}  visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="#2196F3" />
        <Text>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activityIndicatorWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",

    
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default LoadingModal;