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
import HeaderNav from "../../Compoment/HeaderNav";
import Feather from "react-native-vector-icons/Feather";
import { readSkill1, updateSkill, deleteSkill } from "../../services/skill";

export default function DetailSkill({ navigation, route }) {
  const { item } = route.params; // Lấy item từ params
  const maSK = item ? item.maSK : ""; // Kiểm tra item có tồn tại không
  const [skillDetails, setSkillDetails] = useState(null); // State để lưu thông tin kỹ năng
  const [isEditing, setIsEditing] = useState(false);
  const [editedTenSK, setEditedTenSK] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Gọi hàm readSkill để lấy thông tin kỹ năng khi component được mount
  useEffect(() => {
    const fetchSkillDetails = async () => {
      const details = await readSkill1(maSK.trim()); // Gọi hàm readSkill với mã kỹ năng
      if (details) {
        setSkillDetails(details);
        setEditedTenSK(details.tensk); // Cập nhật tên kỹ năng cho edit
      }
    };
    fetchSkillDetails();
  }, [maSK]);

  // Handle save


  const handleSave = async () => {
    try {
      // Gọi hàm updateSkill với maSK và dữ liệu đã chỉnh sửa
      await updateSkill(maSK, { tensk: editedTenSK });
      
      // Cập nhật state của skillDetails sau khi lưu thành công
      setSkillDetails((prev) => ({ ...prev, tensk: editedTenSK }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving skill:", error); // Xử lý lỗi
    }
  };
  

  // Handle delete confirmation
  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = async () => {
    await deleteSkill(maSK); // Logic to delete the item
    navigation.goBack(); // Quay lại màn hình trước
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

  if (!skillDetails) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông tin kỹ năng...</Text>
      </View>
    ); // Trả về loading state nếu không có dữ liệu
  }

  return (
    <><BackNav navigation={navigation} name={"Chi tiết kỹ năng"}/><>


      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Thông tin kỹ năng */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Mã skill</Text>
            <Text style={styles.sectionTitle1}>{skillDetails.mask}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Tên skill</Text>
            {isEditing ? (
              <TextInput
                style={styles.TextInput}
                placeholder="Tên skill"
                value={editedTenSK}
                onChangeText={(text) => setEditedTenSK(text)} />
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

          {/* Nút lưu hoặc hủy bỏ */}
          {isEditing && (
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                <Text style={styles.btnText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setIsEditing(false)}>
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>Xóa kỹ năng</Text>
          </TouchableOpacity>

          {/* Modal xác nhận xóa */}
          <Modal
            visible={confirmDelete}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Bạn có chắc chắn muốn xóa kỹ năng này?</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={confirmDeleteYes} style={styles.confirmButton}>
                    <Text style={styles.confirmText}>Có</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={confirmDeleteNo} style={styles.confirmButton}>
                    <Text style={styles.confirmText}>Không</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 9,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#FFA500",
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionTitle1: {
    fontSize: 16,
    color: "#333",
    padding: 10,
    backgroundColor: "#e8e8e8",
    borderRadius: 5,
  },
  inlineEditContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle22: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  editBtn: {
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 5,
  },
  TextInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  btnSave: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  btnCancel: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
  },
  deleteBtn: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F44336",
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
  },
});
