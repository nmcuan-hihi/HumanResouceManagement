import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import HeaderNav from "../../Compoment/HeaderNav";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function DetailBangCap({ navigation, route }) {
  const { maBC, tenBC } = route.params.item;

  const [visibleEdit, setVisibleEdit] = useState(false);
  const [nameBC, setNameBC] = useState(tenBC);

  // Thêm nhiều nhân viên khác vào đây

  return (
    <>
      <View style={styles.header}>
        {/* Sử dụng BackNav với onEditPress */}
        <BackNav navigation={navigation} name={"Chi tiết bằng cấp"} />
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Tên bằng cấp</Text>
            <View style={styles.bodyInput}>
              <TextInput
                style={styles.textInput}
                value={nameBC}
                onChangeText={setNameBC}

                editable={visibleEdit}
              ></TextInput>
              <TouchableOpacity
                onPress={() => {
                  setVisibleEdit(true);
                }}
              >
                <Icon name="edit" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {visibleEdit ? (
          <View style={styles.bodyBtn}>
            <TouchableOpacity style={styles.btnThem}>
              <Text style={styles.nameBtn}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    margin: 10,
    alignContent: "center",
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
  bodyInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  textInput: {
    height: 50,
    fontSize: 18,
    borderBottomWidth: 1,
    width: "90%",
  },

  bodyBtn: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
  },

  btnThem: {
    width: "90%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  nameBtn: { fontSize: 22, color: "#FFFFFF" },
});
