import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TimeChamCong() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState({ timeIn: false, timeOut: false, month: false });

  const handleMonthChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedMonth;
    setShowTimePicker(prev => ({ ...prev, month: Platform.OS === 'ios' && false }));
    setSelectedMonth(currentDate);
  };

  const handleTimePickerVisibility = (type) => {
    setShowTimePicker({
      timeIn: type === 'timeIn',
      timeOut: type === 'timeOut',
      month: type === 'month',
    });
  };

  return (
    <SafeAreaView >
      <TouchableOpacity style={styles.monthSelector} onPress={() => handleTimePickerVisibility('month')}>
        <Text>{selectedMonth.toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
        <Icon name="arrow-drop-down" size={24} color="black" />
      </TouchableOpacity>

      {/* DateTimePicker cho tháng */}
      {showTimePicker.month && (
        <DateTimePicker
          value={selectedMonth}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleMonthChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
});
