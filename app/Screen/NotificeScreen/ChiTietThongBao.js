import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { CheckBox } from "@rneui/themed";
import BackNav from "../../Compoment/BackNav";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dangKyNghiPhep } from "../../services/NghiPhepDB";
import { readPhongBanFromRealtime } from "../../services/PhongBanDatabase";
import DropDownPicker from "react-native-dropdown-picker";

export default function AddThongBao({ route, navigation }) {
    const { thongBao } = route.params;


  function getDayName(date) {
    const days = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    return days[date.getDay()];
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const dayName = getDayName(date);

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    return `${dayName}, ${date.toLocaleString("vi-VN", options)}`;
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackNav name={"Chi tiết thông báo"} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ width: 200, margin: 10, }}></View>

        <Text style={styles.tieuDe}>{thongBao.tieuDe}</Text>
        <View style={styles.viewTG}>
          <Text style={styles.textTG}>{formatDate(thongBao.thoiGian)}</Text>
        </View>
        <Text style={styles.textArea}>{thongBao.noiDung}</Text>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  tieuDe: {
    fontSize: 20,
  },

  viewTG: {
    padding: 8,
    width: "100%",
  },

  textTG: {
    color: "#999999",
    position: "absolute",
    right: 0,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
    textAlignVertical: "top",
    marginBottom: 10,
    backgroundColor:'#fff9f5'
  },
});
