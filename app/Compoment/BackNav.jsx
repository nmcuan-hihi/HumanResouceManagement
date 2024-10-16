import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the icon

export default function BackNav({ navigation, name }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8', // Add background color if needed
  },
  backButton: {
    padding: 10,
    backgroundColor: '#D3D3D3', // Background color for back button
    borderRadius: 20, // Rounded corners for the button
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, // Shadow for Android
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  headerTitle: {
    flex: 1, // Allow title to take remaining space
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center', // Center the title
  },
});
