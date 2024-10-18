import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';

export default function BangCapDetailScreen({ route, navigation }) {
  const { certificate } = route.params; // Nhận dữ liệu bằng cấp từ EmployeeDetailScreen

  const handleEditPress = () => {
    navigation.navigate('EditBangCap', { certificateId: certificate.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết bằng cấp</Text>

      {/* Hình ảnh của bằng cấp */}
      <View style={styles.imageContainer}>
        <Image
          source={certificate.hinh_anh 
                  ? { uri: `data:image/png;base64,${certificate.hinh_anh}` } 
                  : require('../../../assets/image/images.png')} // Hiển thị hình ảnh từ cơ sở dữ liệu hoặc hình ảnh mặc định
          style={styles.certificateImage}
          resizeMode="contain"
        />
      </View>

      {/* Thông tin chi tiết của bằng cấp */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Tên nhân viên:</Text>
        <Text style={styles.value}>{certificate.employeeName || 'Nguyễn Văn A'}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Loại bằng:</Text>
        <Text style={styles.value}>{certificate.Loai_bang_cap}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Ngày cấp:</Text>
        <Text style={styles.value}>{certificate.ngay_cap}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Mô tả:</Text>
        <Text style={styles.value}>{certificate.mo_ta}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Trạng thái xác thực:</Text>
        <Text style={styles.value}>{certificate.xac_thuc === 1 ? 'Đã xác thực' : 'Chưa xác thực'}</Text>
      </View>

      {/* Nút Chỉnh Sửa */}
      <Button title="Chỉnh sửa" onPress={handleEditPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  certificateImage: {
    width: '100%',
    height: 200,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
});
