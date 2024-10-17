import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const notifications = [
  { id: '1', title: 'Thông báo', date: 'Ngày 16/10/2022 họp về Push notification React Native', time: '1m ago' },
  { id: '2', title: 'Thông báo', date: 'Ngày 16/10/2022 họp về Push notification React Native', time: '1m ago' },
  { id: '3', title: 'Thông báo', date: 'Ngày 16/10/2022 họp về Push notification React Native', time: '1m ago' },
  { id: '4', title: 'Thông báo', date: 'Ngày 16/10/2022 họp về Push notification React Native', time: '10hrs ago' },
];

export default function NotificeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Thông báo</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationDate}>{item.date}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#F5F5F5', // Màu xanh
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    elevation: 3, // Để tạo hiệu ứng đổ bóng
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationDate: {
    fontSize: 14,
    color: '#666',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
});
