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
import { readChucVu, readPhongBan } from "../../services/database";
import { readEmployeesFireStore } from "../../services/EmployeeFireBase";
import {
  getCongThucLuong,
  getChamCongDetailsByMonth,
  getAllChamCongDetails,
} from "../../services/quanLyMucLuongFirebase";
import LoadingModal from "../../Compoment/modalLodading";
import dayjs from "dayjs";
const DanhSachLuong = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [phongBans, setPhongBans] = useState([]);
  const [listNV, setListNV] = useState([]);
  const [listLuong, setListLuong] = useState([]);
  const [chucVuData, setChucVuData] = useState([]);
  const [congThucLuong, setCongThucLuong] = useState([]);

  const [dsChamCong, setDSChamCong] = useState([]);

  const [visibleLoad, setVisibleLoad] = useState(true);

  const salaryData = [
    {
      employeeId: "NV001",
      thang: "10-2024",
      thucnhan: "5800000",
      luong: "4500000",
      tangca: "500000",
      phucap: "300000",
      chuyencan: "500000",
      thamnien: "0",
    },
    {
      employeeId: "NV002",
      thang: "10-2024",
      thucnhan: "6300000",
      luong: "4500000",
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

  const fetchDataChucvu = async () => {
    try {
      const data = await readChucVu();
      if (data) {
        const chucVuArray = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setChucVuData(chucVuArray);
      } else {
        setChucVuData([]); // No data
      }
    } catch (error) {
    } finally {
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

  const getCTL = async () => {
    const data = await getCongThucLuong();
    setCongThucLuong(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      setVisibleLoad(true);
      try {
        await Promise.all([
          fetchNhanVien(),
          fetchDataChucvu(),
          fetchPhongBan(),
          getCTL(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setVisibleLoad(false);
      }
    };

    fetchData();
  }, []);

  const renderSalaryItem = ({ item, index }) => {
    const employee = listNV.find((emp) => emp.id === item.employeeId);
    const employeeName = employee ? employee.name : "";

    const phongBan = phongBans.find((pb) => pb.value === employee.phongbanId);

    const ngayCong = dsChamCong.filter(
      (chamCong) => chamCong.employeeId === item.employeeId
    ).length;
    const totalOvertime = dsChamCong
      .filter((chamCong) => chamCong.employeeId === item.employeeId)
      .reduce((total, chamCong) => total + (chamCong?.tangca || 0), 0);

    return (
      <View
        style={[
          styles.salaryItem,
          { backgroundColor: index % 2 === 0 ? "#E8F5E9" : "#FFF3E0" },
        ]}
      >
        <LoadingModal visible={visibleLoad} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "50%" }}>
            <Text style={styles.name}>{employeeName}</Text>
          </View>

          <View style={{ width: "20%", paddingLeft: 3 }}>
            <Text style={styles.name}>{item.employeeId}</Text>
          </View>

          <View style={{ width: "27%", alignItems: "flex-end" }}>
            <Text style={styles.date}>{phongBan?.label}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            alignItems: "center",
          }}
        >
          <Text style={styles.tongTien}>
            {item.thucnhan.toLocaleString("vi-VN") + " vnđ"}
          </Text>
          <View>
            <Text style={styles.date}>Ngày công: {ngayCong}</Text>
            <Text style={styles.date}>Tăng ca: {totalOvertime} giờ</Text>
          </View>
        </View>
      </View>
    );
  };

  const formatDateToYYYYMM = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${month}-${year}`;
  };

  const luongTamTinh = (duLieuChamCong) => {
    const temporarySalaryData = [];

    const groupedData = duLieuChamCong.reduce((acc, chamcong) => {
      const employeeId = chamcong.employeeId;
      const dateTep = new Date(chamcong.month);

      const month = formatDateToYYYYMM(dateTep);

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          month,
          ngayCong: 0,
          totalOvertime: 0,
        };
      }
      acc[employeeId].ngayCong += 1;
      acc[employeeId].totalOvertime += chamcong?.tangCa ? chamcong?.tangCa : 0;

      return acc;
    }, {});

    for (const employeeId in groupedData) {
      const { month, ngayCong, totalOvertime } = groupedData[employeeId];
      const nhanVien = listNV.find((emp) => emp.employeeId === employeeId);
      const chucVu = chucVuData.find(
        (cv) => cv.chucvu_id === nhanVien.chucvuId
      );

      const luongCoban = parseInt(congThucLuong.luongcoban * chucVu?.hschucvu);
      const luong1Ngay = parseInt(luongCoban / 26);
      const chuyenCan = ngayCong >= 26 ? congThucLuong.chuyencan : 0;
      const phuCap = luongCoban * congThucLuong.hs_phucap;
      const tangCa =
        ((totalOvertime * luong1Ngay) / 8) * congThucLuong.hs_tangca;

      const thucNhan = luong1Ngay * ngayCong + chuyenCan + phuCap + tangCa;
      const salaryEntry = {
        employeeId,
        thang: month,
        thucnhan: thucNhan,
        luong: luongCoban,
        tangca: tangCa,
        phucap: phuCap,
        chuyencan: chuyenCan,
        thamnien: "0",
      };

      temporarySalaryData.push(salaryEntry);

      console.log(temporarySalaryData, "----------");
    }
    return temporarySalaryData;
  };

  const getChiTietCC = async () => {
    setVisibleLoad(true);
    const dataLuong = salaryData.filter(
      (item) => item.thang === formatDateToYYYYMM(currentDate)
    );

    const dataChamcong = await getChamCongDetailsByMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    setDSChamCong(dataChamcong);
    // Nếu không có dữ liệu, lấy dữ liệu tạm tính
    const luongs =
      dataLuong.length > 0 ? dataLuong : luongTamTinh(dataChamcong);
    setListLuong(luongs);
    setVisibleLoad(false);
  };

  useEffect(() => {
    getChiTietCC();
  }, [currentDate]);

  // Filter salary data by selected month

  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal visible={visibleLoad} />
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lương</Text>
      </View>

      <MonthSelector currentDate={currentDate} onChangeMonth={setCurrentDate} />

      <View style={{ width: 200 }}>
        <RNPickerSelect
          onValueChange={(value) => {}}
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
  tongTien: { fontSize: 18, fontWeight: "500", marginBottom: 4 },
  amount: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default DanhSachLuong;
