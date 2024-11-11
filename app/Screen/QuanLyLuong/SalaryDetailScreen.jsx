import React, { useState } from 'react';
import { Platform, View, Text, Image, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react-native';
import MonthSelector from '../../Compoment/SelectMonth_DSLuong';
export default function SalaryDetailScreen({ navigation }) {
  const [currentMonth, setCurrentMonth] = useState(new Date()); // May 2024
  const [salaryData] = useState({
    employeeId: 'E002',
    employeeName: 'Rahul Kumar',
    totalIncome: 10000000,
    deductions: 500000,
    netIncome: 9500000,
  });
  
  // Sample timekeeping data
  const [timekeepingData] = useState([
    { date: '2024-05-01', checkIn: '09:00', checkOut: '18:00', hours: 8 },
    { date: '2024-05-02', checkIn: '09:00', checkOut: '17:30', hours: 7.5 },
    { date: '2024-05-03', checkIn: '09:15', checkOut: '18:00', hours: 7.75 },
    // Additional entries as needed
  ]);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#1F2937" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết BL</Text>
        </View>
        <View  style={styles.headerLogo} />
      </View>

      {/* Month Selector */}
      <MonthSelector currentDate={currentMonth} onChangeMonth={setCurrentMonth} />
      {/* Employee Info */}
      <View style={styles.employeeCard}>
        <View style={styles.employeeInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
          </View>
          <View>
            <Text style={styles.employeeId}>{salaryData.employeeId}</Text>
            <Text style={styles.employeeName}>{salaryData.employeeName}</Text>
          </View>
        </View>
      </View>

      {/* Main Salary Info */}
      <View style={styles.salaryCard}>
        <View style={styles.salarySection}>
          <View style={styles.salaryRow}>
            <Text style={styles.labelText}>Tổng thu nhập</Text>
            <Text style={styles.valueText}>{formatCurrency(salaryData.totalIncome)}</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.labelText}>Khấu trừ</Text>
            <Text style={styles.deductionText}>-{formatCurrency(salaryData.deductions)}</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.labelText}>Thực nhận</Text>
            <Text style={styles.netIncomeText}>{formatCurrency(salaryData.netIncome)}</Text>
          </View>
        </View>

        {/* Timekeeping Table */}
        <View style={styles.timekeepingSection}>
          <Text style={styles.sectionTitle}>Giờ chấm công</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Ngày</Text>
            <Text style={styles.tableHeaderText}>Giờ vào</Text>
            <Text style={styles.tableHeaderText}>Giờ ra</Text>
            <Text style={styles.tableHeaderText}>Số giờ</Text>
          </View>
          {timekeepingData.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{entry.date}</Text>
              <Text style={styles.tableCell}>{entry.checkIn}</Text>
              <Text style={styles.tableCell}>{entry.checkOut}</Text>
              <Text style={styles.tableCell}>{entry.hours}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  headerLogo: {
    width: 24,
    height: 24,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  monthSelectorContainer: {
    margin: 16,
  },
  monthSelector: {
    backgroundColor: '#FCD34D',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
  },
  employeeCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  employeeId: {
    fontWeight: '500',
    color: '#111827',
  },
  employeeName: {
    color: '#4B5563',
  },
  salaryCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  salarySection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  labelText: {
    color: '#4B5563',
  },
  valueText: {
    fontWeight: '500',
    color: '#111827',
  },
  deductionText: {
    fontWeight: '500',
    color: '#EF4444',
  },
  netIncomeText: {
    fontWeight: '500',
    color: '#059669',
  },
  deductionSection: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  deductionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  deductionLabel: {
    color: '#4B5563',
  },
  deductionAmount: {
    color: '#111827',
  },
  timekeepingSection: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderText: {
    fontWeight: '500',
    color: '#4B5563',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#4B5563',
  },
});

