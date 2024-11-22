import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import { addCompany, checkCompanyExists } from "../../services/loginFrebase";
import { useDispatch } from "react-redux";
import { saveIdCty } from "../../redux/slices/ctySlice";
export default function AddCongTy({ navigation }) {
  const [idCongTy, setIdCongTy] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    // Kiểm tra thông tin đầu vào
    if (!idCongTy || !companyName || !directorName || !phoneNumber) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Kiểm tra xem công ty đã tồn tại hay chưa
      const exists = await checkCompanyExists(idCongTy);
      if (exists) {
        Alert.alert("Thông báo", "Mã công ty đã tồn tại. Vui lòng nhập mã khác.");
        return;
      }

        // Lưu companyId vào Redux store và biến toàn cục
        dispatch(saveIdCty(idCongTy));
      // Thêm công ty vào Firebase
      const success = await addCompany(idCongTy, companyName, directorName, phoneNumber);

      if (success) {
        Alert.alert("Thành công", "Công ty đã được tạo thành công! ");
        navigation.goBack(); // Quay về màn hình trước đó
      } else {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi thêm công ty. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm công ty:", error);
      Alert.alert("Lỗi", "Không thể thêm công ty. Vui lòng kiểm tra kết nối mạng.");
    }
  };

  return (
    <View style={styles.container}>
      <BackNav name={"Tạo Công Ty"} />
      <View style={styles.box}>
        <View style={styles.header}>
          <Image
            style={styles.anh}
            source={require("../../../assets/images/anhnen.png")}
          />
        </View>

        <Text style={styles.subTitle}>Nhập thông tin công ty</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập mã công ty"
          value={idCongTy}
          onChangeText={setIdCongTy}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập tên công ty"
          value={companyName}
          onChangeText={setCompanyName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập tên giám đốc"
          value={directorName}
          onChangeText={setDirectorName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Thêm công ty</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  box: {
    flex: 34,
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    justifyContent: "center",
    marginBottom: 20,
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
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
