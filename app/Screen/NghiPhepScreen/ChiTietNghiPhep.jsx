import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import BackNav from '../../Compoment/BackNav';

export default function ChiTietNghiPhep({ route, navigation }) {
  const { nghiPhepData } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const handleXacNhan = () => {
    // Xử lý logic xác nhận nghỉ phép
    console.log('Xác nhận nghỉ phép:', nghiPhepData.id);
  };

  const handleHuy = () => {
    // Xử lý logic hủy nghỉ phép
    console.log('Hủy nghỉ phép:', nghiPhepData.id);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <BackNav navigation={navigation} name="Chi Tiết Nghỉ Phép" />
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Tên nhân viên: {nghiPhepData.employeeName}</Text>
        <Text style={styles.detail}>Phòng ban: {nghiPhepData.department}</Text>
        <Text style={styles.detail}>Ngày bắt đầu: {nghiPhepData.ngayBatDau}</Text>
        <Text style={styles.detail}>Ngày kết thúc: {nghiPhepData.ngayKetThuc}</Text>
        <Text style={styles.detail}>Loại nghỉ: {nghiPhepData.loaiNghi}</Text>
        <Text style={styles.detail}>Tiêu đề: <Text style={{color: "blue"}}>{nghiPhepData.tieuDe}</Text></Text>
        <View style={styles.reasonContainer}>
        <Text style={styles.detail}>Lý do:</Text>
        
          <Text style={styles.reason}>
            {nghiPhepData.lyDo.length > 100 ? `${nghiPhepData.lyDo.substring(0, 100)}` : nghiPhepData.lyDo}
            <TouchableOpacity onPress={toggleModal}><Text>... Xem thêm</Text>
            </TouchableOpacity>
          </Text>
          
        
      </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Xác nhận" onPress={handleXacNhan} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Hủy" onPress={handleHuy} color="red" />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{marginBottom: 10,}}>
              <Text style={styles.modalText}>{nghiPhepData.lyDo}</Text>
            </ScrollView>
            <Button title="Đóng" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailsContainer: {
    flex: 10,
    paddingHorizontal: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  reasonContainer: {
  
    backgroundColor: '#fff',
  },
  reason: {
    fontSize: 16,
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: "80%",
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
});
