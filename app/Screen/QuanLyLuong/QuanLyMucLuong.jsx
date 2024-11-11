import React, { useEffect, useState } from "react";
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
import {
  getCongThucLuong,
  updateCongThucLuong,
} from "../../services/quanLyMucLuongFirebase";

import LoadingModal from "../../Compoment/modalLodading";
import ModalSuccess from "../../Compoment/modalSuccess";

export default function QuanLyMucLuong({ navigation }) {
  const [visibleModalLCB, setVisibleModalLCB] = useState(false);
  const [visibleModalCCan, setVisibleModalCCan] = useState(false);
  const [visibleModalPcap, setVisibleModalPcap] = useState(false);
  const [visibleModalTCa, setVisibleModalTCa] = useState(false);

  const [visibleLoad, setVisibleLoad] = useState(false);
  const [visibleSuccess, setVisibleSuccess] = useState(false);

  const [congThucLuong, setCongThucLuong] = useState([]);

  const getCTL = async () => {
    const data = await getCongThucLuong();
    setCongThucLuong(data);
  };

  const saveUpdatedValue = async (field, newValue) => {
    setVisibleLoad(true);
    try {
      const updatedData = { [field]: newValue };

      await updateCongThucLuong(updatedData);

      setCongThucLuong((prevState) => ({
        ...prevState,
        ...updatedData,
      }));

      setVisibleLoad(false);

      setVisibleSuccess(true);

      setTimeout(() => {
        setVisibleSuccess(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving updated value:", error);
      setVisibleLoad(false);
    }
  };

  useEffect(() => {
    getCTL();
  }, []);

  // Thêm nhiều nhân viên khác vào đây

  return (
    <>
      <LoadingModal visible={visibleLoad} />
      <ModalSuccess visible={visibleSuccess} />
      <View style={styles.header}>
        {/* Sử dụng BackNav với onEditPress */}
        <BackNav navigation={navigation} name={"Quản lý mức lương"} />
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.infoSection}>
            <Text>Mức lương cơ bản </Text>
            <View style={styles.viewText}>
              <Text style={styles.sectionTitle}>
                {(congThucLuong.luongcoban + "").replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                ) + " vnđ"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisibleModalLCB(true);
                }}
              >
                <Icon name="edit" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>

          {/*------------------------------- chuyên cần */}
          <View style={styles.infoSection}>
            <Text>Chuyên cần </Text>
            <View style={styles.viewText}>
              <Text style={styles.sectionTitle}>
                {(congThucLuong.chuyencan + "").replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                ) + " vnđ"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisibleModalCCan(true);
                }}
              >
                <Icon name="edit" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>

          {/*------------------------------- phụ cấp */}
          <View style={styles.infoSection}>
            <Text>Hệ số phụ cấp </Text>
            <View style={styles.viewText}>
              <Text style={styles.sectionTitle}>
                {congThucLuong.hs_phucap * 100 + " %"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisibleModalPcap(true);
                }}
              >
                <Icon name="edit" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>

          {/*------------------------------- tăng ca */}
          <View style={styles.infoSection}>
            <Text>Hệ số tăng ca </Text>
            <View style={styles.viewText}>
              <Text style={styles.sectionTitle}>
                {congThucLuong.hs_tangca * 100 + " %"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisibleModalTCa(true);
                }}
              >
                <Icon name="edit" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <ModalEdit
          visibleModal={visibleModalLCB}
          setVisibleModal={setVisibleModalLCB}
          name={"Lương cơ bản"}
          value={congThucLuong.luongcoban}
          onSave={(newValue) => saveUpdatedValue("luongcoban", newValue)}
        />

        <ModalEdit
          visibleModal={visibleModalCCan}
          setVisibleModal={setVisibleModalCCan}
          name={"Chuyên cần"}
          value={congThucLuong.chuyencan}
          onSave={(newValue) => saveUpdatedValue("chuyencan", newValue)}
        />

        <ModalEdit
          visibleModal={visibleModalPcap}
          setVisibleModal={setVisibleModalPcap}
          name={"Hệ số phụ cấp"}
          value={congThucLuong.hs_phucap * 100 + ""}
          onSave={(newValue) => saveUpdatedValue("hs_phucap", newValue / 100)}
        />

        <ModalEdit
          visibleModal={visibleModalTCa}
          setVisibleModal={setVisibleModalTCa}
          name={"Hệ số tăng ca"}
          value={congThucLuong.hs_tangca * 100 + ""}
          onSave={(newValue) => saveUpdatedValue("hs_tangca", newValue / 100)}
        />
      </SafeAreaView>
    </>
  );
}

const ModalEdit = ({
  visibleModal,
  setVisibleModal,
  name,
  value = "",
  onSave,
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(formatNumber(value));
  }, [value]);

  const formatNumber = (val) => {
    const numericValue = val.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleTextChange = (val) => {
    const numericValue = val.replace(/\D/g, "");
    setInputValue(formatNumber(numericValue));
  };

  return (
    <Modal visible={visibleModal} transparent={true} animationType="slide">
      <View style={styles.modalCtn}>
        <View style={styles.bodyModal}>
          <View style={{ width: "95%", alignSelf: "center" }}>
            <HeaderNav
              name={name}
              nameIconRight={"close"}
              onEditPress={() => {
                setVisibleModal(false);
              }}
            />
          </View>

          <View style={styles.body}>
            <TextInput
              style={styles.TextInput}
              value={inputValue}
              onChangeText={handleTextChange}
              placeholder={name}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.bodyBtn}>
            <TouchableOpacity
              style={styles.btnThem}
              onPress={() => {
                onSave(inputValue.replace(/\./g, ""));
                setVisibleModal(false);
              }}
            >
              <Text style={styles.nameBtn}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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

  infoSection: {
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 16,
  },

  viewText: {
    borderWidth: 1,
    alignItems: "center",
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
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

  btnXoa: {
    width: "90%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  nameBtn: { fontSize: 22, color: "#FFFFFF" },
});
