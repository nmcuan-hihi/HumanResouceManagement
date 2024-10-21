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
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import Feather from 'react-native-vector-icons/Feather';
import {
  readSkill,
  editSkill,
  removeSkill,
} from  "../../services/database";

export default function DetailSkill({ navigation, route }) {
  const { maSK, tenSK } = route.params; // Lấy giá trị từ params
  const [isEditing, setIsEditing] = useState(false);
  const [currentTenSK, setCurrentTenSK] = useState(tenSK);
  const [editedTenSK, setEditedTenSK] = useState(tenSK);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchSkill = async () => {
      const skillData = await readSkill(maSK);
      if (skillData) {
        setCurrentTenSK(skillData.tensk);
        setEditedTenSK(skillData.tensk);
      }
    };
    fetchSkill();
  }, [maSK]);

  const handleSave = async () => {
    await editSkill(maSK, { tensk: editedTenSK });
    setCurrentTenSK(editedTenSK);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = async () => {
    await removeSkill(maSK);
    navigation.goBack(); // Quay lại sau khi xóa
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

  return (
    <>
      <View style={styles.header}>
        <BackNav navigation={navigation} name={"Chi tiết kỹ năng"} />
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Thông tin kỹ năng */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Mã kỹ năng</Text>
            <Text style={styles.sectionTitle1}>{maSK}</Text>
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
                <Text style={styles.sectionTitle22}>{currentTenSK}</Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editBtn}
                >
                  <Feather name="edit-2" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.buttonSection}>
            {isEditing ? (
              <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                <Text style={styles.nameBtn}>Lưu</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnXoa} onPress={handleDelete}>
                <Text style={styles.nameBtn}>Xóa</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Modal xác nhận xóa */}
        <Modal visible={confirmDelete} transparent={true} animationType="slide">
          <View style={styles.modalCtn}>
            <View style={styles.bodyModal}>
              <Text style={styles.confirmText}>
                Bạn có chắc chắn muốn xóa kỹ năng này không?
              </Text>
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
    flex: 1,
    backgroundColor: "#F2F2F7",
    margin: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
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
  },
  btnXoa: {
    width: "90%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  nameBtn: {
    fontSize: 22,
    color: "#FFFFFF",
  },
  modalCtn: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyModal: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalBtn: {
    width: "40%",
    padding: 10,
    backgroundColor: "#FFA500",
    borderRadius: 5,
    alignItems: "center",
  },
  modalBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
