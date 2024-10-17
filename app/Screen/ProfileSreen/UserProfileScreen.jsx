import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function UserProfileScreen() {
  return (
    
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi Shallender! 👋</Text>
      
      <View style={styles.profileContainer}>
        <Image 
          source={require('../../../assets/image/images.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Amit Kumar</Text>
        <Text style={styles.position}>Trưởng phòng IT</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Thông Tin Cá Nhân</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <Text style={styles.buttonText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    padding: 20,
    backgroundColor: '#fff', // Màu nền
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#00BFF5',
    borderRadius: 5,
    elevation: 5,
    padding: 20,
    width: '100%',
    maxWidth: 400, // Độ rộng tối đa cho màn hình
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  position: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E3E3E3', // Màu nền nút
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '100%',
    maxWidth: 350, // Độ rộng tối đa cho nút
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#00BFFF', // Màu nền cho nút Đăng Xuất
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
