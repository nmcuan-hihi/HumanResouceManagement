import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import BackNav from '../../Compoment/BackNav'; // Navigation back button component
import Feather from 'react-native-vector-icons/Feather';
import { readChucVu, updateChucVu, deleteChucVu } from '../../services/database'; // Database functions

export default function ChucVuDetail({ route, navigation }) {
  const { chucVuId,chucvu_id } = route.params; // Get Chuc Vu ID from route params
  const [isEditing, setIsEditing] = useState(false);
  const [currentChucVu, setCurrentChucVu] = useState('');
  const [editedChucVu, setEditedChucVu] = useState('');
  const [currentHeSo, setCurrentHeSo] = useState('');
  const [editedHeSo, setEditedHeSo] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchChucVu = async () => {
      try {
        const chucVuData = await readChucVu();

        console.log(chucVuData[chucVuId])
        if (chucVuData && chucVuData[chucVuId]) {
          const chucVu = chucVuData[chucVuId];
          setCurrentChucVu(chucVu.loaichucvu);
          setEditedChucVu(chucVu.loaichucvu);
          setCurrentHeSo(chucVu.hschucvu);
          setEditedHeSo(chucVu.hschucvu);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu chức vụ:', error);
      }
    };

    fetchChucVu();
  }, [chucVuId]);

  const handleSave = async () => {
    try {
      const updatedChucVu = {
        loaichucvu: editedChucVu,
        hschucvu: editedHeSo,
      };
      await updateChucVu(chucvu_id, updatedChucVu);
      setCurrentChucVu(editedChucVu);
      setCurrentHeSo(editedHeSo);
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi khi lưu thông tin chức vụ:', error);
    }
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = async () => {
    try {
      await deleteChucVu(chucvu_id);
      setConfirmDelete(false);
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi xóa chức vụ:', error);
      setConfirmDelete(false);
    }
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

  return (
    <>
      <View style={styles.header}>
        <BackNav navigation={navigation} name="Chi tiết chức vụ" />
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Mã chức vụ</Text>
            <Text style={styles.sectionTitle1}>{chucvu_id}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Tên chức vụ</Text>
            
              <Text>{currentChucVu}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Hệ số chức vụ</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                placeholder="Hệ số chức vụ"
                value={editedHeSo}
                onChangeText={(text) => setEditedHeSo(text)}
                keyboardType="numeric"
              />
            ) : (
             

              <View style={styles.inlineEditContainer}>
              <Text style={styles.sectionTitle1}>{currentHeSo}</Text>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={styles.editBtn}
              >
                <Feather name="edit-2" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            )}
          </View>

          <View style={styles.buttonSection}>
            {isEditing ? (
              <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                <Text style={styles.nameBtn}>Lưu</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnXoa} onPress={handleDelete}>
                <Text style={styles.nameBtn}>Xóa</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <Modal visible={confirmDelete} transparent={true} animationType="slide">
          <View style={styles.modalCtn}>
            <View style={styles.bodyModal}>
              <Text style={styles.confirmText}>
                Bạn có chắc chắn muốn xóa chức vụ này không?
              </Text>
              <View style={styles.modalBtnContainer}>
                <TouchableOpacity style={styles.modalBtn} onPress={confirmDeleteYes}>
                  <Text style={styles.modalBtnText}>Có</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtn} onPress={confirmDeleteNo}>
                  <Text style={styles.modalBtnText}>Không</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle1: {
    fontSize: 20,
    marginBottom: 20,
  },
  sectionTitle22: {
    fontSize: 20,
    marginBottom: 20,
  },
  inlineEditContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editBtn: {
    padding: 8,
    backgroundColor: '#FFA500',
    borderRadius: 5,
  },
  textInput: {
    fontSize: 18,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  buttonSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  btnSave: {
    width: '90%',
    height: 50,
    borderRadius: 20,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnXoa: {
    width: '90%',
    height: 50,
    borderRadius: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  nameBtn: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  modalCtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyModal: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalBtn: {
    width: '40%',
    padding: 10,
    backgroundColor: '#FFA500',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
