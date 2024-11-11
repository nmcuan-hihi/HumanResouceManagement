import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

import MonthSelector from "../../Compoment/SelectMonth_DSLuong";
import { readPhongBan } from "../../services/database";
import { readEmployeesFireStore } from "../../services/EmployeeFireBase";

const DanhSachLuong = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [phongBans, setPhongBans] = useState([]);
  const [listNV, setListNV] = useState([]);
  const [listLuong, setListLuong] = useState([]);


  const duLieuChamCong = [
    {
      ma_cham_cong: "NV001-2024-11-01",
      employeeId: "NV001",
      ngay_lam_viec: "2024-11-01",
      gio_vao: "08:00",
      gio_ra: "19:00",
      gio_tang_ca: 2,
      di_muon: 0,
      vang_mat: 0,
    },
    {
      ma_cham_cong: "NV002-2024-11-01",
      employeeId: "NV002",
      ngay_lam_viec: "2024-11-01",
      gio_vao: "08:00",
      gio_ra: "17:00",
      gio_tang_ca: 0,
      di_muon: 1,
      vang_mat: 0,
    },
    {
      ma_cham_cong: "NV001-2024-11-02",
      employeeId: "NV001",
      ngay_lam_viec: "2024-11-02",
      gio_vao: "08:00",
      gio_ra: "17:00",
      gio_tang_ca: 0,
      di_muon: 0,
      vang_mat: 1,
    },
    {
      ma_cham_cong: "NV002-2024-11-02",
      employeeId: "NV002",
      ngay_lam_viec: "2024-11-02",
      gio_vao: "08:00",
      gio_ra: "18:00",
      gio_tang_ca: 1,
      di_muon: 0,
      vang_mat: 0,
    },
    {
      ma_cham_cong: "NV002-2024-11-03",
      employeeId: "NV002",
      ngay_lam_viec: "2024-11-03",
      gio_vao: "08:00",
      gio_ra: "17:00",
      gio_tang_ca: 0,
      di_muon: 0,
      vang_mat: 1,
    },
  ];

  const luongTamTinh = () => {
    const temporarySalaryData = [];
  
    const groupedData = duLieuChamCong.reduce((acc, chamcong) => {
      const employeeId = chamcong.employeeId;
      const month = chamcong.ngay_lam_viec.slice(0, 7); 
  
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          month,
          workDays: 0,
          totalOvertime: 0,
        };
      }
      acc[employeeId].workDays += 1; 
      acc[employeeId].totalOvertime += chamcong.gio_tang_ca;
  
      return acc;
    }, {});
  
    for (const employeeId in groupedData) {
      const { month, workDays, totalOvertime } = groupedData[employeeId];
      
      const salaryEntry = {
        employeeId,
        thang: month,
        thucnhan: (workDays * 1000000 + totalOvertime * 500000).toString(), 
        coban: "4500000", 
        tangca: (totalOvertime * 500000).toString(),
        phucap: "300000",
        chuyencan: "500000", 
        thamnien: "0", 
      };
  
      temporarySalaryData.push(salaryEntry);
    }
    return temporarySalaryData;
  };




  const salaryData = [
    {
      employeeId: "NV001",
      thang: "2024-10",
      thucnhan: "5800000",
      coban: "4500000",
      tangca: "500000",
      phucap: "300000",
      chuyencan: "500000",
      thamnien: "0",
    },
    {
      employeeId: "NV002",
      thang: "2024-10",
      thucnhan: "6300000",
      coban: "4500000",
      tangca: "500000",
      phucap: "300000",
      chuyencan: "500000",
      thamnien: "500000",
    },
   
  ];

  const fetchNhanVien = async () => {
    const data = await readEmployeesFireStore();
    if (data) {
      const employeeArray = Object.values(data);
      setListNV(employeeArray);
    } else {
      console.warn("Dữ liệu nhân viên không hợp lệ:", data);
    }
  };

  const fetchPhongBan = async () => {
    try {
      const data = await readPhongBan();
      if (data) {
        const phongBanArray = Object.values(data).map((p) => ({
          label: p.tenPhongBan,
          value: p.maPhongBan,
        }));
        setPhongBans(phongBanArray);
      }
    } catch (error) {
      console.error("Lỗi khi lấy phòng ban:", error);
    }
  };

  useEffect(() => {
    fetchNhanVien();
    fetchPhongBan();
  }, []);

  const renderSalaryItem = ({ item, index }) => {
    const employee = listNV.find(emp => emp.id === item.employeeId);
    const employeeName = employee ? employee.name : "Tên không tìm thấy";

    const workDays = duLieuChamCong.filter(chamCong => chamCong.ma_nhan_vien === item.employeeId).length;
    const totalOvertime = duLieuChamCong
      .filter(chamCong => chamCong.ma_nhan_vien === item.employeeId)
      .reduce((total, chamCong) => total + (chamCong.gio_tang_ca || 0), 0);

    return (
      <View
        style={[
          styles.salaryItem,
          { backgroundColor: index % 2 === 0 ? "#E8F5E9" : "#FFF3E0" },
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.name}>{item.employeeId}</Text>
          <Text style={styles.name}>{employeeName}</Text>
          <Text style={styles.date}>IT</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", width: '80%', alignItems: 'center' }}>
          <Text style={styles.name}>{item.thucnhan}</Text>
          <View>
            <Text style={styles.date}>Ngày công: {workDays}</Text>
            <Text style={styles.date}>Tăng ca: {totalOvertime} giờ</Text>
          </View>
        </View>
      </View>
    );
  };


  const formatDateToYYYYMM = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  useEffect(() => {
    const dataLuong1 = salaryData.filter(item => item.thang === formatDateToYYYYMM(currentDate));
    // Nếu không có dữ liệu, lấy dữ liệu tạm tính
    const luongs = dataLuong1.length > 0 ? dataLuong1 : luongTamTinh().filter(item => item.thang == formatDateToYYYYMM(currentDate));
    setListLuong(luongs)
  },[currentDate])

  // Filter salary data by selected month
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lương</Text>
      </View>

      <MonthSelector currentDate={currentDate} onChangeMonth={setCurrentDate} />

      <View style={{ width: 200 }}>
        <RNPickerSelect
          onValueChange={(value) => {
            console.log(value, "----");
          }}
          items={phongBans}
          style={pickerSelectStyles}
        />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="gray" />
        <Text style={styles.searchPlaceholder}>Tìm kiếm theo tên</Text>
      </View>

      <FlatList
        data={listLuong}
        renderItem={renderSalaryItem}
        keyExtractor={(item) => item.employeeId + item.thang}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// Styles for RNPickerSelect
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 15,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: "gray",
  },
  salaryItem: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
  amount: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default DanhSachLuong;