import { useEffect, useState } from "react";
import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ItemDepartment from "../../Compoment/ItemDepartment";
import HeaderNav from "../../Compoment/HeaderNav";

const windowHeight = Dimensions.get("window").height;

const dataPB = [
  {
    maPB: "PB01",
    tenPB: "Phòng IT",
  },

  {
    maPB: "PB02",
    tenPB: "Phòng Marketing",
  },
];
const ListDepartementScreen = () => {
  const [visibleModal, setVisibleModal] = useState(false);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"position"}>
      <HeaderNav
        nameIconLeft="arrow-back"
        name={"Phòng ban"}
        nameIconRight={"group-add"}
        onEditPress={() => {
          setVisibleModal(true);
        }}
      />
      <FlatList
        data={dataPB}
        renderItem={({ item }) => <ItemDepartment item={item} />}
        keyExtractor={(item) => item.maPB}
      />

      <Modal visible={visibleModal} transparent={true} animationType="slide">
        <View style={styles.modalCtn}>
          <View style={styles.bodyModal}>
            <View style={{ width: "95%", alignSelf: "center" }}>
              <HeaderNav
                name={"Thêm phòng ban"}
                nameIconRight={"close"}
                onEditPress={() => {
                  setVisibleModal(false);
                }}
              />
            </View>

            <View style={styles.body}>
              <TextInput style={styles.TextInput} placeholder="Mã phòng ban" />
              <Text></Text>
              <TextInput style={styles.TextInput} placeholder="Tên phòng ban" />

              <View style={styles.bodyBtn}>
                <TouchableOpacity style={styles.btnThem}>
                  <Text style={styles.nameBtn}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};
styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    padding: 20,
  },

  modalCtn: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyModal: {
    width: "85%",
    height: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },

  body: {
    flex: 1,
    marginTop: 30,
    alignItems: "center",
    width: "100%",
  },
  TextInput: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 22,
  },
  bodyBtn: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
  },
  btnThem: {
    width: "90%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
  },
  nameBtn: { fontSize: 22, color: "#FFFFFF" },
});

export default ListDepartementScreen;
