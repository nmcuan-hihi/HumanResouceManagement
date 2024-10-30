import React, { useState } from "react";
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
import { deleteBangCap, updateBangCap } from "../../services/database";
import { validateBangCapData } from "../../services/validate";
export default function DetailBangCap({ navigation, route }) {
  const { bangcap_id, tenBang } = route.params.item;

  const [isEditing, setIsEditing] = useState(false);
  const [currentTenBC, setCurrentTenBC] = useState(tenBang);
  const [editedTenBC, setEditedTenBC] = useState(tenBang);
  const [confirmDelete, setConfirmDelete] = useState(false); // State để hiển thị modal xác nhận xóa

  // Handle save
  const handleSave = async () => {
    if (editedTenBC == null || editedTenBC.trim() === "") {
      Alert.alert("Lỗi", "Tên bằng cấp không được để trống.");
      return;
    }
    
    try {
      await updateBangCap(bangcap_id, editedTenBC);
      setCurrentTenBC(editedTenBC);
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thông tin. Vui lòng thử lại.");
    }
  };
  

  // Handle cancel
  const handleCancel = () => {
    setEditedTenBC(currentTenBC);
    setIsEditing(false);
  };

  // Handle delete confirmation
  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = async () => {
    try {
      await deleteBangCap(bangcap_id);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa bằng cấp. Vui lòng thử lại.");
    }
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

  return (
    <><BackNav navigation={navigation} name={"Chi tiết bằng cấp"} /><>
     

      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Thông tin bằng cấp */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Mã bằng cấp</Text>
            <Text style={styles.sectionTitle1}>{bangcap_id}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Tên bằng cấp</Text>
            {isEditing ? (
              <TextInput
                style={styles.TextInput}
                placeholder="Tên bằng cấp"
                value={editedTenBC}
                onChangeText={(text) => setEditedTenBC(text)} />
            ) : (
              <View style={styles.inlineEditContainer}>
                <Text style={styles.sectionTitle22}>{currentTenBC}</Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editBtn}
                >
                  <Feather
                    name="edit-2"
                    size={20}
                    color="#FFFFFF"
                    style={styles.fea} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Nút lưu hoặc xóa */}
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

        {/* Modal xác nhận xóa */}
        <Modal visible={confirmDelete} transparent={true} animationType="slide">
          <View style={styles.modalCtn}>
            <View style={styles.bodyModal}>
              <Text style={styles.confirmText}>
                Bạn có chắc chắn muốn xóa bằng cấp này không?
              </Text>
              <View style={styles.modalBtnContainer}>
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={confirmDeleteYes}
                >
                  <Text style={styles.modalBtnText}>Có</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={confirmDeleteNo}
                >
                  <Text style={styles.modalBtnText}>Không</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 9,
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
    marginBottom: 30,
  },
  TextInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
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
