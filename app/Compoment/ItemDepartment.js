import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

const ItemDepartment = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.maPB}>{item.maPB}</Text>

      <Text style={styles.namePB}>{item.tenPB}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "90%",
    height: 60,
    borderRadius: 20,
    backgroundColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    elevation: 5,
    backgroundColor: "#FFFFFF",
  },
  maPB: {
    fontSize: 25,
    fontWeight: "bold",
    marginStart: 20,
  },

  namePB: {
    fontSize: 18,
    marginStart: 60,
  },
});

export default ItemDepartment;
