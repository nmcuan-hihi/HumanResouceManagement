import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import BackNav from '../../Compoment/BackNav';
import { duyetNghiPhep } from '../../services/NghiPhepDB';
import { TextInput } from 'react-native-paper';
import { taoThongBaoDataBase, themThongBaoNhanVien } from '../../services/thongBaoFirebase';

export default function ChiTietNghiPhep({ route, navigation }) {
  const { nghiPhepData } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalReasonVisible, setModalReasonVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleXacNhan = async (id) => {
    try {
      await duyetNghiPhep(id, "1");


      
      const tieuDe = "Xác nhận Nghỉ";
      const noiDung = "đơn nghỉ phép vào ngày "+nghiPhepData.ngayBatDau + " đã được duyệt"

        try {
          const dataTB = await taoThongBaoDataBase({
            tieuDe,
            noiDung,
          });         
            await themThongBaoNhanVien(nghiPhepData.employeeId, dataTB.maThongBao);

        } catch (error) {
         
        }



      navigation.goBack(); // Quay lại màn hình trước sau khi cập nhật
    } catch (error) {
      console.error('Lỗi khi xác nhận nghỉ phép:', error);
    }
  };

  const handleHuy = async (id) => {
    setModalReasonVisible(true);
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

  const submitReject = async (id) => {
    try {
      await duyetNghiPhep(id, "-1", rejectReason);



        
      const tieuDe = "Tù chối nghỉ";
      const noiDung = "đơn nghỉ phép vào ngày "+nghiPhepData.ngayBatDau + " đã bị từ chối\n lý do: " +rejectReason

        try {
          const dataTB = await taoThongBaoDataBase({
            tieuDe,
            noiDung,
          });         
            await themThongBaoNhanVien(nghiPhepData.employeeId, dataTB.maThongBao);

        } catch (error) {
         
        }
      navigation.goBack(); // Quay lại màn hình trước sau khi cập nhật
    } catch (error) {
      console.error('Lỗi khi từ chối nghỉ phép:', error);
    }
  };

  return (
    <>
      <BackNav navigation={navigation} name="Chi Tiết Nghỉ Phép" />
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>Tên nhân viên: {nghiPhepData.employeeName}</Text>
          <Text style={styles.detail}>Phòng ban: {nghiPhepData.department}</Text>
          <Text style={styles.detail}>Ngày bắt đầu: {nghiPhepData.ngayBatDau}</Text>
          <Text style={styles.detail}>Ngày kết thúc: {nghiPhepData.ngayKetThuc}</Text>
          <Text style={styles.detail}>Số ngày nghỉ: {leaveDays} ngày</Text>
          <Text style={styles.detail}>Loại nghỉ: {nghiPhepData.loaiNghi}</Text>
          <Text style={styles.detail}>Tiêu đề: <Text style={{ color: "blue" }}>{nghiPhepData.tieuDe}</Text></Text>

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
          {nghiPhepData.lyDoTuChoi == null ? (null):(<View style={styles.reasonContainer}>
            <Text style={styles.detail}>Lý do không được duyệt:</Text>
            <Text style={styles.reason}>             
             <Text style={styles.seeMore1}>{nghiPhepData.lyDoTuChoi}</Text>         
            </Text>
          </View>)}
        </View>

        <View style={styles.bottomSection}>
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
        </View>

        {/* Modal hiển thị lý do */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{nghiPhepData.lyDo}</Text>
              <Button title="Đóng" onPress={toggleModal} />
            </View>
          </View>
        </Modal>

        {/* Modal nhập lý do từ chối */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalReasonVisible}
        >
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nhập lý do từ chối</Text>
              <TextInput
                style={styles.reason}
                placeholder="Nhập lý do..."
                value={rejectReason}
                onChangeText={setRejectReason}
                multiline
                numberOfLines={4} />
              <View style={styles.modalButtonContainer}>
                <Button title="Hủy bỏ" onPress={() => setModalReasonVisible(false)} />
                <Button title="Xác nhận" onPress={() => submitReject(nghiPhepData.id)} color="red" />
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
    flex: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    padding: 20,
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
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  seeMore: {
    fontSize: 16,
    color: 'blue',
  },
  seeMore1: {
    fontSize: 16,
    color: 'red',
  },
  bottomSection: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  trangthai: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusApproved: {
    color: 'green',
  },
  statusCancelled: {
    color: 'red',
  },
  statusPending: {
    color: 'orange',
  },
});
