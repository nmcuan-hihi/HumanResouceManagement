import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import { getDatabase, ref, get, child } from "firebase/database";
import { readBangCapNhanVien } from "../../services/bangcapdb";
import { readBangCap } from "../../services/database";

import Icon from "react-native-vector-icons/MaterialIcons";
import ItemListEmployee from "../../Compoment/ItemEmployee";

const database = getDatabase();

export default function EmployeeDetailScreen({ route, navigation }) {
  const { manv } = route.params; // Lấy mã nhân viên từ tham số điều hướng
  const [employeeData, setEmployeeData] = useState(null); // State để lưu dữ liệu nhân viên

  const [bangCapNV, setBangCapNV] = useState([]);

  const [bangCa, setBangCap] = useState([]);

  // Hàm đọc dữ liệu nhân viên từ Firebase
  const fetchEmployeeData = async () => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `employees/${manv}`)); // Lấy dữ liệu của nhân viên cụ thể

      if (snapshot.exists()) {
        const data = snapshot.val();
        setEmployeeData(data); // Cập nhật state với dữ liệu của nhân viên
      } else {
        console.log("No data available for this employee");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  //hàm đọc danh sách bằng cấp nhân viên và ds bằng cấp
  const getDataBCNV = async () => {
    try {
      const databcnv = await readBangCapNhanVien();
      const arrDatabcnv = Object.values(databcnv);

      const dataByNvId = arrDatabcnv.filter((bc) => {
        return bc.employeeId == manv;
      });

      const databc = await readBangCap();
      const arrDatabc = Object.values(databc);

      const newData = [];

      // Sử dụng đúng chỉ số và tên biến trong vòng lặp
      for (let i = 0; i < dataByNvId.length; i++) {
        for (let j = 0; j < arrDatabc.length; j++) {
          // Sửa i thành j ở đây
          if (arrDatabc[j].bangcap_id === arrDatabcnv[i].bangcap_id) {
            newData.push({
              bangcap_id: arrDatabcnv[i].bangcap_id,
              tenBang: arrDatabc[j].tenBang,
              xacthuc: "0" ? "chưa xác thực" : "đã xác thực", // Đây là một điều kiện luôn trả về "chưa xác thực"
            });
          }
        }
      }

      setBangCapNV(newData);

      console.log(newData, "-----------");
    } catch (error) {
      console.error("Lỗi lấy data bc:", error);
    }
  };

  //hàm đọc danh sách bằng cấp
  const getDataBangCap = async () => {
    try {
    } catch (error) {
      console.error("Lỗi khi fetching dữ liệu:", error);
    }
  };

  useEffect(() => {
    getDataBCNV();
    fetchEmployeeData(); // Gọi hàm fetch khi component mount
  }, [manv]);

  // Hàm điều hướng đến màn hình chỉnh sửa
  const handlePress = () => {
    navigation.navigate("EditEmployee", { manv: manv }); // Điều hướng đến EmployeeEdit và truyền manv
  };

  return (
    <>
      <View style={styles.header}>
        {/* Sử dụng BackNav với onEditPress */}
        <BackNav
          navigation={navigation}
          name={"Chi tiết nhân viên"}
          btn={"Chỉnh sửa"}
          onEditPress={handlePress}
        />
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView>
          {employeeData ? (
            <>
              <Image
                source={
                  employeeData.imageUrl
                    ? { uri: employeeData.imageUrl }
                    : require("../../../assets/image/images.png")
                }
                style={styles.image}
              />

              {/* Thông tin nhân viên */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
                <InfoItem label="Tên" value={employeeData.name || "N/A"} />
                <InfoItem
                  label="Ngày sinh"
                  value={employeeData.ngaysinh || "N/A"}
                />
                <InfoItem
                  label="Số điện thoại"
                  value={employeeData.sdt || "N/A"}
                />
                <InfoItem label="CCCD" value={employeeData.cccd || "N/A"} />
                <InfoItem
                  label="Giới tính"
                  value={employeeData.gioitinh || "N/A"}
                />
                <InfoItem
                  label="Mật khẩu"
                  value={employeeData.matKhau || "N/A"}
                />
                <InfoItem
                  label="Thời gian đăng ký"
                  value={employeeData.ngaybatdau || "N/A"}
                />
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Thông tin thành viên</Text>
                <InfoItem
                  label="Trạng thái"
                  value={
                    employeeData.trangthai
                      ? "Đang hoạt động"
                      : "Ngưng hoạt động"
                  }
                />
                <InfoItem
                  label="Ngày hết hạn"
                  value={employeeData.expiryDate || "N/A"}
                />
              </View>

              <View style={styles.infoSection}>
                <View style={styles.headerBc}>
                  <Text style={styles.sectionTitle}>Bằng cấp</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ThemBangCapNV", {
                        employeeId: manv,
                      });
                    }}
                  >
                    <Icon name={"add"} size={30} color="orange" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  scrollEnabled={false}
                  style={{ marginTop: 20 }}
                  data={bangCapNV}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {}}>
                      <ItemListEmployee
                        manv={item.tenBang}
                        name={item.xacthuc}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </>
          ) : (
            <Text>Đang tải dữ liệu...</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    margin: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: "70%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    margin: 20,
    marginLeft: 60,
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    color: "#666",
  },
  infoValue: {
    fontWeight: "500",
  },

  headerBc: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
