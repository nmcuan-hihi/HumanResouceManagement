import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';

export default function EditCertificateScreen({ route, navigation }) {
  const { certificateId } = route.params; // Nhận certificateId từ trang chi tiết

  // Các state để lưu dữ liệu bằng cấp
  const [certificate, setCertificate] = useState({
    Loai_bang_cap: '',
    ngay_cap: '',
    mo_ta: '',
    xac_thuc: 0, // 0: Chưa xác thực, 1: Đã xác thực
  });

  // Giả lập việc lấy dữ liệu từ API hoặc cơ sở dữ liệu
  useEffect(() => {
    // Thay thế đoạn này bằng code gọi API lấy thông tin từ backend
    // Giả sử dữ liệu được trả về từ server cho certificateId tương ứng
    const fetchedCertificate = {
      Loai_bang_cap: 'Bằng Đại học',
      ngay_cap: '2022-10-10',
      mo_ta: 'Bằng đại học chuyên ngành Kỹ thuật phần mềm',
      xac_thuc: 1,
    };
    setCertificate(fetchedCertificate);
  }, [certificateId]);

  // Xử lý khi người dùng nhấn nút Lưu
  const handleSavePress = () => {
    // Thêm logic gọi API để lưu dữ liệu vào cơ sở dữ liệu
    // Bạn có thể dùng fetch hoặc axios để gửi request lên server

    Alert.alert('Thông báo', 'Thông tin bằng cấp đã được lưu thành công!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chỉnh sửa bằng cấp</Text>

      <Text style={styles.label}>Loại bằng cấp:</Text>
      <TextInput
        style={styles.input}
        value={certificate.Loai_bang_cap}
        onChangeText={(text) => setCertificate({ ...certificate, Loai_bang_cap: text })}
        placeholder="Nhập loại bằng cấp"
      />

      <Text style={styles.label}>Ngày cấp:</Text>
      <TextInput
        style={styles.input}
        value={certificate.ngay_cap}
        onChangeText={(text) => setCertificate({ ...certificate, ngay_cap: text })}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Mô tả:</Text>
      <TextInput
        style={styles.input}
        value={certificate.mo_ta}
        onChangeText={(text) => setCertificate({ ...certificate, mo_ta: text })}
        placeholder="Nhập mô tả"
      />

      <Text style={styles.label}>Trạng thái xác thực:</Text>
      <TextInput
        style={styles.input}
        value={certificate.xac_thuc.toString()}
        onChangeText={(text) => setCertificate({ ...certificate, xac_thuc: parseInt(text) })}
        placeholder="Nhập 1 (Đã xác thực) hoặc 0 (Chưa xác thực)"
        keyboardType="numeric"
      />

      {/* Nút Lưu */}
      <Button title="Lưu" onPress={handleSavePress} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
});
