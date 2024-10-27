
import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

let modalRef = null; // Biến để giữ tham chiếu đến modal

const ViewLoading = () => {
  const [visible, setVisible] = React.useState(false); // Local state để quản lý hiển thị

  modalRef = {
    open: () => setVisible(true), // Hàm mở modal
    close: () => setVisible(false), // Hàm đóng modal
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Đang xử lý...</Text>
      </View>
    </Modal>
  );
};

export const openModal = () => modalRef?.open(); // Xuất hàm mở modal
export const closeModal = () => modalRef?.close(); // Xuất hàm đóng modal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    marginTop: 10,
    color: '#fff',
  },
});

export default ViewLoading;
