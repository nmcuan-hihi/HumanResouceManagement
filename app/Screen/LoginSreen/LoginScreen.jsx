import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getEmployeeById } from "../../services/EmployeeFireBase";
import { useDispatch } from "react-redux";
import { saveIdCty } from "../../redux/slices/ctySlice";

export default function LoginScreen({ navigation }) {
  const [companyId, setCompanyId] = useState("Nhabee");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!companyId || !employeeId || !password) {
      Alert.alert("Error", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      dispatch(saveIdCty(companyId));

      const employeeData = await getEmployeeById(employeeId);

      if (employeeData && password === employeeData.matKhau) {
        navigation.navigate("UserTabNav", { employee: employeeData });
      } else {
        Alert.alert("Error", "User hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      Alert.alert("Error", "Đã xảy ra lỗi khi đăng nhập.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Ionicons
          style={{ marginEnd: 10 }}
          name="person-circle-outline"
          size={30}
          color="blue"
        />
      </View>

      <Text style={styles.subTitle}>
        Nhập ID công ty, ID nhân viên và mật khẩu để đăng nhập.
      </Text>

      {/* Nhập ID công ty */}
      <View style={styles.inputContainer}>
        <Ionicons name="link-outline" size={20} color="#000" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="ID công ty"
          value={companyId}
          onChangeText={setCompanyId}
        />
      </View>

      {/* Nhập ID nhân viên */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#000" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="ID nhân viên"
          value={employeeId}
          onChangeText={setEmployeeId}
        />
      </View>

      {/* Nhập mật khẩu */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#000" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Dòng tạo công ty */}
      <TouchableOpacity
        style={styles.createCompanyContainer}
        onPress={() => navigation.navigate("LoginCongTy")}
      >
        <Text style={styles.createCompanyText}>Tạo Công Ty</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    color: "blue",
    fontSize: 24,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    color: "#6e6e6e",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 7,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00BFFF",
    borderRadius: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  createCompanyContainer: {
    marginTop: 10,
    alignSelf: "center",
  },
  createCompanyText: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
});
