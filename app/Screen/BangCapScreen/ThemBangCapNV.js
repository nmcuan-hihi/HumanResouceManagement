import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import BackNav from "../../Compoment/BackNav";
import RNPickerSelect from "react-native-picker-select";
import { addEmployee, readBangCap } from "../../services/database"; // Import hàm thêm nhân viên và đọc phòng ban
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";

import { addBangCapNV } from "../../services/bangcapdb";

export default function AddMember({ navigation, route }) {
  const { employeeId } = route.params;
  const [bangCaps, setBangCaps] = useState([]);

  const [selecDate, setSelecDate] = useState("");

  const [bangcap_id, setBangCap_id] = useState("");
  const [imageBC, setImageBC] = useState(null);
  const [mota, setMota] = useState("");

  const [visibleCalendar, setVisibleCalendar] = useState(false);

  // hamf laays data bằng cấp
  const getListBangCap = async () => {
    const data = await readBangCap();
    const arrData = Object.values(data);
    setBangCaps(arrData);
  };

  useEffect(() => {
    getListBangCap();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối!", "Vui lòng cấp quyền để chọn ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageBC(result.assets[0].uri);
    }
  };

  const handleAddBangCap_NV = async () => {
    const data = {
      employeeId: employeeId,
      bangcap_id: bangcap_id,
      ngaycap: selecDate,
      mota: mota,
      xacthuc: "0",
    };

    if (!imageBC || !bangcap_id || !selecDate) {
      Alert.alert("Không thể thêm!", "Vui lòng cung cấp đầy đủ thông tin.");
      return;
    }
    await addBangCapNV(data, imageBC);
    Alert.alert("Thông báo!", "Thêm bằng cấp thành công");

    navigation.goBack();
  };

  return (
    <>
      <BackNav
        navigation={navigation}
        name={"Bằng cấp"}
        btn={"Lưu"}
        onEditPress={handleAddBangCap_NV}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <Text style={styles.label}>Bằng cấp</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setBangCap_id(value);
            }}
            items={bangCaps.map((bc) => {
              return {
                value: bc.bangcap_id,
                label: bc.tenBang,
              };
            })}
            style={pickerSelectStyles}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.label}>Ngày cấp</Text>

            <TouchableOpacity
              onPress={() => {
                setVisibleCalendar(true);
              }}
            >
              <Icon name={"today"} size={30} color="red" />
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={visibleCalendar}
          >
            <View style={styles.modal}>
              <View style={{ width: "80%" }}>
                <TouchableOpacity
                  style={styles.iconCld}
                  onPress={() => {
                    setVisibleCalendar(false);
                  }}
                >
                  <Icon name={"close"} size={40} color="black" />
                </TouchableOpacity>
                <Calendar
                  onDayPress={(day) => {
                    setSelecDate(day.dateString);
                  }}
                  markedDates={{
                    [selecDate]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedDotColor: "orange",
                    },
                  }}
                />
              </View>
            </View>
          </Modal>

          <TextInput
            style={styles.input}
            value={selecDate}
            editable={false}
          ></TextInput>

          <Text style={styles.label}>Ảnh</Text>

          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  imageBC
                    ? { uri: imageBC }
                    : require("../../../assets/image/images.png")
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Mô tả</Text>
          <TextInput style={styles.input} onChangeText={setMota} value={mota} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: "#fff",
    marginTop: -20,
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    color: "blue",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconCld: {
    position: "absolute",
    zIndex: 1000,
    right: 0,
    marginTop: -40,
  },
});

// Styles cho RNPickerSelect
const pickerSelectStyles = {
  inputIOS: {
    color: "black",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 16,
  },
  inputAndroid: {
    color: "black",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 16,
  },
};
