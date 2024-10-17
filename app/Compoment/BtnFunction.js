import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

const BtnFunction = ({ onPress, nameIcon, textBtn }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={nameIcon} size={30} color="#FFA000" />
      <Text style={styles.textName}>{textBtn}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    alignItems: "center",
    margin: 5,
    borderRadius: 5,
  },
  textName: {
    textAlign: "center",
    fontSize: 13,
  },
});
export default BtnFunction;
