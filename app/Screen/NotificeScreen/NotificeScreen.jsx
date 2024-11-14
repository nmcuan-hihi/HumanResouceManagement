import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  capNhatTrangThaiThongBao,
  layDanhSachThongBaoNhanVien,
  layThongBaoById,
  listenForNotifications,
} from "../../services/thongBaoFirebase";

export default function NotificeScreen({ navigation, route }) {
  const { employee } = route.params;
  const [listThongBaoNV, setListThongBaoNV] = useState([]);

  useEffect(() => {
    const unsubscribe = listenForNotifications(
      employee.employeeId,
      async (notifications) => {
        const newData = await Promise.all(
          notifications.map(async (tbnv) => {
            const dataTB = await layThongBaoById(tbnv.maThongBao);
            return {
              employeeId: tbnv.employeeId,
              maThongBao: tbnv.maThongBao,
              tieuDe: dataTB.tieuDe,
              noiDung: dataTB.noiDung,
              thoiGian: dataTB.thoiGian,
              trangThai: tbnv.trangThai,
            };
          })
        );

        setListThongBaoNV(newData.reverse());
      }
    );

    return () => unsubscribe();
  }, []);

  const capNhatTrangThai = async (employeeId, maThongBao) => {
    try {
      await capNhatTrangThaiThongBao(employeeId, maThongBao);
    } catch (error) {
      console.log(error);
    }
  };

  function getDayName(date) {
    const days = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    return days[date.getDay()];
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const dayName = getDayName(date);

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    return `${dayName}, ${date.toLocaleString("vi-VN", options)}`;
  }

  const ItemRender = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.trangThai == false) {
            capNhatTrangThai(employee.employeeId, item.maThongBao);
          }
        }}
        style={[
          styles.notificationCard,
          {
            backgroundColor: item.trangThai ? "#FFFFFF" : "#7FFFD4",
          },
        ]}
      >
        <Text style={styles.notificationTitle}>{item.tieuDe}</Text>
        <Text style={styles.notificationDate}>
          {item.noiDung.length > 60
            ? `${item.noiDung.substring(0, 60)}...`
            : item.noiDung}
        </Text>
        <View style={styles.viewTG}>
          <Text></Text>
          <Text style={styles.notificationTime}>
            {formatDate(item.thoiGian)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Thông báo</Text>
      </View>

      {listThongBaoNV.length == 0 && (
        <View style={styles.khongTB}>
          <Text style={styles.textTB}>Chưa có thông báo mới nào</Text>
        </View>
      )}

      <FlatList
        data={listThongBaoNV}
        keyExtractor={(item) => item.maThongBao}
        renderItem={({ item }) => <ItemRender item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#F5F5F5", // Màu xanh
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  khongTB: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textTB: {
    fontSize: 20,
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    elevation: 3, // Để tạo hiệu ứng đổ bóng
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationDate: {
    fontSize: 14,
    color: "#666",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    right: 0,
  },

  viewTG: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
