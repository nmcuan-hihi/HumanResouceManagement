
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
import HeaderNav from "../../Compoment/HeaderNav";
import Feather from 'react-native-vector-icons/Feather';


export default function DetailSkill({ navigation, route }) {
  // const { maBC, tenBC } = route.params.item;
maSK = "SK001 ";
tenSK = "Java";
  const [isEditing, setIsEditing] = useState(false);
  const [currentTenSK, setCurrentTenBC] = useState(tenSK);
  const [editedTenSK, setEditedTenSK] = useState(tenSK);
  const [visibleModal, setVisibleModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false); // State to show confirmation modal for delete

  // Handle save
  const handleSave = () => {
    setCurrentTenBC(editedTenSK);
    setIsEditing(false);
  };

  // Handle delete confirmation
  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = () => {
    // Logic to delete the item
    setConfirmDelete(false);
    // Possibly navigate back or reset form
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

  return (
    <>
      <View style={styles.header}>
        {/* Sử dụng BackNav với onEditPress */}
        <BackNav
          navigation={navigation}
          name={"Chi tiết kỹ năng"}
          
        />
      </View>

      <SafeAreaView style={styles.container}>
      <ScrollView>
  {/* Thông tin bằng cấp */}
  <View style={styles.infoSection}>
    <Text style={styles.sectionTitle}>Mã skill</Text>
    <Text style={styles.sectionTitle1}>{maSK}</Text>
  </View>

  <View style={styles.infoSection}>
    <Text style={styles.sectionTitle}>Tên skill</Text>
    {isEditing ? (
      <TextInput
        style={styles.TextInput}
        placeholder="Tên skill"
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
          <Feather name="edit-2" size={20} color="#FFFFFF" style={styles.fea} />
        </TouchableOpacity>
      </View>
    )}
  </View>

  {/* Ensure some spacing between info section and buttons */}
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


        {/* Delete Confirmation Modal */}
        <Modal visible={confirmDelete} transparent={true} animationType="slide">
          <View style={styles.modalCtn}>
            <View style={styles.bodyModal}>
              <Text style={styles.confirmText}>
                Bạn có chắc chắn muốn xóa skill này không?
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
    marginBottom: 30,
  },
  editText: {
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 20,
  },
  // Updated the button section layout
  buttonSection: {
    marginTop: 20,  // Adds space between the info section and buttons
    alignItems: "center",  // Centers the buttons horizontally
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
    marginTop: 20,  // Added margin to separate from other content
  },
  nameBtn: {
    fontSize: 22,
    color: "#FFFFFF",
  },

  // Button styles
  bodyBtn: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
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
    marginVertical: 20,
  },
  nameBtn: {
    fontSize: 22,
    color: "#FFFFFF",
  },

  // Modal styles
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
