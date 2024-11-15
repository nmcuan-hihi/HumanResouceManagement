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

import { useSelector } from "react-redux";

export default function LoginScreen({ navigation }) {
  const { idCty } = useSelector((state) => state.congTy);

  const [employeeId, setEmployeeId] = useState("NV000");
  const [password, setPassword] = useState("133"); // Mock password input

  const handleLogin = async () => {
    if (!employeeId) {
      Alert.alert("Error", "Please enter your employee ID.");
      return;
    }

    try {
      const employeeData = await getEmployeeById(employeeId,idCty);

      if (employeeData != null) {
        if (password === employeeData.matKhau) {
          navigation.navigate("UserTabNav", { employee: employeeData });
        } else {
          Alert.alert("Error", "User hoặcMật khẩu không đúng !!!");
        }
      } else {
        Alert.alert("Error", "User hoặcMật khẩu không đúng !!!");
      }
    } catch (error) {
      Alert.alert("Error", "User hoặcMật khẩu không đúng !!!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter your Employee ID</Text>
        <Ionicons
          style={{ marginEnd: 30 }}
          name="person-circle-outline"
          size={24}
          color="blue"
        />
      </View>

      <Text style={styles.subTitle}>
        Enter your employee ID and password to login.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 100,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    color: "blue",
    fontSize: 22,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 14,
    color: "#6e6e6e",
    marginBottom: 30,
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
