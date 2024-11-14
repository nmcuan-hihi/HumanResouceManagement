import React, { useState, useEffect } from 'react';
import { Platform, View, Text, Image, TouchableOpacity, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import MonthSelector from '../../Compoment/SelectMonth_DSLuong';
import { getBangLuong } from '../../services/quanLyMucLuongFirebase'; // Import the function
import { getEmployeeById } from '../../services/EmployeeFireBase';
import { getChamCongDetailsByEmployeeId } from '../../services/quanLyMucLuongFirebase'; // Import the timekeeping function

export default function SalaryDetailScreen({ navigation }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [salaryData, setSalaryData] = useState(null); // Store salary data here
  const [employeeName, setEmployeeName] = useState('');
  const [employeeImage, setEmployeeImage] = useState('');
  const [timekeepingData, setTimekeepingData] = useState([]); // Store timekeeping data here

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const data = await getBangLuong("NV001"); // Fetch data for employee 'NV001'
        setSalaryData(data[1]); // Assuming you get one result, set it
      } catch (error) {
        console.error("Error fetching salary details:", error);
      }
    };

    const fetchEmployeeName = async () => {
      try {
        if (salaryData && salaryData.employeeId) {
          const employeeData = await getEmployeeById(salaryData.employeeId); // Fetch employee data
          setEmployeeName(employeeData.name); // Set employee name
          setEmployeeImage(employeeData.imageUrl); 
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    const fetchTimekeepingData = async () => {
      try {
        const data = await getChamCongDetailsByEmployeeId("NV001"); // Fetch timekeeping data for employee 'NV001'
        setTimekeepingData(data); // Set timekeeping data
      } catch (error) {
        console.error("Error fetching timekeeping data:", error);
      }
    };

    fetchSalaryData();
    fetchEmployeeName();
    fetchTimekeepingData(); // Fetch timekeeping data for NV001
  }, [salaryData]);

  if (!salaryData) {
    return <Text>Loading...</Text>; // Show loading until data is fetched
  }

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  const renderTimekeepingItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.date}</Text>
      <Text style={styles.tableCell}>{item.timeIn}</Text>
      <Text style={styles.tableCell}>{item.checkOut}</Text>
      <Text style={styles.tableCell}>{item.hoursWorked} hours</Text>
    </View>
  );

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
      </View>

      {/* Month Selector */}
      <MonthSelector currentDate={currentMonth} onChangeMonth={setCurrentMonth} />

      {/* Employee Info */}
      <View style={styles.employeeCard}>
        <View style={styles.employeeInfo}>
          <View style={styles.avatarContainer}>
            <Image source={employeeImage} style={styles.avatar} />
          </View>
          <View>
            <Text style={styles.employeeId}>{salaryData.employeeId}</Text>
            <Text style={styles.employeeName}>{employeeName}</Text>
          </View>
        </View>
      </View>

      {/* Main Salary Info */}
      <View style={styles.salaryCard}>
        <View style={styles.salarySection}>
          <View style={styles.salaryRow}>
            <Text style={styles.labelText}>Tổng thu nhập</Text>
            <Text style={styles.valueText}>{formatCurrency(salaryData.luong)}</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.labelText}>Khấu trừ</Text>
            <Text style={styles.deductionText}>-{formatCurrency(salaryData.chuyencan)}</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.labelText}>Thực nhận</Text>
            <Text style={styles.netIncomeText}>{formatCurrency(salaryData.thucnhan)}</Text>
          </View>
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
        <FlatList
          data={timekeepingData}
          renderItem={renderTimekeepingItem}
          keyExtractor={(item) => item.id}
        />
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
    color: '#4B5563',
    flex: 1,
    textAlign: 'center',
  },
});
