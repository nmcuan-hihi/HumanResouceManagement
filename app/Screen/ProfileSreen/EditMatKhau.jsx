import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getDatabase } from "firebase/database";
import { app } from "../../services/database";
import BackNav from "../../Compoment/BackNav";
import { updateEmployee } from "../../services/database";

export default function EditMatKhau({ navigation, route }) {
  const { employee } = route.params;
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [re_newPass, setRe_NewPass] = useState("");

  const doiMatKhau = async () => {
    if (currentPass === employee.matKhau) {
      if (newPass === re_newPass && newPass.length > 0) {
        const updateMK = { ...employee, matKhau: newPass };
        console.log(updateMK);
        try {
          await updateEmployee(employee.employeeId, updateMK);
          Alert.alert("Thông báo", "Đổi mật khẩu thành công");
          navigation.goBack();
        } catch (error) {
          Alert.alert("Lỗi", "Không thể cập nhật mật khẩu. Vui lòng thử lại.");
        }
      } else {
        Alert.alert("Thông báo", "Mật khẩu mới không khớp hoặc không hợp lệ.");
      }
    } else {
      Alert.alert("Thông báo", "Sai mật khẩu hiện tại.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <BackNav navigation={navigation} name={"Đổi mật khẩu"} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu hiện tại"
        value={currentPass}
        onChangeText={setCurrentPass}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        value={newPass}
        secureTextEntry
        onChangeText={setNewPass}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu"
        value={re_newPass}
        secureTextEntry
        onChangeText={setRe_NewPass}
      />

      <TouchableOpacity style={styles.button} onPress={doiMatKhau}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
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
  navHeader: {
    height: 120,
  },
  input: {
    height: 50,
    borderColor: "#000",
    borderWidth: 2,
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
    marginTop: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
