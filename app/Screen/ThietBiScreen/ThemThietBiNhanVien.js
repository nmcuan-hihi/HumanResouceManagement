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
import { getAllThietBi, updateThietBi } from "../../services/thietBicongty";

export default function ThemThietBiNhanVien({ navigation, route }) {
  const { employeeId } = route.params;
  const [listTB, setListTB] = useState([]);
  const [filteredTB, setFilteredTB] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  const getDSThietBi = () => {
    getAllThietBi((data) => {
      const newData = data.filter((tb) => {
        return tb.employeeId == null || tb.employeeId == "";
      });
      setListTB(newData);
      setFilteredTB(newData); // Gán danh sách mặc định vào danh sách lọc
    });
  };

  useEffect(() => {
    getDSThietBi();
  }, []);

  const toggleSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      if (selectedItems.length < 2) {
        setSelectedItems([...selectedItems, itemId]);
      } else {
        alert("Bạn chỉ có thể chọn tối đa 2 thiết bị.");
      }
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = listTB.filter((item) =>
        item.ten.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTB(filtered);
    } else {
      setFilteredTB(listTB);
    }
  };

  const handleCap = async () => {
    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một thiết bị.");
      return;
    }

    const ngayCap = Intl.DateTimeFormat("en-CA").format(new Date());

    for (let itemId of selectedItems) {
      const updatedData = {
        employeeId: employeeId,
        ngayCap: ngayCap,
      };

      await updateThietBi(itemId, updatedData);
    }

    Alert.alert("Thông báo", "Đã cấp thiết bị cho nhân viên.");
    navigation.goBack();
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.containerItem,
        selectedItems.includes(item.id) && styles.selectedItem,
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
          onEditPress={handleCap}
        />
      </View>

      <View style={styles.viewBody}>
        {/* Thanh tìm kiếm */}
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thiết bị..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <FlatList
          style={{ marginTop: 10 }}
          data={filteredTB} // Sử dụng danh sách đã lọc
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          ListFooterComponent={<View style={{ height: 75 }} />}
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
});
