import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  Image,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import AddThietBi from "./ThemThietbi";
import { getAllThietBi } from "../../services/thietBicongty";

export default function ListThietBi({ navigation }) {
  const [visibleModal, setVisibleModal] = useState(false);
  const [listTB, setListTB] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredTB, setFilteredTB] = useState([]);

  const getDSThietBi = () => {
    getAllThietBi((data) => {
      if (data && Array.isArray(data)) {
        setListTB(data);
        setFilteredTB(data);
      } else {
        console.error("Dữ liệu không hợp lệ:", data);
      }
    });
  };

  useEffect(() => {
    getDSThietBi();
  }, []);

  // Hàm lọc thiết bị theo từ khóa
  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      setFilteredTB(listTB);
    } else {
      const filtered = listTB.filter((item) =>
        item.ten.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTB(filtered);
    }
  };

  const Item = ({ item, onPress }) => (
    <TouchableOpacity style={styles.containerItem} onPress={onPress}>
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
      <View style={styles.itemBody}>
        <Text style={styles.textItem}>Số lượng:</Text>
        <Text style={styles.textItem}>{item.soLuong}</Text>
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.textItem}>Ngày:</Text>
        <Text style={styles.textItem}>{item.ngayNhap}</Text>
      </View>
  
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <BackNav
          navigation={navigation}
          name={"Danh sách thiết bị"}
          btn={"Thêm"}
          soLuong={filteredTB.length}
          onEditPress={() => setVisibleModal(true)}
        />
      </View>
      <AddThietBi validModal={visibleModal} setValidModal={setVisibleModal} />

      <View style={styles.viewBody}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thiết bị..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <FlatList
          style={{ marginHorizontal: 5 }}
          data={filteredTB}
          renderItem={({ item }) => (
            <Item
              item={item}
              onPress={() => {
                navigation.navigate("ChiTietThietBi", { id: item.id });
              }}
            />
          )}
          keyExtractor={(item) => item.id}
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
    backgroundColor: "#ffff",
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
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
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    width: "45%",
    margin: 10,
    alignItems: "center",
    borderColor: "#C0C0C0",
    backgroundColor: "#fff",
  },
  itemImage: {
    width: "90%",
    height: 100,
    resizeMode: "stretch",
    marginVertical: 5,
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
    fontSize: 13,
  },
  searchInput: {
    height: 40,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingLeft: 10,
    backgroundColor: "#FFFFFF",
  },
});
