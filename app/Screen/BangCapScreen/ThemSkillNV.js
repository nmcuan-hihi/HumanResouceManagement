import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import RNPickerSelect from "react-native-picker-select";
import { readSkills } from "../../services/skill"; 
import { addSkillNV } from "../../services/skill";

export default function AddMemberSkill({ navigation, route }) {
  const { employeeId } = route.params;
  const [Skills, setSkills] = useState([]);
  const [mask, setSkill_id] = useState("");

  // Function to load skill data
  const getListSkill = async () => {
    const data = await readSkills();
    const arrData = Object.values(data);
    setSkills(arrData);
  };

  useEffect(() => {
    getListSkill();
  }, []);

  const handleAddSkill_NV = async () => {
    const data = {
      employeeId: employeeId,
      mask: mask,
    };

    if (!mask) {
      Alert.alert("Không thể thêm!", "Vui lòng cung cấp đầy đủ thông tin.");
      return;
    }
    
    await addSkillNV(data);
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
