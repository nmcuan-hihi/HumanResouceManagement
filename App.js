import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/Screen/LoginSreen/LoginScreen';
import HomeScreen from './app/Screen/HomeScreen/HomeScreen';

import ChamCong from './app/Screen/MarkAttendaceScreen/MarkAttendace';
import ChamCongNV from './app/Screen/MarkAttendaceScreen/MarkAttendaceNV';
import EmployeeScreen from './app/Screen/HomeScreen/MangageEmployeeScreen';
import ListEmployee from './app/Screen/EmployeeScreen/ListEmployee';
import EmployeeDetailScreen from './app/Screen/EmployeeScreen/EmployeeDetail';
import EmployeeEditScreen from './app/Screen/EmployeeScreen/EditEmployee';
import AddEmployeeScreen from './app/Screen/EmployeeScreen/AddEmployee';

import PhongBanScreen from './app/Screen/DepartmentsScreen/DepartmentsScreen';
import DetailPB from './app/Screen/DepartmentsScreen/DetailPhongBan';
import TeamMembersScreen from './app/Screen/DepartmentsScreen/TeamMember';
import AddMember from './app/Screen/DepartmentsScreen/AddMemberCode';
import { useFonts } from 'expo-font';
import TestScreen from './app/Screen/FolderTest/TestScreen';
import TabNavigation from './app/Navigation/TabNavigation';
import DanhSachBangCap from './app/Screen/BangCapScreen/DanhSachBangCap';
import DetailBangCap from './app/Screen/BangCapScreen/DetailBangCap';
const Stack = createStackNavigator();

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardGD from './app/Compoment/DashboardGD';
import HomeScreenGD from './app/Screen/HomeScreen/HomeScreenGD';
import NotificeScreen from './app/Screen/NotificeScreen/NotificeScreen';
import QuanLyMucLuong from './app/Screen/QuanLyLuong/QuanLyMucLuong';
import DanhSachSkill from './app/Screen/BangCapScreen/Skill';
import DetailSkill from './app/Screen/BangCapScreen/DetailSkill';


import EditMatKhau from './app/Screen/ProfileSreen/EditMatKhau';
import ThemBangCapNV from './app/Screen/BangCapScreen/ThemBangCapNV';
import ThemSkillNV from './app/Screen/BangCapScreen/ThemSkillNV';
import CccdScreen from './app/Screen/EmployeeScreen/CccdScreen';



import ListChucVu from './app/Screen/ChucVuScreen/ChucVu';
import ChucVuDetail from './app/Screen/ChucVuScreen/ChucVuDetail';
import AddChucVu from './app/Screen/ChucVuScreen/AddChucVu';
import DangKyNghiScreen from './app/Screen/NghiPhepScreen/DangKyNghiScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'FBold': require('./assets/fonts/JosefinSans-Bold.ttf'),
    'FMedium': require('./assets/fonts/JosefinSans-Medium.ttf'),
    'FRegular': require('./assets/fonts/JosefinSans-Regular.ttf'),
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DangKyNghi">
        <Stack.Screen name="DangKyNghi" component={DangKyNghiScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserTabNav" component={TabNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreenGD" component={HomeScreenGD} options={{ headerShown: false }} />

        <Stack.Screen name="DanhSachBangCap" component={DanhSachBangCap} options={{ headerShown: false }} />
        <Stack.Screen name="DetailBangCap" component={DetailBangCap} options={{ headerShown: false }} />

        <Stack.Screen name="QuanLyMucLuong" component={QuanLyMucLuong} options={{ headerShown: false }} />
 

        <Stack.Screen name="ChamCong" component={ChamCong} options={{ headerShown: false }} />
        <Stack.Screen name="ChamCongNV" component={ChamCongNV} options={{ headerShown: false }} />
        <Stack.Screen name="EmployeeScreen" component={EmployeeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ListChucVu" component={ListChucVu} options={{ headerShown: false }} />
        <Stack.Screen name="ChucVuDetail" component={ChucVuDetail} options={{ headerShown: false }} />
        <Stack.Screen name="AddChucVu" component={AddChucVu} options={{ headerShown: false }} />
       
        <Stack.Screen name="ListEmployee" component={ListEmployee} options={{ headerShown: false }} />
        <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditEmployee" component={EmployeeEditScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PhongBanScreen" component={PhongBanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotificeScreen" component={NotificeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddMember" component={AddMember} options={{ headerShown: false }} />
        <Stack.Screen name="DetailPB" component={DetailPB} options={{ headerShown: false }} />


        <Stack.Screen name="Skill" component={DanhSachSkill} options={{ headerShown: false }} />
        <Stack.Screen name="SkillDetail" component={DetailSkill} options={{ headerShown: false }} />
        <Stack.Screen name="cccd" component={CccdScreen} options={{ headerShown: false }} />


        <Stack.Screen name="EditMatKhau" component={EditMatKhau} options={{ headerShown: false }} />
        <Stack.Screen name="ThemBangCapNV" component={ThemBangCapNV} options={{ headerShown: false }} />
        <Stack.Screen name="ThemSkillNV" component={ThemSkillNV} options={{ headerShown: false }} />

      </Stack.Navigator>  
    </NavigationContainer>
    <StatusBar style="auto" />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
  },
});
