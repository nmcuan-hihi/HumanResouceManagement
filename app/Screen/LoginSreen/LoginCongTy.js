import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { getIdCtyData } from "../../services/loginFrebase";
import { saveIdCty } from "../../redux/slices/ctySlice";

export default function LoginCongTy({ navigation }) {
  const dispatch = useDispatch();

  const [idCty, setIdCty] = useState();
  // Xử lý trạng thái Redux và hiển thị thông báo

  const handleFetch = async () => {
    try {
      const id = await getIdCtyData(idCty);

      if (id!=null &&idCty==id ) {
        dispatch(saveIdCty(id));
        navigation.navigate("Login");
      } else {
        Alert.alert("Thông báo", `Mã công ty không tồn tại`);
      }
    } catch (error) {
      Alert.alert("Lỗi", `Truy cập công ty không thành công`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý nhân sự </Text>

        <Image
          style={styles.anh}
          source={require("../../../assets/images/anhnen.png")}
        />
      </View>

      <Text style={styles.subTitle}>Nhập ID công ty của bạn</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập mã công ty"
        value={idCty}
        onChangeText={setIdCty}
      />

      <TouchableOpacity style={styles.button} onPress={handleFetch}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    color: "blue",
    fontSize: 24,
    fontWeight: "bold",
  },
  anh: {
    width: 200,
    height: 200,
  },
  subTitle: {
    fontSize: 14,
    color: "#6e6e6e",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00BFFF",
    borderRadius: 20,
    height: 50,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 290,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  testButtons: {
    marginTop: 30,
  },
  testButton: {
    backgroundColor: "#d3d3d3",
    borderRadius: 15,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  testButtonText: {
    color: "#000",
    fontSize: 16,
  },
});
