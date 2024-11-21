import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, 
  TouchableOpacity, ActivityIndicator, 
  Platform, Image, ScrollView
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';  // Import the UTC plugin

dayjs.extend(utc);  // Apply the UTC plugin to dayjs

import { getEmployeeById } from '../../services/EmployeeFireBase';
import { layDanhSachBangLuongTheoThang, getChamCongByMonth1 } from '../../services/quanLyMucLuongFirebase';

const SalaryDetailScreen = ({ navigation, route }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [noSalaryData, setNoSalaryData] = useState(false); // State to track if there's no salary data
  const [noAttendanceData, setNoAttendanceData] = useState(false); // State to track if there's no attendance data
  const employeeId = route.params?.employeeId;

  // Month Year Picker Component
  const MonthYearPicker = ({ currentDate, onChangeMonth }) => {
    const handlePrevMonth = () => {
      const newDate = dayjs(currentDate).subtract(1, 'month');
      onChangeMonth(newDate.toDate());
    };

    const handleNextMonth = () => {
      const newDate = dayjs(currentDate).add(1, 'month');
      onChangeMonth(newDate.toDate());
    };

    return (
      <View style={styles.monthPicker}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.monthArrow}>
          <Text style={styles.monthArrowText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {`Tháng ${dayjs(currentDate).format('M/YYYY')}`}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.monthArrow}>
          <Text style={styles.monthArrowText}>{">"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    fetchData();
  }, [currentDate, employeeId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setNoSalaryData(false);
      setNoAttendanceData(false);

      // Fetch employee details
      const employee = await getEmployeeById(employeeId);
      setEmployeeData(employee);

      // Get salary data for the selected month and year
      
      const month = dayjs(currentDate).format("M");
      const year = dayjs(currentDate).format("YYYY");

      // Fetch salary data (assuming function already exists)
      const salaryList = await layDanhSachBangLuongTheoThang(year, month);

      // Find salary data for the specific employee
      const employeeSalary = salaryList.find(salary => salary.employeeId === employeeId);
      if (employeeSalary) {
        setSalaryData(employeeSalary);
      } else {
setNoSalaryData(true); // No salary data found
      }

      // Fetch attendance details using the new function
      getChamCongByMonth1(year, month, employeeId, (attendanceDetails) => {
        if (attendanceDetails && attendanceDetails.length > 0) {
          setAttendanceData(attendanceDetails);
        } else {
          setNoAttendanceData(true); // No attendance data found
        }
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('vi-VN') + ' đ' || '0 đ';
  };

  const renderAttendanceItem = (item) => {
    // Convert the date to DD/MM/YYYY format
    const itemDate = new Date(item.date);
    const formattedDate = `${itemDate.getDate().toString().padStart(2, '0')}/${(itemDate.getMonth() + 1).toString().padStart(2, '0')}/${itemDate.getFullYear()}`;
    
    return (
      <View style={styles.attendanceItem} key={item.id}>
        <Text style={styles.attendanceDate}>{formattedDate}</Text>
        <Text style={styles.attendanceTime}>{item.timeIn}</Text>
        <Text style={styles.attendanceTime}>{item.timeOut}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0073B1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lương & chấm công</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        <MonthYearPicker currentDate={currentDate} onChangeMonth={setCurrentDate} />

        <View style={styles.employeeCard}>
          <Image
            source={{ uri: employeeData?.imageUrl }}
            style={styles.employeeImage}
          />
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>{employeeData?.name}</Text>
            <Text style={styles.employeeId}>Mã NV: {employeeId}</Text>
          </View>
        </View>

        {noSalaryData && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Không có bảng lương cho tháng này</Text>
          </View>
        )}

        {salaryData && !noSalaryData && (
          <View style={styles.salaryCard}>
            <Text style={styles.cardTitle}>Thông tin lương</Text>
            <View style={styles.salaryInfo}>
              {[ 
                { label: 'Lương cơ bản:', value: salaryData?.luong },
                { label: 'Phụ cấp:', value: salaryData?.phucap },
{ label: 'Ngày công:', value: salaryData?.ngaycong || 0 },
                { label: 'Chuyên cần:', value: salaryData?.chuyencan },
                { label: 'Tăng ca:', value: salaryData?.tangca },
                { label: 'Thực nhận:', value: salaryData?.thucnhan, highlight: true }
              ].map((item, index) => (
                <View key={index} style={styles.salaryRow}>
                  <Text style={styles.salaryLabel}>{item.label}</Text>
                  <Text style={[styles.salaryValue, item.highlight && styles.netValue]}>
                    {item.label.includes('Ngày công') ? item.value : formatCurrency(item.value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {noAttendanceData && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Không có dữ liệu chấm công cho tháng này</Text>
          </View>
        )}

        {attendanceData.length > 0 && !noAttendanceData && (
          <View style={styles.attendanceCard}>
            <Text style={styles.cardTitle}>Chi tiết chấm công</Text>
            <View style={styles.attendanceHeader}>
              <Text style={styles.headerCell}>Ngày công</Text>
              <Text style={styles.headerCell}>Giờ Vào</Text>
              <Text style={styles.headerCell}>Giờ Ra</Text>
            </View>
            {attendanceData.map(renderAttendanceItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  monthPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FCD34D',
  },
  monthArrow: {
    padding: 8,
  },
  monthArrowText: {
    fontSize: 18,
    color: '#1F2937',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  employeeCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  employeeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
},
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  employeeId: {
    fontSize: 14,
    color: '#6B7280',
  },
  salaryCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  salaryInfo: {
    padding: 8,
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  salaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  salaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  netValue: {
    color: '#10B981',
  },
  attendanceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  attendanceHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#1F2937',
  },
  attendanceItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  attendanceDate: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
  },
  attendanceTime: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
  },
});

export default SalaryDetailScreen;