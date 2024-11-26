import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  TextInput,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import {
  addThietBiNhanVien,
  getAllThietBi,
  updateThietBi,
} from "../../services/thietBicongty";

export default function ThemThietBiNhanVien({ navigation, route }) {
  const { employeeId } = route.params;
  const [listTB, setListTB] = useState([]);
  const [filteredTB, setFilteredTB] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Lấy danh sách thiết bị
  const getDSThietBi = () => {
    getAllThietBi((data) => {
      const newData = data.filter((tb) => tb.soLuong > tb.daCap); // Lọc những thiết bị còn lại
      setListTB(newData);
      setFilteredTB(newData); // Gán danh sách mặc định vào danh sách lọc
    });
  };

  useEffect(() => {
    getDSThietBi(); // Gọi khi component lần đầu render
  }, []);

  // Hàm toggle khi chọn thiết bị
  const toggleSelection = (itemId) => {
    if (selectedItems[itemId]) {
      const newSelectedItems = { ...selectedItems };
      if (newSelectedItems[itemId] > 1) {
        newSelectedItems[itemId] -= 1; // Giảm số lượng
      } else {
        delete newSelectedItems[itemId]; // Xóa thiết bị khỏi danh sách chọn
      }
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems({
        ...selectedItems,
        [itemId]: 1, // Thiết bị được chọn với số lượng là 1
      });
    }
  };

  // Hàm tăng số lượng
  const increaseQuantity = (itemId) => {
    const item = listTB.find((tb) => tb.id === itemId);
    const availableQuantity = item.soLuong - item.daCap; // Tính số lượng còn lại

    // Kiểm tra nếu số lượng chọn nhỏ hơn số lượng còn lại
    if (selectedItems[itemId] < availableQuantity) {
      setSelectedItems({
        ...selectedItems,
        [itemId]: selectedItems[itemId] + 1, // Tăng số lượng
      });
    } else {
      Alert.alert("Thông báo", "Số lượng vượt quá giới hạn.");
    }
  };

  // Hàm giảm số lượng
  const decreaseQuantity = (itemId) => {
    if (selectedItems[itemId] > 1) {
      setSelectedItems({
        ...selectedItems,
        [itemId]: selectedItems[itemId] - 1, // Giảm số lượng
      });
    }
  };

  // Hàm tìm kiếm thiết bị
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = listTB.filter((item) =>
        item.ten.toLowerCase().includes(text.toLowerCase()) // Lọc theo tên thiết bị
      );
      setFilteredTB(filtered);
    } else {
      setFilteredTB(listTB); // Nếu không tìm kiếm, trả lại danh sách ban đầu
    }
  };

  // Hàm cấp thiết bị cho nhân viên
  const handleCap = async () => {
    if (Object.keys(selectedItems).length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một thiết bị.");
      return;
    }

    const ngayCap = Intl.DateTimeFormat("en-CA").format(new Date()); // Lấy ngày cấp thiết bị

    for (let itemId of Object.keys(selectedItems)) {
      const item = listTB.find((tb) => tb.id === itemId);
      const quantity = selectedItems[itemId]; // Lấy số lượng đã chọn cho mỗi thiết bị

      const updatedData = {
        daCap: item.daCap + quantity, // Cập nhật số lượng đã cấp
      };

      // Cập nhật thiết bị
      await updateThietBi(itemId, updatedData);
      // Thêm thiết bị vào danh sách thiết bị của nhân viên
      await addThietBiNhanVien(employeeId, itemId, {
        employeeId,
        thietbiId: itemId,
        ngayCap: ngayCap,
        soLuong: quantity,
      });
    }

    Alert.alert("Thông báo", "Đã cấp thiết bị cho nhân viên.");
    navigation.goBack(); // Quay lại màn hình trước
  };

  // Hiển thị từng item thiết bị
  const Item = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.containerItem,
        selectedItems[item.id] && styles.selectedItem, // Thêm style nếu thiết bị được chọn
      ]}
      onPress={() => toggleSelection(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <Text style={styles.textLicensePlate}>{item.ten}</Text>

      <View style={styles.itemBody}>
        <Text style={styles.textItem}>Loại:</Text>
        <Text style={styles.textItem}>{item.loai}</Text>
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.textItem}>Hãng:</Text>
        <Text style={styles.textItem}>{item.hang}</Text>
      </View>

      {/* Hiển thị số lượng đã chọn */}
      {selectedItems[item.id] && (
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
            <Text style={styles.controlButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{selectedItems[item.id]}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
            <Text style={styles.controlButton}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <BackNav
          navigation={navigation}
          name={"Chọn thiết bị"}
          btn={"Cấp"}
          soLuong={listTB.length}
          onEditPress={handleCap} // Gọi hàm cấp thiết bị khi nhấn nút "Cấp"
        />
      </View>

      <View style={styles.viewBody}>
        {/* Thanh tìm kiếm */}
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thiết bị..."
          value={searchText}
          onChangeText={handleSearch} // Gọi hàm tìm kiếm khi người dùng nhập
        />
        <FlatList
          style={{ marginTop: 10 }}
          data={filteredTB} // Sử dụng danh sách đã lọc
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          ListFooterComponent={<View style={{ height: 75 }} />} // Thêm khoảng trống ở cuối danh sách
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    marginTop: 10,
  },
  containerItem: {
    borderWidth: 1,
    borderRadius: 10,
    width: "45%",
    margin: 10,
    alignItems: "center",
    borderColor: "#C0C0C0",
    backgroundColor: "#FFFFEE",
  },
  selectedItem: {
    backgroundColor: "#FFD700",
  },
  itemImage: {
    width: "95%",
    height: 100,
    resizeMode: "stretch",
    marginTop: 5,
    borderRadius: 10,
  },
  textLicensePlate: {
    color: "#000000",
    fontSize: 18,
  },
  itemBody: {
    flexDirection: "row",
    width: "95%",
    justifyContent: "space-between",
    margin: 5,
  },
  textItem: {
    color: "#000000",
    fontSize: 16,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  controlButton: {
    fontSize: 20,
    color: "#000000",
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    color: "#000000",
  },
});
