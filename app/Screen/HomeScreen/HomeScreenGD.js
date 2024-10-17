import { View, Text, StyleSheet } from "react-native";
import React from "react";
import DashboardGD from "../../Compoment/DashboardGD";
import BtnFunction from "../../Compoment/BtnFunction";

export default function HomeScreenGD() {
  return (
    <View style={{ flex: 1 }}>
      <DashboardGD />
      <View style={styles.containerFunc}>
        <View style={styles.rowFunc}>
          <BtnFunction textBtn={"Gửi thông báo"} nameIcon={"notifications"} />
          <BtnFunction textBtn={"Nhân viên"} nameIcon={"person"} />
          <BtnFunction textBtn={"Phòng ban"} nameIcon={"house"} />
          <BtnFunction textBtn={"Lương nhân viên"} nameIcon={"paid"} />
        </View>
        <View style={styles.rowFunc}>
          <BtnFunction textBtn={"Quản lý mức lương"} nameIcon={"credit-card"} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerFunc: {
    backgroundColor: "#CCFFFF",
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },
  rowFunc: { flexDirection: "row", justifyContent: "flex-start" },
});
