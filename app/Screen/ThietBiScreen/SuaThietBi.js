import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import { getThietBiById, updateThietBi } from "../../services/thietBicongty";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { readEmployees } from "../../services/database";
import { SelectList } from "react-native-dropdown-select-list";
import { getEmployeeById } from "../../services/EmployeeFireBase";

const SuaThietBi = ({ navigation, route }) => {
  const id = route.params.id;
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showNC, setShowNC] = useState(false);

  const [thietBi, setThietBi] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [ten, setTen] = useState();
  const [loai, setLoai] = useState();
  const [hang, setHang] = useState();
  const [ngayNhap, setNgayNhap] = useState();
  const [maNV, setMaNV] = useState();
  const [ngayCap, setNgayCap] = useState();
  const [nhanVien, setNhanVien] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);

  const [checkImg, setCheckImg] = useState(false);

  const getThietBi = async () => {
    try {
      const data = await getThietBiById(id);
      setThietBi(data);
      console.log(data, "");

      const dataNV = await getEmployeeById(data.employeeId);
      setNhanVien(dataNV);
    } catch (e) {}
  };

  //Lấy danh sách nhân viên
  const getListNV = async () => {
    const data = await readEmployees();
    const dataArr = Object.values(data);

    const dataDropDown = dataArr.map((nv) => {
      return {
        key: nv.employeeId,
        value: nv.name,
      };
    });

    setDataSelect(dataDropDown);
  };
  useEffect(() => {
    getThietBi();
    getListNV();
  }, []);
  useEffect(() => {
    if (thietBi) {
      setImageUrl(thietBi.imageUrl);
      setTen(thietBi.ten);
      setLoai(thietBi.loai);
      setHang(thietBi.hang);
      setNgayNhap(thietBi.ngayNhap);
      setMaNV(thietBi.employeeId);
      setNgayCap(thietBi.ngayCap);

      ngayNhap ? setDate(new Date(ngayNhap)) : date;
    }
  }, [thietBi]);

  const onChange = (event, selectedDate) => {
    setShow(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
    selectedDate
      ? setNgayNhap(Intl.DateTimeFormat("en-CA").format(currentDate))
      : "";
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const onChangeCap = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowNC(false);
    setNgayCap(Intl.DateTimeFormat("en-CA").format(currentDate));
  };

  const showDatepickerCap = () => {
    setShowNC(true); // Hiện DateTimePicker
  };

  const handleUpdate = async () => {
    try {
      let data;
      if (checkImg) {
        data = {
          imageUrl,
          ten,
          loai,
          hang,
          ngayNhap: ngayNhap || null,
          employeeId: maNV || null,
          ngayCap: ngayCap || null,
        };
      } else {
        data = {
          ten,
          loai,
          hang,
          ngayNhap: ngayNhap || null,

          employeeId: maNV || null,
          ngayCap: ngayCap || null,
        };
      }

      if (maNV && ngayCap == null) {
        Alert.alert(
          "Thông báo",
          "Vui lòng chọn ngày cấp thiết bị cho nhân viên"
        );
        return;
      }

      await updateThietBi(id, data);
      Alert.alert("Thông báo", "Cập nhật thành công");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thiết bị");
    }
  };

  const selectImage = async () => {
    const actionSheetOptions = ["Chọn ảnh", "Chụp ảnh", "Hủy"];

    Alert.alert(
      "Chọn hình ảnh",
      "",
      actionSheetOptions.slice(0, 2).map((option, index) => ({
        text: option,
        onPress: index === 0 ? launchImageLibrary : launchCamera,
      })),
      { cancelable: true }
    );
  };

  const launchImageLibrary = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUrl(result.assets[0].uri);
      setCheckImg(true);
    }
  };

  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Bạn cần cấp quyền truy cập camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUrl(result.assets[0].uri);
      setCheckImg(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 40 }}>
        <BackNav navigation={navigation} name={"Sửa thiết bị"} />
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}></Text>

          {/* Hiển thị hình ảnh đã chọn */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatar1} onPress={selectImage}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.avatar} />
              ) : (
                <Image
                  source={require("../../../assets/image/camera.png")}
                  style={styles.avatar}
                />
              )}

              <View style={styles.iconImage}>
                <Image
                  source={require("../../../assets/image/camera.png")}
                  style={styles.iconImage1}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Tên:</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên thiết bị"
            value={ten}
            onChangeText={setTen}
          />

          <Text style={styles.label}>Loại:</Text>
          <TextInput
            style={styles.input}
            placeholder="Loại thiết bị"
            value={loai}
            onChangeText={setLoai}
          />

          <Text style={styles.label}>Hãng:</Text>
          <TextInput
            style={styles.input}
            placeholder="Hãng sản xuất"
            value={hang}
            onChangeText={setHang}
          />

          <Text style={styles.label}>Ngày nhập:</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Ngày nhập (YYYY-MM-DD)"
              value={ngayNhap}
              editable={false}
              onChangeText={setNgayNhap}
            />
            <TouchableOpacity
              style={styles.iconPicker}
              onPress={showDatepicker}
            >
              <Icon name="calendar-month" size={24} color="#FFC107" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nhân viên được cấp:</Text>
          {isEditing ? (
            <>
              <View style={styles.label}>
                <SelectList
                  placeholder={nhanVien?.name}
                  setSelected={(val) => {
                    setMaNV(val);
                  }}
                  data={dataSelect}
                  save="key"
                />
              </View>
              {maNV && (
                <>
                  <Text style={styles.label}>Ngày cấp:</Text>
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder="Ngày cấp (YYYY-MM-DD)"
                      value={ngayCap}
                      editable={false}
                      onChangeText={setNgayCap}
                    />
                    <TouchableOpacity
                      style={styles.iconPicker}
                      onPress={showDatepickerCap}
                    >
                      <Icon name="calendar-month" size={24} color="#FFC107" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Chưa cấp cho nhân viên"
                value={nhanVien?.name}
                editable={false}
              />
              <TouchableOpacity
                style={styles.iconPicker}
                onPress={() => {
                  setIsEditing(!isEditing);
                }}
              >
                <Icon name="edit-square" size={24} color="#FFC107" />
              </TouchableOpacity>
            </View>
          )}

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={"date"}
              is24Hour={true}
              onChange={onChange}
            />
          )}

          {showNC && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={"date"}
              is24Hour={true}
              onChange={onChangeCap}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Cập nhật</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#fff",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar1: {
    width: 180,
    height: 120,
    borderRadius: 20,
    borderWidth: 1,
    padding: 1,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  iconImage: {
    width: 40,
    height: 40,
    position: "absolute",
    bottom: -10,
    right: -10,
    zIndex: 100,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  iconImage1: {
    width: 30,
    height: 30,

    tintColor: "orange",
  },

  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: "#000000",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 5,
  },
  iconPicker: {
    position: "absolute",
    justifyContent: "center",
    alignSelf: "center",
    right: 10,
    height: 50,
  },

  button: {
    backgroundColor: "orange",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    marginVertical: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default SuaThietBi;
