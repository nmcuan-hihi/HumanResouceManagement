import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome



const DashboardEmployee = ({name, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.gridItem} onPress={onPress}>
    <FontAwesome name={icon} size={20} color="#2E2E2E" />
    <Text style={styles.gridLabel}>{name}</Text>
  </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // Ensure the component takes up the entire screen space
    backgroundColor: '#fff', // White background for the screen
  },
  container: {
    flex: 1, // Flex for the inner content
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'flex-start', // Align items to the start (left)
    marginTop: 150, // Space from the Dashboard
    padding: 20,
  },
  contentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20, // Space below the header text
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '18%', // Percentage width for responsive design
    backgroundColor: '#C3E3E7', // Light turquoise for grid items
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 10,
  },
  gridLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#2E2E2E',
  },
  leaveText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E2E2E',
  },
});
export default DashboardEmployee;
