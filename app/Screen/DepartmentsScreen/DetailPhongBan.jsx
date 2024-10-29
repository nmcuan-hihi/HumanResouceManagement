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
import Feather from "react-native-vector-icons/Feather";
import {
  readPhongBan,
  editPhongBan,
  removePhongBan,
} from "../../services/database";
import {
  getEmployeeById,
  readEmployees,
  updateEmployee,
} from "../../services/database";
import { SelectList } from "react-native-dropdown-select-list";
import { validatePhongBanData } from "../../utils/validate";

export default function DetailPB({ navigation, route }) {
  const { maPhongBan } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [currentTenPB, setCurrentTenPB] = useState("");
  const [editedTenPB, setEditedTenPB] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentMaTP, setCurrentMaTP] = useState("");
  const [editedMaTP, setEditedMaTP] = useState("");
  const [truongPhong, setTruongPhong] = useState({ name: "" });
  const [dataSelect, setDataSelect] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]); // State for error messages

  // Lấy danh sách nhân viên
  const getListNV = async () => {
    const data = await readEmployees();
    const dataArr = Object.values(data);
    const arrTP = dataArr.filter((nv) => {
      return nv.chucvuId !== "TP" && nv.chucvuId !== "GD";
    });
    const dataDropDown = arrTP.map((nv) => {
      return {
        key: nv.employeeId,
        value: nv.name,
      };
    });
    setDataSelect(dataDropDown);
  };

  useEffect(() => {
    getListNV();
  }, []);

  // Fetch phong ban details
  const fetchPhongBan = async () => {
    const phongBanData = await readPhongBan();
    if (phongBanData) {
      const phongBan = phongBanData[maPhongBan]; // Get data for specific department
      if (phongBan) {
        setCurrentTenPB(phongBan.tenPhongBan);
        setEditedTenPB(phongBan.tenPhongBan);
        setCurrentMaTP(phongBan.maQuanLy);
        setEditedMaTP(phongBan.maQuanLy);
        getDataTruongPhong(phongBan.maQuanLy);
      }
    }
  };

  // Lấy thông tin trưởng phòng
  const getDataTruongPhong = async (maTP) => {
    try {
      const data = await getEmployeeById(maTP);
      setTruongPhong(data);
    } catch (e) {
      console.log("Lỗi khi lấy thông tin trưởng phòng:", e);
    }
  };

  useEffect(() => {
    fetchPhongBan(); // Call fetchPhongBan when component mounts
  }, [maPhongBan]); // Run again if maPhongBan changes

  const handleSave = async () => {
    // Validate data before saving
    const validationErrors = validatePhongBanData({
      maPhongBan,
      tenPhongBan: editedTenPB,
      selectedManager: editedMaTP,
    });

    if (validationErrors.length > 0) {
      setErrorMessages(validationErrors);
      return; // Prevent saving if there are validation errors
    }

    try {
      const updatedData = {
        tenPhongBan: editedTenPB,
        maQuanLy: editedMaTP,
      };

      await editPhongBan(maPhongBan, updatedData); // Call editPhongBan to update data

      // Update thông tin nhân viên thành trưởng phòng
      const updateTP = { chucvuId: "TP", phongbanId: maPhongBan };
      await updateEmployee(editedMaTP, updateTP);

      // Update thông tin trưởng phòng thành nhân viên
      const updateTPCu = { chucvuId: "NV" };
      await updateEmployee(currentMaTP, updateTPCu);

      console.log("Lưu", updatedData);
      setCurrentTenPB(editedTenPB);
      setIsEditing(false);
      setErrorMessages([]); // Clear error messages on successful save
      await fetchPhongBan(); // Refresh data after editing
    } catch (error) {
      console.error("Lỗi khi lưu thông tin phòng ban:", error);
    }
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = async () => {
    try {
      await removePhongBan(maPhongBan); // Gọi hàm xóa phòng ban
      setConfirmDelete(false);

      const updateTP = { chucvuId: "NV" };
      await updateEmployee(editedMaTP, updateTP);

      navigation.goBack(); // Quay lại màn hình trước đó sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa phòng ban:", error);
      setConfirmDelete(false); // Đảm bảo modal được đóng lại ngay cả khi có lỗi
    }
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false); // Đóng modal nếu người dùng không muốn xóa
  };

  return (
    <>
      <View style={styles.header}>
        <BackNav navigation={navigation} name={"Chi tiết phòng ban"} />
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <View style={{ height: 50 }}>
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.editBtn}
            >
              <Feather
                name="edit-2"
                size={20}
                color="#FFFFFF"
                style={styles.fea}
              />
            </TouchableOpacity>
          </View> */}

          {errorMessages.length > 0 && (
            <View style={styles.errorContainer}>
              {errorMessages.map((error, index) => (
                <Text key={index} style={styles.errorText}>
                  {error}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Mã phòng ban</Text>
            <Text style={styles.sectionTitle1}>{maPhongBan}</Text>
          </View>

          <View style={styles.infoSection}>
  <Text style={styles.sectionTitle}>Tên phòng ban</Text>
  <View style={styles.inlineEditContainer}>
    {isEditing ? (
      <TextInput
        style={styles.TextInput}
        placeholder="Tên phòng ban"
        value={editedTenPB}
        onChangeText={(text) => setEditedTenPB(text)}
      />
    ) : (
      <Text style={styles.sectionTitle22}>{currentTenPB}</Text>
    )}
    <TouchableOpacity
      onPress={() => setIsEditing(true)}
      style={styles.editBtn}
    >
      <Feather
        name="edit-2"
        size={20}
        color="#FFFFFF"
        style={styles.fea}
      />
    </TouchableOpacity>
  </View>
</View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Trưởng phòng</Text>
            {isEditing ? (
              <SelectList
                placeholder={truongPhong.name}
                setSelected={(val) => {
                  setEditedMaTP(val);
                  console.log(val, "dachon");
                }}
                data={dataSelect}
                save="key"
              />
            ) : (
              <Text style={styles.sectionTitle1}>{truongPhong.name}</Text>
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

        <Modal visible={confirmDelete} transparent={true} animationType="slide">
          <View style={styles.modalCtn}>
            <View style={styles.bodyModal}>
              <Text style={styles.confirmText}>
                Bạn có chắc chắn muốn xóa phòng ban này không?
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
    right: 30,
    position: "absolute",
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
  errorContainer: {
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
});
