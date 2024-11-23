import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Text,
  Alert,
  Image,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import AddThietBi from "./ThemThietbi";
import { getAllThietBi } from "../../services/thietBicongty";
export default function ListThietBi({ navigation }) {
  const [visibleModal, setVisibleModal] = useState(false);
  const [listTB, setListTB] = useState([]);


  const getDSThietBi = () => {
    getAllThietBi((data) => {
      console.log(data);
      setListTB(data); 
    });
  };

  useEffect(() => {
    getDSThietBi();
  }, []);

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
        <Text style={styles.textItem}>Ngày:</Text>
        <Text style={styles.textItem}>{item.ngayNhap}</Text>
      </View>
      {item.employeeId && (
        <View style={styles.itemBody}>
          <Text style={styles.textItem}> </Text>
          <Text style={[styles.textItem, { color: "red" }]}>Đã cấp</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <BackNav
          navigation={navigation}
          name={"Danh sách thiết bị"}
          btn={"Thêm"}
          soLuong={listTB.length}
          onEditPress={() => setVisibleModal(true)}
        />
      </View>
      <AddThietBi validModal={visibleModal} setValidModal={setVisibleModal} />
      <View style={styles.viewBody}>
        <FlatList
          style={{ marginTop: 10 }}
          data={listTB}
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
    backgroundColor: "#f8f8f8",
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
    borderWidth: 1,
    borderRadius: 10,
    width: "45%",
    margin: 10,
    alignItems: "center",
    borderColor: "#C0C0C0",
    backgroundColor: "#FFFFEE",
  },
  itemImage: {
    width: "80%",
    height: 100,
    resizeMode: "stretch",
    marginTop: 5,
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
