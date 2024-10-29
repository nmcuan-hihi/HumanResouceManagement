import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import HeaderNav from "../../Compoment/HeaderNav";
import {
  getEmployeeById,
  readEmployees,
  readPhongBan,
  updateEmployee,
  writePhongBan,
} from "../../services/database";
import ItemDepartment from "../../Compoment/ItemDepartment";
import { validatePhongBanData } from "../../utils/validate"; // Import your validation function

export default function PhongBanScreen({ navigation }) {
  const [phongBanData, setPhongBanData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedManager, setSelectedManager] = useState({
    name: "",
    employeeID: "",
  });
  const [maPhongBan, setMaPhongBan] = useState("");
  const [tenPhongBan, setTenPhongBan] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  // Fetch data from Firebase
  const fetchData = async () => {
    try {
      const data = await readPhongBan();
      const phongBanArray = Object.keys(data).map((key) => ({
        ...data[key],
        maPhongBan: key,
      }));

      const dataEmp = await readEmployees();
      const dataEmpArray = Object.keys(dataEmp).map((key) => ({
        ...dataEmp[key],
        employeeID: key,
      }));

      const dataNV = dataEmpArray.filter((nv) => {
        return nv.chucvuId !== "TP" && nv.chucvuId !== "GD";
      });

      setEmployeeData(dataNV);
      const newData = phongBanArray.map((phongBan) => {
        const employee = dataEmpArray.find(
          (emp) => emp.employeeId === phongBan.maQuanLy
        );
        return {
          tenPhongBan: phongBan.tenPhongBan,
          maPhongBan: phongBan.maPhongBan,
          tenTp: employee ? employee.name : "",
        };
      });

      setPhongBanData(newData);
    } catch (error) {
      console.error("Error reading data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hienThiModal = () => setVisibleModal(true);

  const handleSelectEmployee = (employee) => {
    setSelectedManager({
      name: employee.name,
      employeeID: employee.employeeID,
    });
  };

  const handlePress = (item) => {
    navigation.navigate("DetailPB", { maPhongBan: item.maPhongBan });
  };

  const handleAddPhongBan = async () => {
    // Validate input data
    const errors = validatePhongBanData({
      maPhongBan,
      tenPhongBan,
      selectedManager,
    });

    if (errors.length > 0) {
      setValidationErrors(errors); // Set errors to state for display
      return; // Exit the function if there are validation errors
    }

    try {
      const phongban = {
        maPhongBan,
        tenPhongBan,
        maQuanLy: selectedManager.employeeID,
      };

      await writePhongBan(phongban); // Write data to Firebase

      // Update employee's role to manager
      const dataTP = await getEmployeeById(selectedManager.employeeID);
      const updateTP = { chucvuId: "TP", phongbanId: maPhongBan };
      await updateEmployee(selectedManager.employeeID, updateTP);

      await fetchData(); // Refresh data after addition

      // Reset fields after addition
      setMaPhongBan("");
      setTenPhongBan("");
      setSelectedManager({ name: "", employeeID: "" });
      setSearchText("");
      setValidationErrors([]); // Clear validation errors
      setVisibleModal(false); // Close modal
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  return (
    <>
      <BackNav
        navigation={navigation}
        name="Phòng ban"
        soLuong={phongBanData.length}
        btn="Add"
        onEditPress={hienThiModal}
      />
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={phongBanData.filter(
            (item) =>
              item.tenPhongBan &&
              item.tenPhongBan.toLowerCase().includes(searchText.toLowerCase())
          )}
          renderItem={({ item }) => (
            <ItemDepartment item={item} onPress={() => handlePress(item)} />
          )}
          keyExtractor={(item) => item.maPhongBan}
        />

        <Modal visible={visibleModal} transparent={true} animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalCtn}
          >
            <View style={styles.bodyModal}>
              <HeaderNav
                name="Thêm phòng ban"
                nameIconRight="close"
                onEditPress={() => setVisibleModal(false)}
              />

              <View style={styles.body}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Mã phòng ban"
                  value={maPhongBan}
                  onChangeText={setMaPhongBan}
                />
                <TextInput
                  style={styles.TextInput}
                  placeholder="Tên phòng ban"
                  value={tenPhongBan}
                  onChangeText={setTenPhongBan}
                />
                <TextInput
                  style={styles.TextInput}
                  placeholder="Quản lý phòng ban"
                  value={selectedManager.name}
                  editable={false}
                />

                <Text style={{ padding: 5 }}>Chỉ định trưởng phòng</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm nhân viên"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                <FlatList
                  style={styles.employeeList}
                  data={employeeData.filter(
                    (item) =>
                      item.name &&
                      item.name.toLowerCase().includes(searchText.toLowerCase())
                  )}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.employeeItem}
                      onPress={() => handleSelectEmployee(item)}
                    >
                      <Text>{`${item.employeeID} - ${item.name}`}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.employeeID}
                />
                
                {/* Display validation errors */}
                {validationErrors.length > 0 && (
                  <View style={styles.errorContainer}>
                    {validationErrors.map((error, index) => (
                      <Text key={index} style={styles.errorText}>
                        {error}
                      </Text>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.btnThem}
                  onPress={handleAddPhongBan}
                >
                  <Text style={styles.nameBtn}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 9.5,
    backgroundColor: "#f8f8f8",
  },
  list: {
    paddingHorizontal: 10,
  },
  modalCtn: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyModal: {
    width: "85%",
    height: 600,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  body: {
    flex: 1,
    padding: 20,
  },
  TextInput: {
    width: "100%",
    height: 50,
    borderBottomWidth: 1,
    marginBottom: 10,
    fontSize: 18,
  },
  searchInput: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  employeeList: {
    flex: 1,
    marginBottom: 10,
  },
  employeeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  btnThem: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  nameBtn: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  errorContainer: {
    marginVertical: 10,
  },
  errorText: {
    color: "red",
  },
});
