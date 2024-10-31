import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import Feather from "react-native-vector-icons/Feather";
import { readSkill1, updateSkill, deleteSkill } from "../../services/skill";


export default function DetailSkill({ navigation, route }) {
  const { item } = route.params;
  const maSK = item ? item.maSK : "";
  const [skillDetails, setSkillDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTenSK, setEditedTenSK] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchSkillDetails = async () => {
      const details = await readSkill1(maSK.trim());
      if (details) {
        setSkillDetails(details);
        setEditedTenSK(details.tensk);
      }
    };
    fetchSkillDetails();
  }, [maSK]);

  const handleSave = async () => {
    // Kiểm tra dữ liệu trước khi lưu
    if (editedTenSK == null || editedTenSK.trim() === "") {
      Alert.alert("Lỗi", "Tên kĩ năng không được để trống.");
      return;
    }

    // Nếu dữ liệu hợp lệ, tiếp tục cập nhật
    try {
      await updateSkill(maSK, { tensk: editedTenSK });
      setSkillDetails((prev) => ({ ...prev, tensk: editedTenSK }));
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Could not save the skill. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedTenSK(skillDetails.tensk);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = async () => {
    try {
      await deleteSkill(maSK);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Could not delete the skill. Please try again.");
    }
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

  if (!skillDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading skill information...</Text>
      </View>
    );
  }

  return (
    <>
      <BackNav navigation={navigation} name={"Chi tiết kỹ năng"} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Mã kỹ năng</Text>
            <Text style={styles.sectionTitle1}>{skillDetails.mask}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Tên kỹ năng</Text>
            {isEditing ? (
              <TextInput
                style={styles.TextInput}
                placeholder="Tên kỹ năng"
                value={editedTenSK}
                onChangeText={(text) => setEditedTenSK(text)}
              />
            ) : (
              <View style={styles.inlineEditContainer}>
                <Text style={styles.sectionTitle22}>{skillDetails.tensk}</Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editBtn}
                >
                  <Feather name="edit-2" size={20} color="#FFFFFF" style={styles.fea} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.buttonSection}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                  <Text style={styles.nameBtn}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCancel} onPress={handleCancel}>
                  <Text style={styles.nameBtn}>Hủy</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.btnXoa} onPress={handleDelete}>
                <Text style={styles.nameBtn}>Xóa</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <Modal visible={confirmDelete} transparent={true} animationType="slide">
          <View style={styles.modalCtn}>
            <View style={styles.bodyModal}>
              <Text style={styles.confirmText}>Bạn có chắc chắn muốn xóa kỹ năng này không?</Text>
              <View style={styles.modalBtnContainer}>
                <TouchableOpacity style={styles.modalBtn} onPress={confirmDeleteYes}>
                  <Text style={styles.modalBtnText}>Có</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtn} onPress={confirmDeleteNo}>
                  <Text style={styles.modalBtnText}>Không</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: "#F2F2F7",
    margin: 10,
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionTitle1: {
    fontSize: 20,
    marginBottom: 20,
  },
  sectionTitle22: {
    fontSize: 20,
    marginBottom: 20,
  },
  inlineEditContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editBtn: {
    padding: 8,
    backgroundColor: "#FFA500",
    borderRadius: 5,
    marginBottom: 30,
  },
  TextInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  buttonSection: {
    marginTop: 20,
    alignItems: "center",
  },
  btnSave: {
    width: "90%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  btnCancel: {
    width: "90%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  btnXoa: {
    width: "90%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  nameBtn: {
    fontSize: 22,
    color: "#FFFFFF",
  },
  modalCtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bodyModal: {
    width: "80%",
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtn: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
  },
  modalBtnText: {
    color: "#fff",
    textAlign: "center",
  },
});
