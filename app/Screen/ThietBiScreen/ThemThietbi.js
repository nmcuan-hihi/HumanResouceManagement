import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import LoadingModal from "../../Compoment/modalLodading";

import { addThietBiFirebase } from "../../services/thietBicongty";
const { height, width } = Dimensions.get("window");

const AddThietBi = ({ validModal, setValidModal }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [avatarSource, setAvatarSource] = useState(null); // Thêm state cho hình ảnh
  const [validDate, setValidDate] = useState(false);
  const [load, setLoad] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setValidDate(true);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const selectImage = async () => {
    const actionSheetOptions = ["Chọn ảnh", "Chụp ảnh", "Hủy"];

    Alert.alert(
      "Chọn hình ảnh",
      "",
      actionSheetOptions.slice(0, 2).map((option, index) => ({
        text: option,
        onPress: index === 0 ? launchImageLibrary : launchCamera,
      })),
      { cancelable: true }
    );
  };

  const launchImageLibrary = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log(result.assets[0].uri); // In đường dẫn hình ảnh ra console
      setAvatarSource(result.assets[0].uri); // Lưu hình ảnh đã chọn
    }
  };

  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Bạn cần cấp quyền truy cập camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log(result.assets[0].uri); // In đường dẫn hình ảnh ra console
      setAvatarSource(result.assets[0].uri); // Lưu hình ảnh đã chụp
    }
  };
  const addThietBi = async () => {
    const data = {
      ten: deviceName,
      loai: deviceType,
      hang: deviceBrand,
      ngayNhap: Intl.DateTimeFormat("en-CA").format(date),
      imageUrl: avatarSource,
      employeeId: null,
      ngayCap: null,
    };

    // Kiểm tra các trường hợp không hợp lệ
    if (
      !deviceName ||
      !deviceType ||
      !deviceBrand ||
      !avatarSource ||
      validDate == false
    ) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin thiết bị");
      return;
    }

    setLoad(true);

    try {
      await addThietBiFirebase(data);
      setDeviceBrand("");
      setDeviceName("");
      setDeviceType("");
      setValidDate(false);
      setValidModal(false);
      setLoad(false);

      Alert.alert("Thông báo", "Thêm thành công");
    } catch (error) {
      setLoad(false);
      Alert.alert("Thông báo", "Hiện tại không thể thêm ");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={validModal}
      onRequestClose={() => {
        setValidModal(!validModal);
      }}
    >
      <View style={styleModel.container}>
        {load && (
          <View
            style={{
              position: "absolute",
              marginTop: 300,
              zIndex: 100,
            }}
          >
            <ActivityIndicator size="large" color="#FFA500" />
          </View>
        )}
        <View style={styleModel.modalView}>
          <View style={styleModel.modalHeader}>
            <Text style={styleModel.textHeader}>Thêm thiết bị</Text>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                position: "absolute",
                justifyContent: "center",
                right: 10,
                paddingTop: 4,
              }}
              onPress={() => setValidModal(false)}
            >
              <Icon name="close" size={24} color="#FFC107" />
            </TouchableOpacity>
          </View>

          <View style={styleModel.bodyContainer}>
            {/* Hiển thị hình ảnh đã chọn */}
            <View style={styleModel.avatarContainer}>
              <TouchableOpacity
                onPress={selectImage}
                style={styleModel.avatar1}
              >
                {avatarSource ? (
                  <Image
                    source={{ uri: avatarSource }}
                    style={styleModel.avatar}
                  />
                ) : (
                  <Image
                    source={require("../../../assets/image/camera.png")}
                    style={styleModel.avatar}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styleModel.viewText}>
              <TextInput
                style={styleModel.textInput}
                placeholder="Tên thiết bị"
                value={deviceName}
                onChangeText={setDeviceName} // Cập nhật giá trị tên thiết bị
              />
            </View>

            <View style={styleModel.viewText}>
              <TextInput
                style={styleModel.textInput}
                placeholder="Loại thiết bị"
                value={deviceType}
                onChangeText={setDeviceType} // Cập nhật giá trị loại thiết bị
              />
            </View>

            <View style={styleModel.viewText}>
              <TextInput
                style={styleModel.textInput}
                placeholder="Hãng thiết bị"
                value={deviceBrand}
                onChangeText={setDeviceBrand} // Cập nhật giá trị hãng thiết bị
              />
            </View>

            <View style={styleModel.viewText}>
              <TouchableOpacity
                style={{ alignItems: "center", height: "100%" }}
                onPress={showDatepicker}
              >
                {validDate ? (
                  <Text style={[styleModel.textNgay, { color: "#000000" }]}>
                    {date.toLocaleDateString()}
                  </Text>
                ) : (
                  <Text style={styleModel.textNgay}>Ngày nhập thiết bị</Text>
                )}
              </TouchableOpacity>
            </View>

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                is24Hour={true}
                onChange={onChange}
              />
            )}

            <View
              style={{
                width: "100%",
                position: "absolute",
                bottom: 10,
                alignSelf: "center",
              }}
            ></View>
          </View>
          <View
            style={{
              width: "100%",
              position: "absolute",
              bottom: 10,
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={styleModel.btnThem} onPress={addThietBi}>
              <Text style={styleModel.nameBtn}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styleModel = StyleSheet.create({
  container: {
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.4)",

    alignItems: "center",
  },
  modalView: {
    marginTop: 30,
    height: "75%",
    width: "90%",
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
  },
  modalHeader: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  textHeader: {
    color: "#FFC107",
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
  },

  bodyContainer: {
    flex: 1,
    padding: 10,
  },

  viewText: {
    marginTop: 5,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar1: {
    width: 130,
    height: 100,
    borderRadius: 20,
    borderWidth: 1,
    padding: 1,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  textBody: {
    color: "#000000",
    fontSize: 18,
  },
  textInput: {
    marginTop: 20,
    color: "#000000",
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    paddingLeft: 5,
    paddingRight: 5,
    height: 50,
    borderColor: "#888888",
  },
  textNgay: {
    marginTop: 20,

    color: "#999999",
    fontSize: 18,
    borderRadius: 10,
    width: "100%",
    paddingLeft: 5,
    paddingRight: 5,
    height: 50,
    borderColor: "#888888",
    borderWidth: 1,
    lineHeight: 50,
  },

  textValid: {
    color: "red",
    marginLeft: "35%",
  },

  btnThem: {
    width: "90%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  nameBtn: {
    fontSize: 22,
    color: "#FFFFFF",
  },
});

const style = StyleSheet.create({});

export default AddThietBi;
