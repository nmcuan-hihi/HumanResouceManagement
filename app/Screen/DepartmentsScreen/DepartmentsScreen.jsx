import { View, Text, StyleSheet, FlatList, Modal, TextInput } from 'react-native';
import React, { useState } from 'react';
import BackNav from '../../Compoment/BackNav';
import ItemListEmployee from '../../Compoment/ItemEmployee';
import { TouchableOpacity } from 'react-native';
import HeaderNav from '../../Compoment/HeaderNav';

export default function PhongBanScreen({ navigation }) {
  const handlePress = () => {
    navigation.navigate('TeamMember');
  };
  const hienThiModal = () => {
    setVisibleModal(true)
  }
  const [visibleModal, setVisibleModal] = useState(false);
  const employeeData = [
    { manv: "IT01", name: "Phòng IT01" },
    { manv: "IT02", name: "Phòng IT02" },
    { manv: "IT03", name: "Phòng IT03" },
    { manv: "KT01", name: "Phòng kế toán 1" },
    { manv: "KT02", name: "Phòng kế toán 2" },
    { manv: "KT03", name: "Phòng kế toán 3" },
    { manv: "NS01", name: "Phòng nhân sự 1" },
    { manv: "NS02", name: "Phòng nhân sự 2" },
    { manv: "NS03", name: "Phòng nhân sự 3" },

    // Thêm nhiều nhân viên khác vào đây
  ];
  const itemCount = employeeData.length;
  return (
    <><BackNav navigation={navigation} name={"Phòng ban"} soLuong={itemCount} btn={"Add"} onEditPress={hienThiModal}/>
      <View style={styles.container}>


        <FlatList
          style={{ marginTop: 20 }} // Adjust margin as needed
          data={employeeData}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={handlePress} ><ItemListEmployee manv={item.manv} name={item.name} /></TouchableOpacity>

          )}
          keyExtractor={(item, index) => index.toString()} // Use index as a key
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
      </View></>

  );

}
const styles = StyleSheet.create({
  container: {
    flex: 9,
    backgroundColor: '#f8f8f8',

  },
  headerSection: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Add space between BackNav and number text
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 24, // Font size for "120"
    fontWeight: 'bold',
    color: '#000000', // Black color
    marginRight: 100, // Optional: Add margin to space from BackNav
  },



  // modal styles
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
    borderBottomWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 20,
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