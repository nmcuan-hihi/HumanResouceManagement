import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function BackNav({ name, soLuong, btn, onEditPress }) {  
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Nút quay lại */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Tiêu đề màn hình */}
        <Text style={styles.headerTitle}>{name}</Text>

        {/* Nút số lượng và chỉnh sửa */}
        <View style={styles.buttonContainer}>
          {/* Hiển thị số lượng */}
          <Text style={[styles.saveButton, { marginEnd: 20 }]}>{soLuong}</Text>


          {/* Nút chỉnh sửa */}
          <TouchableOpacity onPress={onEditPress}>
            <Text style={styles.saveButton}>{btn}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
   
    flex: 1,
    backgroundColor: '#ffff',
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginRight: 8,
    fontSize: 16,
    color: 'black',
  },
  saveButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
});
