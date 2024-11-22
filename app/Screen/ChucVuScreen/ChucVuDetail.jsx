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
import {
  readChucVu,
  updateChucVu,
  deleteChucVu,
} from "../../services/database";

export default function ChucVuDetail({ route, navigation }) {
  const { chucVuId, chucvu_id } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [currentChucVu, setCurrentChucVu] = useState("");
  const [editedChucVu, setEditedChucVu] = useState("");
  const [currentHeSo, setCurrentHeSo] = useState("");
  const [editedHeSo, setEditedHeSo] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChucVu = async () => {
      setLoading(true);
      try {
        const chucVuData = await readChucVu();
        if (chucVuData && chucVuData[chucVuId]) {
          const chucVu = chucVuData[chucVuId];
          setCurrentChucVu(chucVu.loaichucvu);
          setEditedChucVu(chucVu.loaichucvu);
          setCurrentHeSo(chucVu.hschucvu);
          setEditedHeSo(chucVu.hschucvu);
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải dữ liệu chức vụ.");
        console.error("Lỗi khi lấy dữ liệu chức vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChucVu();
  }, [chucVuId]);

  const handleSave = async () => {
    if (editedHeSo.trim() === "") {
      Alert.alert("Lỗi", "Hệ số chức vụ không được để trống.");
      return;
    }
    if (isNaN(editedHeSo)) {
      Alert.alert("Lỗi", "Hệ số chức vụ phải là một số.");
      return;
    }
    try {
      const updatedChucVu = {
        loaichucvu: editedChucVu,
        hschucvu: editedHeSo,
      };
      await updateChucVu(chucvu_id, updatedChucVu);
      setCurrentChucVu(editedChucVu);
      setCurrentHeSo(editedHeSo);
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thông tin chức vụ.");
      console.error("Lỗi khi lưu thông tin chức vụ:", error);
    }
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = async () => {
    try {
      await deleteChucVu(chucvu_id);
      setConfirmDelete(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa chức vụ.");
      console.error("Lỗi khi xóa chức vụ:", error);
      setConfirmDelete(false);
    }
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

  return (
    <>
      <View style={styles.header}>
        <BackNav navigation={navigation} name="Chi tiết chức vụ" />
      </View>

      <SafeAreaView style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <ScrollView>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Mã chức vụ</Text>
              <Text style={styles.sectionTitle1}>{chucvu_id}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Tên chức vụ</Text>
              <Text>{currentChucVu}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Hệ số chức vụ</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  placeholder="Hệ số chức vụ"
                  value={editedHeSo}
                  onChangeText={setEditedHeSo}
                  keyboardType="numeric"
                />
              ) : (
                <View style={styles.inlineEditContainer}>
                  <Text style={styles.sectionTitle1}>{currentHeSo}</Text>
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
                chucVuId !== "TP" &&
                chucVuId !== "NV" && (
                  <TouchableOpacity
                    style={styles.btnXoa}
                    onPress={handleDelete}
                  >
                    <Text style={styles.nameBtn}>Xóa</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </ScrollView>
        )}

        <Modal visible={confirmDelete} transparent={true} animationType="slide">
          <View style={styles.modalCtn}>
            <View style={styles.bodyModal}>
              <Text style={styles.confirmText}>
                Bạn có chắc chắn muốn xóa chức vụ này không?
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
  textInput: {
    fontSize: 18,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  buttonSection: {
    marginTop: 20,
    alignItems: "center",
  },
  btnSave: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  btnXoa: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    justifyContent: "center",
  },
  nameBtn: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bodyModal: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
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
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalBtnText: {
    color: "white",
    fontSize: 16,
  },
});
