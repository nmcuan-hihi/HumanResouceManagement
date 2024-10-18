import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import BackNav from '../../Compoment/BackNav';

export default function EmployeeDetailScreen({ navigation }) {
  // Dữ liệu về các bằng cấp của nhân viên
  const certificates = [
    {
      id: '1',
      name: 'Bằng Đại Học',
      issueDate: '20/05/2019',
    },
    {
      id: '2',
      name: 'Thạc sĩ',
      issueDate: '15/06/2022',
    },
    // Thêm các bằng cấp khác nếu có
  ];

  const handlePress = () => {
    navigation.navigate('EditEmployee');
  };

  const BangCapDetail = (certificate) => {
    // Điều hướng đến màn hình chi tiết bằng cấp với thông tin của bằng cấp đó
    navigation.navigate('BangCapDetail', { certificate });
  };

  return (
    <>
      <View style={styles.header}>
        <BackNav navigation={navigation} name={"Chi tiết nhân viên"} btn={"Chỉnh sửa"} onEditPress={handlePress} />
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Image
            source={require("../../../assets/image/images.png")}
            style={styles.image}
          />

          {/* Thông tin nhân viên */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
            <InfoItem label="Họ tên" value="Nguyễn Văn A" />
            <InfoItem label="Số điện thoại" value="0123456789" />
            <InfoItem label="Email" value="email@example.com" />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Membership</Text>
            <InfoItem label="Status" value="Active" />
            <InfoItem label="Chức vụ" value="Nhân viên" />
            <InfoItem label="Ngày làm" value="01/01/2020" />
          </View>

          {/* Danh sách bằng cấp */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Danh sách bằng cấp</Text>
            {certificates.map((certificate) => (
              <TouchableOpacity key={certificate.id} onPress={() => BangCapDetail(certificate)}>
                <InfoItem label="Tên bằng" value={certificate.name} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '70%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    margin: 20,
    marginLeft: 60,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    fontWeight: '500',
  },
});
