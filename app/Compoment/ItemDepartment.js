import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

const ItemDepartment = () => {
  return (
    <TouchableOpacity style={styles.container}>
    <Text style={styles.maPB}>IT01</Text>

    <Text style={styles.namePB}>Phòng IT</Text>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor:'#E5E5E5',
    flexDirection:'row',
    alignItems: 'center'
  },
  maPB:{
    fontSize:25,
    fontWeight:'bold',
    marginStart:20
  },

  namePB:{
    fontSize:18,
    marginStart:60
  }
});

export default ItemDepartment;
