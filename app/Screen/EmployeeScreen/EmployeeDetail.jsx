import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import { getDatabase, ref, get, child } from "firebase/database";
import { readBangCapNhanVien } from "../../services/bangcapdb";
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import { getEmployeeById } from "../../services/EmployeeFireBase";
import { toggleXacthuc } from "../../services/bangcapdb";
import { readBangCap} from "../../services/database";

const database = getDatabase();

export default function EmployeeDetailScreen({ route, navigation }) {
  const { manv } = route.params;
  const { key } = route.params;
  const [employeeData, setEmployeeData] = useState(null);
  const [bangCapNV, setBangCapNV] = useState([]);

  // Hàm đọc dữ liệu nhân viên từ Firebase
  const fetchEmployeeData = async () => {
    try {
      const empl = await getEmployeeById(manv);
      setEmployeeData(empl);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  // Hàm đọc danh sách bằng cấp nhân viên
  const getDataBCNV = async () => {
    try {
      const databcnv = await readBangCapNhanVien();
      const arrDatabcnv = Object.values(databcnv);
      const dataByNvId = arrDatabcnv.filter((bc) => bc.employeeId === manv);
      
      const databc = await readBangCap();
      const arrDatabc = Object.values(databc);
      
      const newData = [];

      for (let i = 0; i < dataByNvId.length; i++) {
        for (let j = 0; j < arrDatabc.length; j++) {
          if (arrDatabc[j].bangcap_id === dataByNvId[i].bangcap_id) {
            newData.push({
              bangcap_id: dataByNvId[i].bangcap_id,
              tenBang: arrDatabc[j].tenBang,
              xacthuc: dataByNvId[i].xacthuc,
            });
          }
        }
      }

      setBangCapNV(newData);
    } catch (error) {
      console.error("Lỗi lấy data bc:", error);
    }
  };

  useEffect(() => {
    getDataBCNV();
    fetchEmployeeData();
  }, [manv]);

  // Hàm điều hướng đến màn hình chỉnh sửa
  const handlePress = () => {
    navigation.navigate("EditEmployee", { manv: manv });
  };

  const handleXacThuc = (item) => {
    if (!item || !item.bangcap_id) {
      console.error("Item không hợp lệ:", item);
      return;
    }

    const message = item.xacthuc === "0"
      ? "Xác thực bằng cấp này là chuẩn? Bạn có muốn xác thực bằng cấp này không?"
      : "Bạn muốn hủy xác thực bằng cấp này?";

    Alert.alert(
      "Xác thực bằng cấp",
      message,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            const updatedXacthuc = await toggleXacthuc(manv, item.bangcap_id);
            if (updatedXacthuc !== null) {
              getDataBCNV();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const bangcap = (item) => {
    navigation.navigate('DetailBangCapNV', { bangcap_id: item.bangcap_id, employeeId: manv});
    console.log("bangcap"+item.bangcap_id);
    console.log("id"+manv);
  };
  

  return (
    <>
      <View style={styles.header}>
        <BackNav
          navigation={navigation}
          name={"Chi tiết nhân viên"}
          {...(key === "inf" ? { btn: "Sửa", onEditPress: handlePress } : {})}
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
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
                <InfoItem label="Tên" value={employeeData.name || "N/A"} />
                <InfoItem label="Ngày sinh" value={employeeData.ngaysinh || "N/A"} />
                <InfoItem label="Số điện thoại" value={employeeData.sdt || "N/A"} />
                <InfoItem label="CCCD" value={employeeData.cccd || "N/A"} onPress={() => { navigation.navigate("cccd", { cccdNumber: employeeData.cccd }) }} />
                <InfoItem label="Giới tính" value={employeeData.gioitinh || "N/A"} />
                <InfoItem label="Mật khẩu" value={employeeData.matKhau || "N/A"} />
                <InfoItem label="Thời gian đăng ký" value={employeeData.ngaybatdau || "N/A"} />
              </View>

              <View style={styles.infoSection}>
                <View style={styles.headerBC}>
                  <Text style={styles.sectionTitle}>Bằng cấp</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      navigation.navigate("ThemBangCapNV", { employeeId: manv });
                    }}
                  >
                    <IconMaterial name={"add"} size={30} color="orange" />
                  </TouchableOpacity>
                </View>
                {bangCapNV && bangCapNV.length > 0 ? (
                  bangCapNV.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => bangcap(item)}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoValue}>{item.tenBang || "N/A"}</Text>
                        <View style={styles.iconContainer}>
                          <IconIonicons
                            name="checkmark-circle"
                            size={20}
                            color={item.xacthuc === "1" ? "green" : "black"}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text>Không có bằng cấp</Text>
                )}
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Trạng Thái</Text>
                <InfoItem
                  label="Trạng thái"
                  value={employeeData.trangthai ? "Đang hoạt động" : "Đã Nghỉ Việc"}
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

const InfoItem = ({ label, value, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
  },
  header: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: "blue",
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 5,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  addButton: {
    alignItems: "center",
  },
  headerBC: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
