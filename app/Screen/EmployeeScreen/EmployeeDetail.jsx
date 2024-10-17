import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import BackNav from '../../Compoment/BackNav';

export default function EmployeeDetailScreen({ navigation }) {
  // Hàm xử lý khi nhấn vào nút chỉnh sửa
  const handlePress = () => {
    navigation.navigate('EditEmployee');
  };

  return (
    <>
      <View style={styles.header}>
        {/* Sử dụng BackNav với onEditPress */}
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
            <Text style={styles.sectionTitle}>Account Information</Text>
            <InfoItem label="Owner Name" value="Value" />
            <InfoItem label="Phone Number" value="Value" />
            <InfoItem label="Email Address" value="Value" />
            <InfoItem label="Reg Time" value="Value" />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Membership</Text>
            <InfoItem label="Status" value="Value" />
            <InfoItem label="Expiry Date" value="Value" />
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
