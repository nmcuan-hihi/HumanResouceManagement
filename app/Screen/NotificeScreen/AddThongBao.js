import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { CheckBox } from "@rneui/themed";
import BackNav from "../../Compoment/BackNav";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dangKyNghiPhep } from "../../services/NghiPhepDB";
import { getPhongBanById } from "../../services/InfoDataLogin";
import { readPhongBanFromRealtime } from "../../services/PhongBanDatabase";
import DropDownPicker from "react-native-dropdown-picker";
import {
  taoThongBaoDataBase,
  themThongBaoNhanVien,
} from "../../services/thongBaoFirebase";
import { readEmployeesFireStore } from "../../services/EmployeeFireBase";
import LoadingModal from "../../Compoment/modalLodading";

export default function AddThongBao({ route, navigation }) {
  const { employee } = route.params;

  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [phongBans, setPhongBans] = useState("");
  const [open, setOpen] = useState(false);
  const [searchPB, setSearchPB] = useState(
    employee.phongbanId ? employee.phongbanId : ""
  );

  const [listNV, setListNV] = useState([]);

  const [listNVPB, setListNVPB] = useState([]);

  const [visibleLoad, setVisibleLoad] = useState(true);

  const fetchPhongBan = async () => {
    try {
      const data = await readPhongBanFromRealtime();
      if (data) {
        const phongBanArray = Object.values(data).map((p) => ({
          label: p.tenPhongBan,
          value: p.maPhongBan,
        }));
        setPhongBans(phongBanArray);
      }
    } catch (error) {
      console.error("Lỗi khi lấy phòng ban:", error);
    }
  };

  const fetchNhanVien = async () => {
    const data = await readEmployeesFireStore();
    if (data) {
      const employeeArray = Object.values(data);
      setListNV(employeeArray);
    } else {
      console.warn("Dữ liệu nhân viên không hợp lệ:", data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setVisibleLoad(true);
        await Promise.all([fetchPhongBan(), fetchNhanVien()]);
        setVisibleLoad(false);
      } catch (error) {
        setVisibleLoad(false);
      }
    };

    fetchData();
  }, []);

  const locNhanVienPb = () => {
    if (searchPB == "all" || !searchPB) {
      setListNVPB(listNV);
    } else {
      const data = listNV.filter((nv) => {
        return nv.phongbanId == searchPB;
      });
      setListNVPB(data);
    }
  };
  useEffect(() => {
    locNhanVienPb();
  }, [searchPB, listNV]);

  const taoThongBao = async () => {
    try {
      const dataTB = await taoThongBaoDataBase({
        tieuDe,
        noiDung,
      });

      for (const nhanvien of listNVPB) {
        await themThongBaoNhanVien(nhanvien.employeeId, dataTB.maThongBao);
      }

      Alert.alert("Thông báo", "Gửi thông báo thành công");
      setNoiDung("");
      setTieuDe("");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo thông báo");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackNav btn={"Gửi"} name={"Tạo thông báo"} onEditPress={taoThongBao} />
      </View>
      <View style={{ width: 200, marginVertical: 20 }}>
        <DropDownPicker
          open={open}
          value={searchPB}
          items={[{ label: "Tất cả", value: "all" }, ...phongBans]}
          setOpen={setOpen}
          setValue={setSearchPB}
          placeholder={"Chọn phòng ban"}
          disabled={employee.chucvuId != "GD"}
        />
      </View>

      <Text>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề"
        value={tieuDe}
        onChangeText={setTieuDe}
      />
      <Text>Nội dung</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Nhập nội dung thông báo"
        multiline
        value={noiDung}
        onChangeText={setNoiDung}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 10,
  },
});
