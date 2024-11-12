import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MonthSelector = ({ currentDate, onChangeMonth }) => {
  // Ensure currentDate is a valid Date object
  const validDate = currentDate instanceof Date && !isNaN(currentDate) ? currentDate : new Date();

  const handlePreviousMonth = () => {
    const newDate = new Date(validDate);
    newDate.setMonth(validDate.getMonth() - 1);
    onChangeMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(validDate);
    if (newDate.getMonth() < new Date().getMonth() || newDate.getFullYear() < new Date().getFullYear()) {
      newDate.setMonth(validDate.getMonth() + 1);
      onChangeMonth(newDate);
    }
  };

  const getCurrentMonthYear = () => {
    const options = { month: 'long', year: 'numeric' };
    return validDate.toLocaleDateString('vi-VN', options);
  };

  return (
    <View style={styles.monthSelector}>
      <TouchableOpacity style={styles.chevronIcon} onPress={handlePreviousMonth}>
        <Ionicons name="chevron-back-circle-outline" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.monthText}>{getCurrentMonthYear()}</Text>
      <TouchableOpacity style={styles.chevronIcon} onPress={handleNextMonth}>
        <Ionicons name="chevron-forward-circle-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    backgroundColor: '#FFC727',
  },
  chevronIcon: {
    marginHorizontal: 20,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MonthSelector;
