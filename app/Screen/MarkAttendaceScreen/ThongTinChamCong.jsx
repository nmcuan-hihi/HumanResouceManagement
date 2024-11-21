import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { readThongTinChamCong, updateThongTinChamCong } from '../../services/chamcong'; // Import các hàm Firebase
import BackNav from '../../Compoment/BackNav';

export default function ThongTinChamCong({ navigation }) {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Lấy dữ liệu chấm công
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await readThongTinChamCong(); // Sử dụng hàm đọc dữ liệu
        if (data) {
          setAttendanceData(data);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Hàm cập nhật thông tin chấm công
  const handleSave = async () => {
    setLoading(true);
    try {
      // Gửi dữ liệu cập nhật
      await updateThongTinChamCong(attendanceData);
      Alert.alert(
        "Thông báo",
        "Cập nhật thành công!",
        [
          { text: "OK", onPress: () => setIsEditing(false) }, // Khi nhấn OK sẽ đóng chế độ chỉnh sửa
        ]
      );
    } catch (error) {
      console.error("Error saving attendance data:", error);
      Alert.alert("Thông báo", "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa thông tin chấm công
  const handleDelete = async () => {
    Alert.alert(
      "Xóa thông tin",
      "Bạn có chắc chắn muốn xóa thông tin chấm công này?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: async () => {
          setLoading(true);
          try {
            // Xóa dữ liệu từ Firebase
            await updateThongTinChamCong({}); // Gửi dữ liệu rỗng để xóa
            alert('Xóa thành công!');
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting attendance data:", error);
            alert('Xóa thất bại!');
          } finally {
            setLoading(false);
          }
        }},
      ]
    );
  };

  return (
    <>
      <BackNav navigation={navigation} name={"Thông tin chấm công"} />
      <SafeAreaView style={styles.container}>

        {/* Modal loading */}
        <Modal
          transparent={true}
          visible={loading}
          animationType="fade"
          onRequestClose={() => setLoading(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ActivityIndicator size="large" color="#007BFF" />
              <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
          </View>
        </Modal>

        <ScrollView style={styles.scrollView}>
          {attendanceData ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Giờ vào làm</Text>
                <TextInput
                  style={styles.input}
                  value={attendanceData.giovaolam}
                  editable={isEditing}
                  onChangeText={(text) => setAttendanceData({ ...attendanceData, giovaolam: text })} />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Giờ tan làm</Text>
                <TextInput
                  style={styles.input}
                  value={attendanceData.giotanlam}
                  editable={isEditing}
                  onChangeText={(text) => setAttendanceData({ ...attendanceData, giotanlam: text })} />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Hạn đi trễ</Text>
                <TextInput
                  style={styles.input}
                  value={attendanceData.handitre}
                  editable={isEditing}
                  onChangeText={(text) => setAttendanceData({ ...attendanceData, handitre: text })} />
              </View>

              {/* Chế độ chỉnh sửa */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  if (isEditing) {
                    handleSave(); // Lưu thông tin nếu đang chỉnh sửa
                  } else {
                    setIsEditing(!isEditing); // Bật chế độ chỉnh sửa
                  }
                }}
              >
                <Text style={styles.editButtonText}>{isEditing ? "Lưu" : "Chỉnh sửa"}</Text>
              </TouchableOpacity>

             
            </>
          ) : (
            <Text style={styles.noDataText}>Không có dữ liệu chấm công</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 9,
    padding: 20,
  },
  scrollView: {
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007BFF',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});
