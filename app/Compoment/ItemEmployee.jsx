import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function ItemListEmployee({ manv, name, imageUrl }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.employeeCode}>{manv}</Text>
        <Text style={styles.employeeName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
      </View>
      <Image source={{ uri: imageUrl }} style={styles.employeeImage} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    height: 80,
  },
  employeeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 20,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 20,
  },
  employeeCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  employeeName: {
    fontSize: 16,
    color: '#555',
    maxWidth: '80%',
  },
});
