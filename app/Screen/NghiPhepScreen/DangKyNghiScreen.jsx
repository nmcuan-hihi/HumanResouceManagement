import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { CheckBox } from '@rneui/themed';
import BackNav from '../../Compoment/BackNav';

export default function DangKyNghiScreen() {
    const [selectedIndex, setSelectedIndex] = useState(0); // Default to the first option (paid leave)

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
         <BackNav btn={"Gửi"} name={"Đăng Ký Nghỉ Phép"} />
        </View>
  
        {/* Date Selection */}
        <View style={styles.dateContainer}>
          {/* <TouchableOpacity style={styles.dateBox}>
            <Text>21, December 2022</Text>
          </TouchableOpacity>
          <Text style={styles.toText}>To</Text>
          <TouchableOpacity style={styles.dateBox}>
            <Text>22, December 2022</Text>
          </TouchableOpacity> */}
        </View>
  
   {/* CheckBox Options in a single row */}
   <View style={styles.checkboxContainer}>
          <CheckBox
            checked={selectedIndex === 0}
            onPress={() => setSelectedIndex(0)}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            title="Nghỉ có lương"
            containerStyle={styles.checkbox}
            textStyle={styles.checkboxText}
          />
          <CheckBox
            checked={selectedIndex === 1}
            onPress={() => setSelectedIndex(1)}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            title="Không lương"
            containerStyle={styles.checkbox}
            textStyle={styles.checkboxText}
          />
        </View>
        {/* Title and Reason Fields */}
        <Text>Tiêu đề</Text>
        <TextInput style={styles.input} placeholder="Nhập tiêu đề" />
        <Text>Lý Do</Text>
        <TextInput style={styles.textArea} placeholder="Nhập lý do" multiline />
  
       
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: 'white' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    dateContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    dateBox: { padding: 10, backgroundColor: '#FFD700', borderRadius: 8 },
    toText: { marginHorizontal: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 10, marginTop:5, },
    textArea: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginTop:5, height: 100, textAlignVertical: 'top', marginBottom: 10 },
    
    checkboxContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 10 },
    checkbox: { backgroundColor: 'transparent', borderWidth: 0, padding: 0 },
    checkboxText: { fontSize: 14, color: '#333' },
  });
