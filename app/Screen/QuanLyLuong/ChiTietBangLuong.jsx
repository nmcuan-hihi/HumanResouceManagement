import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import dayjs from 'dayjs';
import { getEmployeeSalaryAndAttendance, getCongThucLuong } from '../../services/quanLyMucLuongFirebase';
import { getEmployeeById } from '../../services/EmployeeFireBase';
import { getChamCongDetailsByMonth } from '../../services/quanLyMucLuongFirebase';

const SalaryDetailScreen = ({ navigation, route }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);
  const [salaryData, setSalaryData] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const employeeId = route.params?.employeeId || 'NV001';

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
      const employee = await getEmployeeById(employeeId);
      setEmployeeData(employee);
  
      const { salary } = await getEmployeeSalaryAndAttendance(
        employeeId,
        dayjs(currentDate).format("M-YYYY")
      );
  
      const salaryFormula = await getCongThucLuong();
      if (salaryFormula) {
        console.log("Fetched Salary Formula:", salaryFormula);
      }
  
      const attendanceDetails = await getChamCongDetailsByMonth(
        employeeId,
        dayjs(currentDate).format("M-YYYY")
      );
      setAttendanceData(attendanceDetails);
      setSalaryData(salary);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('vi-VN') + ' đ' || '0 đ';
  };

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <Text style={styles.attendanceDate}>{`${item.date}-${item.month}-${item.year}`}</Text>
      <Text style={styles.attendanceTime}>{item.timeIn}</Text>
      <Text style={styles.attendanceTime}>{item.timeOut}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0073B1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết lương & chấm công</Text>
        </View>

        {/* Month Picker */}
        <MonthYearPicker currentDate={currentDate} onChangeMonth={setCurrentDate} />

        {/* Employee Info */}
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

        {/* Salary Info */}
        <View style={styles.salaryCard}>
          <Text style={styles.cardTitle}>Thông tin lương</Text>
          <View style={styles.salaryInfo}>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>Lương:</Text>
              <Text style={styles.salaryValue}>{formatCurrency(salaryData?.luong)}</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>Phụ cấp:</Text>
              <Text style={styles.salaryValue}>{formatCurrency(salaryData?.phucap)}</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>Ngày công:</Text>
              <Text style={styles.salaryValue}>{salaryData?.ngaycong}</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>Chuyên cần:</Text>
              <Text style={styles.salaryValue}>{salaryData?.chuyencan}</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>Tăng ca:</Text>
              <Text style={styles.salaryValue}>{formatCurrency(salaryData?.tangca)}</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>Thực nhận:</Text>
              <Text style={[styles.salaryValue, styles.netValue]}>{formatCurrency(salaryData?.thucnhan)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Attendance Section */}
      <View style={styles.attendanceContainer}>
        <View style={styles.attendanceCard}>
          <Text style={styles.cardTitle}>Chi tiết chấm công</Text>
          <View style={styles.attendanceHeader}>
            <Text style={styles.headerCell}>Ngày công</Text>
            <Text style={styles.headerCell}>Giờ Vào</Text>
            <Text style={styles.headerCell}>Giờ Ra</Text>
          </View>
          <FlatList
            data={attendanceData}
            renderItem={renderAttendanceItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.attendanceList}
            showsVerticalScrollIndicator={true}
            style={styles.attendanceListContainer}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  fixedContent: {
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
  attendanceContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  attendanceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flex: 1,
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
  attendanceListContainer: {
    flex: 1,
  },
  attendanceList: {
    paddingBottom: 16,
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