import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

import RNPickerSelect from "react-native-picker-select";

import MonthSelector from "../../Compoment/SelectMonth_DSLuong";
import { readChucVu, readPhongBan } from "../../services/database";
import {
  getCongThucLuong,
  getChamCongByMonth,
  getAllChamCongDetails,
  luuDanhSachLuongFirebase,
  layDanhSachBangLuongTheoThang,
  getChamCongByMonth123,
  readEmployeesFireStore,
} from "../../services/quanLyMucLuongFirebase";
import LoadingModal from "../../Compoment/modalLodading";
import dayjs from "dayjs";
import BackNav from "../../Compoment/BackNav";

import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const DanhSachLuong = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [phongBans, setPhongBans] = useState([]);
  const [listNV, setListNV] = useState([]);
  const [listLuong, setListLuong] = useState([]);
  const [listLuongGetDB, setListLuongGetDB] = useState([]);
  const [chucVuData, setChucVuData] = useState([]);
  const [congThucLuong, setCongThucLuong] = useState([]);
  const [dsChamCong, setDSChamCong] = useState([]);
  const [visibleLoad, setVisibleLoad] = useState(true);
  const [checkLoad, setCheckLoad] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchPB, setSearchPB] = useState();
  const [listSearchByPb, setListSearchByPb] = useState([]);
  const [listSearch, setListSearch] = useState([]);

  const [open, setOpen] = useState(false);

  const [itemsPB, setItemsPV] = useState([]);

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
        setCheckLoad(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setVisibleLoad(false);
      }
    };

    fetchData();
  }, []);

  const formatDateToYYYYMM = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1);

    return `${month}-${year}`;
  };

  function calculateHours(timeIn, timeOut) {
    const formatTime = (time) => {
      // Chuyển đổi thời gian về định dạng 24 giờ
      const [timeParts, modifier] = time.split(" ");
      let [hours, minutes] = timeParts.split(":");

      if (modifier === "PM" && hours !== "12") {
        hours = parseInt(hours, 10) + 12; // Chuyển đổi PM
      }
      if (modifier === "AM" && hours === "12") {
        hours = "0"; // Chuyển đổi 12 AM thành 00
      }

      // Trả về đối tượng Date (Ngày, tháng, năm có thể được ghi rõ nếu cần)
      const date = new Date();
      date.setHours(hours, minutes);

      return date;
    };

    const startTime = formatTime(timeIn + "");
    const endTime = formatTime(timeOut + "");
    // Tính số giờ giữa thời gian vào và ra
    const diffInMilliseconds = endTime - startTime; // Số mili giây giữa hai thời gian
    const diffInHours = diffInMilliseconds / 1000 / 60 / 60; // Chuyển đổi mili giây sang giờ
    return diffInHours;
  }

  const luongTamTinh = (duLieuChamCong) => {
    const temporarySalaryData = [];

    const groupedData = duLieuChamCong.reduce((acc, chamcong) => {
      const employeeId = chamcong.employeeId;

      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          ngayCong: 0,
          totalOvertime: 0,
        };
      }

      const gioLam = calculateHours(chamcong.timeIn, chamcong.timeOut) || 0;
      console.log(chamcong.tangCa);
      let temp = 0;
      if (gioLam / 8 > 1) {
        temp = 1;
      } else {
        temp = Math.round((gioLam / 8) * 10) / 10;
      }

      acc[employeeId].ngayCong += temp;
      acc[employeeId].totalOvertime += chamcong?.tangCa || 0;

      return acc;
    }, {});

    for (const employeeId in groupedData) {
      const { ngayCong, totalOvertime } = groupedData[employeeId];
      const nhanVien = listNV.find((emp) => emp.employeeId === employeeId);

      const chucVu = chucVuData.find(
        (cv) => cv.chucvu_id === nhanVien.chucvuId
      );

      const dateString = nhanVien.ngaybatdau;
      const [ngay, thang, nam] = dateString.split("/").map(Number);
      const dateObject = new Date(nam, thang - 1, ngay);
      const today = new Date();

      const diffMilliseconds = today - dateObject ? today - dateObject : 0;

      // Chuyển milliseconds sang năm
      const namThamNien = Math.floor(
        diffMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
      );

      const hs_thamnien = congThucLuong?.hs_thamnien || 0;

      const luongCoban = parseInt(congThucLuong.luongcoban * chucVu?.hschucvu);
      const luong1Ngay = parseInt(luongCoban / 26);
      const luong = luong1Ngay * ngayCong;
      const chuyenCan = ngayCong >= 26 ? congThucLuong.chuyencan : 0;
      const phuCap = parseInt(luong * congThucLuong.hs_phucap);
      const tangCa = parseInt(
        ((totalOvertime * luong1Ngay) / 8) * congThucLuong.hs_tangca
      );

      const luongThamNien = parseInt(luong * hs_thamnien * namThamNien);
      const thucNhan = parseInt(
        luong1Ngay * ngayCong + chuyenCan + phuCap + tangCa + luongThamNien
      );

      const salaryEntry = {
        employeeId,
        thang: formatDateToYYYYMM(currentDate) + "",
        ngaycong: ngayCong + "",
        thucnhan: thucNhan + "",
        luong: luong + "",
        tangca: tangCa + "",
        phucap: phuCap + "",
        chuyencan: chuyenCan + "",
        thamnien: luongThamNien + "",
      };

      temporarySalaryData.push(salaryEntry);
    }
    return temporarySalaryData;
  };

  //Lấy chi tiết chấm công
  const getChiTietCC = async () => {
    setVisibleLoad(true);

    // Lấy dữ liệu lương
    const dataluong = await layDanhSachBangLuongTheoThang(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );

    // Kiểm tra và cập nhật lại danh sách lương
    const today = formatDateToYYYYMM(new Date());
    let luongs = [];

    if (today !== formatDateToYYYYMM(currentDate)) {
      luongs = dataluong.length > 0 ? dataluong : luongTamTinh(dsChamCong);
    } else {
      luongs = luongTamTinh(dsChamCong);
    }

    setListLuong(luongs);
    setVisibleLoad(checkLoad);
  };

  useEffect(() => {
    getChamCongByMonth123(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      (data) => {
        setDSChamCong(data);
      }
    );
  }, [currentDate]);

  useEffect(() => {
    if (!checkLoad) {
      getChiTietCC();
    }
  }, [currentDate, checkLoad, dsChamCong]);

  const filterNVByPb = () => {
    const listNVByPB = listNV.filter((nv) => {
      if (!searchPB || searchPB == "all") {
        return listNV;
      } else {
        return nv.phongbanId == searchPB;
      }
    });

    const listLuongTheoNV = listLuong.filter((luong) => {
      const listNhanVienIds = listNVByPB.map((nv) => nv.id);
      return listNhanVienIds.includes(luong.employeeId);
    });

    setListSearchByPb(listLuongTheoNV);
  };

  const filterNV = () => {
    const dataNV = listNV.filter((nv) => {
      return (
        nv.name
          .toString()
          .toLowerCase()
          .includes(searchInput.toString().toLowerCase()) ||
        nv.employeeId
          .toString()
          .toLowerCase()
          .includes(searchInput.toString().toLowerCase())
      );
    });

    const data = listSearchByPb.filter((luong) => {
      const listNhanVienIds = dataNV.map((nv) => nv.id);
      return listNhanVienIds.includes(luong.employeeId);
    });

    setListSearch(data);
  };

  useEffect(() => {
    const uniqueIds = new Set(listNV.map((nv) => nv.id));
    filterNVByPb(listLuong.filter((luong) => uniqueIds.has(luong.employeeId)));
  }, [listLuong, searchPB]);

  useEffect(() => {
    filterNV();
  }, [listSearchByPb, searchInput]);

  const luuBangLuong = async () => {
    try {
      // Hiển thị cửa sổ thông báo xác nhận
      Alert.alert(
        "Xác nhận lưu thông tin",
        `Bạn có chắc chắn muốn lưu thông tin bảng lương cho tháng ${formatDateToYYYYMM(
          currentDate
        )} `,
        [
          {
            text: "Hủy",
            onPress: () => console.log("Hủy lưu thông tin"),
            style: "cancel",
          },
          {
            text: "Lưu",
            onPress: async () => {
              setVisibleLoad(true);
              await luuDanhSachLuongFirebase(
                luongTamTinh(dsChamCong),
                currentDate.getFullYear(),
                currentDate.getMonth() + 1
              );
              getChiTietCC();
              setVisibleLoad(false);
              Alert.alert("Thông báo", "Lưu thông tin thành công");
            },
          },
        ]
      );
    } catch (error) {
      setVisibleLoad(false);
      Alert.alert("Thông báo", "Không thể lưu");
    }
  };

  const xuatBangLuongExcel = (dsLuong) => {
    const newdata = dsLuong.map((d) => {
      const nv = listNV.find((nv) => {
        return nv.employeeId === d.employeeId;
      });

      return {
        employeeId: d.employeeId,
        name: nv.name,
        thang: d.thang,
        ngaycong: d.ngaycong,
        luong: d.luong,
        tangca: d.tangca,
        phucap: d.phucap,
        chuyencan: d.chuyencan,
        thamnien: d.thamnien,
        thucnhan: d.thucnhan,
      };
    });

    let wb = XLSX.utils.book_new();

    // Tạo sheet từ mảng dữ liệu dsLuong
    const ws = XLSX.utils.json_to_sheet([
      {
        employeeId: "Mã nhân viên",
        name: "Tên nhân viên",
        thang: "Tháng",
        ngaycong: "Ngày công",
        luong: "Lương",
        tangca: "Tiền tăng ca",
        phucap: "Phụ cấp",
        chuyencan: "Chuyên cần",
        thamnien: "Phụ cấp thâm niên",
        thucnhan: "Lương thực nhận",
      },
      ...newdata,
    ]);

    // Đặt tên cho sheet
    XLSX.utils.book_append_sheet(wb, ws, "BangLuong", true);

    const base64 = XLSX.write(wb, { type: "base64" });
    const filename =
      FileSystem.documentDirectory +
      `BangLuong${formatDateToYYYYMM(currentDate)}.xlsx`;

    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(filename);
    });
  };

  const renderSalaryItem = ({ item, index }) => {
    const employee = listNV.find((emp) => emp.id === item.employeeId);
    const employeeName = employee ? employee.name : "";

    const phongBan = phongBans.find((pb) => pb.value === employee.phongbanId);

    const totalOvertime = dsChamCong
      .filter((chamCong) => chamCong.employeeId === item.employeeId)
      .reduce((total, chamCong) => total + (chamCong?.tangCa || 0), 0);

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ChiTietBangLuong", {
            employeeId: item.employeeId,
          });
        }}
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
            {item.thucnhan.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " vnđ"}
          </Text>
          <View>
            <Text style={styles.date}>Ngày công: {item.ngaycong}</Text>
            <Text style={styles.date}>
              Tăng ca: {totalOvertime.toFixed(1)} giờ
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal visible={visibleLoad} />
      <View style={{ height: 100 }}>
        <BackNav
          navigation={navigation}
          name={"Lương nhân viên"}
          btn={"Lưu"}
          onEditPress={luuBangLuong}
        />
      </View>
      <View style={{ marginTop: -30 }}>
        <MonthSelector
          currentDate={currentDate}
          onChangeMonth={setCurrentDate}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 16,
          alignItems: "center",
        }}
      >
        <View style={{ width: 200 }}>
          <DropDownPicker
            open={open}
            value={searchPB}
            items={[{ label: "Tất cả", value: "all" }, ...phongBans]}
            setOpen={setOpen}
            setValue={setSearchPB}
            placeholder={"Chọn phòng ban"}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            xuatBangLuongExcel(listSearch);
          }}
          style={{ padding: 10, marginRight: 20 }}
        >
          <AntDesign name="exclefile1" size={30} color="orange" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo mã hoặc tên nhân viên"
          onChangeText={(text) => setSearchInput(text)}
          value={searchInput}
        />
      </View>
      {listSearch.length == 0 && (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>Không có dữ liệu!!!</Text>
        </View>
      )}

      <FlatList
        data={listSearch}
        renderItem={renderSalaryItem}
        keyExtractor={(item) => item.employeeId + item.thang}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
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
    marginTop: -20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    padding: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 10,
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
