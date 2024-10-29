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
import { readSkills } from "../../services/skill"; 
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";

import { addSkillNV } from "../../services/skill";

export default function AddMemberSkill({ navigation, route }) {
  const { employeeId } = route.params;
  const [Skills, setSkils] = useState([]);

  const [selecDate, setSelecDate] = useState("");

  const [mask, setSkill_id] = useState("");
  const [imageSK, setImageSK] = useState(null);
  const [mota, setMota] = useState("");

  const [visibleCalendar, setVisibleCalendar] = useState(false);

  // hamf laays data bằng cấp
  const getListSkill = async () => {
    const data = await readSkills();
    const arrData = Object.values(data);
    setSkils(arrData);
  };

  useEffect(() => {
    getListSkill();
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
      setImageSK(result.assets[0].uri);
    }
  };

  const handleAddSkill_NV = async () => {
    const data = {
      employeeId: employeeId,
      mask: mask,
      ngaycap: selecDate,
      mota: mota,
      xacthuc: "0",
    };

    if (!imageSK|| !mask || !selecDate) {
      Alert.alert("Không thể thêm!", "Vui lòng cung cấp đầy đủ thông tin.");
      return;
    }
    await addSkillNV(data, imageSK);
    Alert.alert("Thông báo!", "Thêm kĩ năng thành công");

    navigation.goBack();
  };

  return (
    <>
      <BackNav
        navigation={navigation}
        name={"Kĩ năng"}
        btn={"Lưu"}
        onEditPress={handleAddSkill_NV}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <Text style={styles.label}>Kĩ năng</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setSkill_id(value);
            }}
            items={Skills.map((bc) => {
              return {
                value: bc.mask,
                label: bc.tensk,
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
                  imageSK
                    ? { uri: imageSK }
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
