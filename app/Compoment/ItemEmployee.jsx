
import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
export default function ItemListEmployee({manv, name}) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.employeeCode}>{manv}</Text>
          <Text style={styles.employeeName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
        </View>
        <Image source={require("../../assets/image/images.png")} style={styles.employeeImage} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0F8FF', // Light background color
      padding: 15,
      borderRadius: 10, // Rounded corners
      marginBottom: 20,
      marginLeft: 20,
      marginRight: 20,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3, // For Android shadow
      height: 80,
    },
    employeeImage: {
      width: 60, // Image width
      height: 60, // Image height
      borderRadius: 30, // Circular image
      marginLeft: 20, // Space between image and text
    },
    infoContainer: {
      flex: 1, // Allow info to take available space, and keep the image fixed
      justifyContent: 'center',
      marginRight: 20, // Add space between info and image
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
      maxWidth: '80%', // Set max width to prevent text from pushing the image
    },
  });
  