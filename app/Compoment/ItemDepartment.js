import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

const ItemDepartment = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.maPB}>{item.maPhongBan}</Text>

      <Text style={styles.namePB}>{item.tenPhongBan}</Text>
      <Text style={styles.nameTP}>{item.tenTp} </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "90%",
    height: 70,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    elevation: 5,
  },
  maPB: {
    flex: 2,
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginStart: 20,
  },
  namePB: {
    flex: 5,
    fontSize: 20,
    color: "blue",
    marginStart: 20,
  },

  nameTP: {
    flex: 5,
    fontSize: 18,
    color: "orange",
    marginStart: 20,
  },
});

export default ItemDepartment;
