import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import BackNav from '../../Compoment/BackNav';
import HeaderNav from '../../Compoment/HeaderNav';
import { readEmployees, readPhongBan, writePhongBan } from '../../services/database';
import ItemDepartment from '../../Compoment/ItemDepartment';

export default function PhongBanScreen({ navigation }) {
  const [phongBanData, setPhongBanData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedManager, setSelectedManager] = useState({ name: '', employeeID: '' });
  const [maPhongBan, setMaPhongBan] = useState('');
  const [tenPhongBan, setTenPhongBan] = useState('');

  // Fetch dữ liệu từ Firebase
  const fetchData = async () => {
    try {
      const data = await readPhongBan();
      const phongBanArray = Object.keys(data).map((key) => ({
        ...data[key],
        maPhongBan: key,
      }));
      setPhongBanData(phongBanArray);

      const dataEmp = await readEmployees();
      const dataEmpArray = Object.keys(dataEmp).map((key) => ({
        ...dataEmp[key],
        employeeID: key,
      }));
      setEmployeeData(dataEmpArray);
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hienThiModal = () => setVisibleModal(true);

  const handleSelectEmployee = (employee) => {
    setSelectedManager({ name: employee.name, employeeID: employee.employeeID });
  };

  const handlePress = (item) => {
    navigation.navigate('DetailPB', { maPhongBan: item.maPhongBan });
  };

  const handleAddPhongBan = async () => {
    try {
      const phongban = {
        maPhongBan,
        tenPhongBan,
        maQuanLy: selectedManager.employeeID,
      };

      await writePhongBan(phongban); // Ghi dữ liệu vào Firebase
      await fetchData(); // Làm mới dữ liệu sau khi thêm mới

      // Reset các trường sau khi thêm
      setMaPhongBan('');
      setTenPhongBan('');
      setSelectedManager({ name: '', employeeID: '' });
      setSearchText('');
      setVisibleModal(false); // Đóng modal
    } catch (error) {
      console.error('Lỗi khi thêm phòng ban:', error);
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
          data={phongBanData.filter((item) =>
            item.tenPhongBan.toLowerCase().includes(searchText.toLowerCase())
          )}
          renderItem={({ item }) => (
            <ItemDepartment item={item} onPress={() => handlePress(item)} />
          )}
          keyExtractor={(item) => item.maPhongBan}
        />


        <Modal visible={visibleModal} transparent={true} animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                  data={employeeData.filter((item) =>
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
    backgroundColor: '#f8f8f8',
  },
  list: {
    paddingHorizontal: 10,
  },
  modalCtn: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyModal: {
    width: '85%',
    height: 600,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  TextInput: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    marginBottom: 10,
    fontSize: 18,
  },
  searchInput: {
    width: '100%',
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
    borderColor: '#ddd',
  },
  btnThem: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  nameBtn: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});
