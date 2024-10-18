import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

const ItemDepartment = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.maPB}>{item.maPhongBan}</Text>

      <Text style={styles.namePB}>{item.tenPhongBan}</Text>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1, // Thêm độ mờ cho bóng
    shadowRadius: 4, // Thêm độ mềm cho bóng
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
});

export default ItemDepartment;