import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import BackNav from '../../Compoment/BackNav';
import { duyetNghiPhep } from '../../services/NghiPhepDB';

export default function ChiTietNghiPhep({ route, navigation }) {
  const { nghiPhepData } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const handleXacNhan = async (id) => {
    try {
      await duyetNghiPhep(id, "1");
      navigation.goBack(); // Quay lại màn hình trước sau khi cập nhật
    } catch (error) {
      console.error('Lỗi khi xác nhận nghỉ phép:', error);
    }
  };

  const handleHuy = async (id) => {
    try {
      await duyetNghiPhep(id, "-1");
      navigation.goBack(); // Quay lại màn hình trước sau khi cập nhật
    } catch (error) {
      console.error('Lỗi khi hủy nghỉ phép:', error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const calculateDaysOff = (startDate, endDate) => {
    const start = new Date(startDate.split('/').reverse().join('-'));
    const end = new Date(endDate.split('/').reverse().join('-'));
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const leaveDays = calculateDaysOff(nghiPhepData.ngayBatDau, nghiPhepData.ngayKetThuc);

  const getStatusText = (status) => {
    switch (status) {
      case "1":
        return "Đã xác nhận";
      case "-1":
        return "Đã hủy";
      default:
        return "Vui lòng duyệt đăng ký";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "1":
        return styles.statusApproved;
      case "-1":
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  return (
    <View style={styles.container}>
      <BackNav navigation={navigation} name="Chi Tiết Nghỉ Phép" />
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Tên nhân viên: {nghiPhepData.employeeName}</Text>
        <Text style={styles.detail}>Phòng ban: {nghiPhepData.department}</Text>
        <Text style={styles.detail}>Ngày bắt đầu: {nghiPhepData.ngayBatDau}</Text>
        <Text style={styles.detail}>Ngày kết thúc: {nghiPhepData.ngayKetThuc}</Text>
        <Text style={styles.detail}>Số ngày nghỉ: {leaveDays} ngày</Text>
        <Text style={styles.detail}>Loại nghỉ: {nghiPhepData.loaiNghi}</Text>
        <Text style={styles.detail}>Tiêu đề: <Text style={{color: "blue"}}>{nghiPhepData.tieuDe}</Text></Text>
       
        <View style={styles.reasonContainer}>
          <Text style={styles.detail}>Lý do:</Text>
          <Text style={styles.reason}>
            {nghiPhepData.lyDo.length > 100 ? (
              <>
                {nghiPhepData.lyDo.substring(0, 100)}
                <Text style={styles.seeMore} onPress={toggleModal}>... Xem thêm</Text>
              </>
            ) : (
              nghiPhepData.lyDo
            )}
          </Text>
        </View>
      </View>
      <Text style={styles.trangthai}>
        Trạng thái: <Text style={getStatusStyle(nghiPhepData.trangThai)}>{getStatusText(nghiPhepData.trangThai)}</Text>
      </Text>
      <View style={styles.buttonContainer}>
        {nghiPhepData.trangThai === "0" && (
          <>
            <View style={styles.buttonWrapper}>
              <Button title="Xác nhận" onPress={() => handleXacNhan(nghiPhepData.id)} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Hủy" onPress={() => handleHuy(nghiPhepData.id)} color="red" />
            </View>
          </>
        )}
        {nghiPhepData.trangThai === "-1" && (
          <View style={styles.buttonWrapper}>
            <Button title="Xác nhận" onPress={() => handleXacNhan(nghiPhepData.id)} />
          </View>
        )}
        {nghiPhepData.trangThai === "1" && (
          <View style={styles.buttonWrapper}>
            <Button title="Hủy" onPress={() => handleHuy(nghiPhepData.id)} color="red" />
          </View>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{ marginBottom: 10 }}>
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
  seeMore: {
    fontSize: 16,
    color: 'blue',
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
    maxHeight: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  trangthai: {
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  statusApproved: {
    color: 'green',
  },
  statusCancelled: {
    color: 'red',
  },
  statusPending: {
    color: 'blue',
  },
});
