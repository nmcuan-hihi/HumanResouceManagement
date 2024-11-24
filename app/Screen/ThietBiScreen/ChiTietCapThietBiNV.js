import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import { getThietBiById, traThietBi } from "../../services/thietBicongty";
import { getEmployeeById } from "../../services/EmployeeFireBase";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { useFocusEffect } from "@react-navigation/native";

export default function ChiTietCapThietBiNV({ navigation, route }) {
  const { id } = route.params;

  const [thietBi, setThietBi] = useState();
  const [nhanVien, setNhanVien] = useState();

  const getThietBi = async () => {
    try {
      const data = await getThietBiById(id);
      setThietBi(data);

      const dataNV = await getEmployeeById(data.employeeId);
      setNhanVien(dataNV);
    } catch (e) {}
  };

  useFocusEffect(
    useCallback(() => {
      getThietBi();
    }, [])
  );

  const traThietBiNV = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn trả thiết bị này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Trả",
          onPress: async () => {
            try {
              await traThietBi(id, {
                employeeId: null,
                ngayCap: null,
              });
              navigation.goBack();

              Alert.alert("Thông báo", "Trả thiết bị thành công");
            } catch (error) {
              Alert.alert("Lỗi", "Hiện tại không thể trả");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ height: 100 }}>
          <BackNav navigation={navigation} name={"Chi tiết thiết bị"} />
        </View>

        <ScrollView style={{ paddingHorizontal: 15 }}>
          <View style={styles.card}>
            <Text style={styles.label}>Ảnh thiết bị:</Text>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  thietBi?.imageUrl
                    ? { uri: thietBi?.imageUrl }
                    : require("../../../assets/image/images.png")
                }
                style={styles.avatar}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Tên thiết bị:</Text>
              <Text style={styles.textDetail}> {thietBi?.ten}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Loại:</Text>
              <Text style={styles.textDetail}> {thietBi?.loai}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Hãng:</Text>
              <Text style={styles.textDetail}>{thietBi?.hang}</Text>
            </View>

            {thietBi?.employeeId && (
              <>
                <View style={styles.cardRow}>
                  <Text style={styles.label}>Cấp nhân viên:</Text>
                  <Text style={styles.textDetail}>{nhanVien?.name}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.label}>Ngày cấp:</Text>
                  <Text style={styles.textDetail}>{thietBi?.ngayCap}</Text>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={traThietBiNV}>
            <Text style={styles.buttonText}>Trả thiết bị</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
    justifyContent: "space-between",
  },
  tarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  cardRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 5,
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    width: "45%",
  },
  textDetail: {
    fontSize: 18,
    width: "53%",
    color: "#555",
    right: 0,
    textAlign: "right",
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    height: 50,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});
