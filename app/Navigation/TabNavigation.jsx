import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

// Import các màn hình
import TestScreen from "../Screen/FolderTest/TestScreen";
import HomeScreen from "../Screen/HomeScreen/HomeScreen";
import UserProfileScreen from "../Screen/ProfileSreen/UserProfileScreen";
import NotificeScreen from "../Screen/NotificeScreen/NotificeScreen";
import HomeScreenGD from "../Screen/HomeScreen/HomeScreenGD";
import QuanLyMucLuong from "../Screen/QuanLyLuong/QuanLyMucLuong";
import ChammCong from "../Screen/MarkAttendaceScreen/MarkAttendace";
import EmployeeScreen from "../Screen/HomeScreen/MangageEmployeeScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigation({ route }) {
  const { employee } = route.params || {};
  const role = employee?.chucvuId; // Kiểm tra role từ params

  // Các tab dùng chung cho mọi role
  const CommonTabs = () => (
    <>
      <Tab.Screen
        name="Notifications"
        component={NotificeScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 15, marginTop: -7 }}>
              Notifications
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bell" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        initialParams={{ employee }}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 15, marginTop: -7 }}>Profile</Text>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </>
  );

  // Tab riêng theo vai trò
  const RoleSpecificTabs = () => {
    if (role === "TP" && employee?.phongbanId === "KT") {
      return (
        <Tab.Screen
          name="SalaryManagement"
          component={ChammCong}
          initialParams={{ employee }}
          options={{
            tabBarLabel: "Salary",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="money" size={24} color={color} />
            ),
          }}
        />
      );
    }
    else if (role === "TP" && employee?.phongbanId === "NS") {
      return (
        <Tab.Screen
          name="SalaryManagement"
          component={EmployeeScreen}
          initialParams={{ employee }}
          options={{
            tabBarLabel: "Nhân Sự",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="money" size={24} color={color} />
            ),
          }}
        />
      );
    }
    else if (role === "NV") {
      return (
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ employee }}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={24} color={color} />
            ),
          }}
        />
      );
    } else if (role === "GD") {
      return (
        <Tab.Screen
          name="Dashboard"
          component={HomeScreenGD}
          initialParams={{ employee }}
          options={{
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="dashboard" size={24} color={color} />
            ),
          }}
        />
      );
    } else if (role === "NS") {
      return (
        <Tab.Screen
          name="Employees"
          component={EmployeeScreen}
          initialParams={{ employee }}
          options={{
            tabBarLabel: "Employees",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="users" size={24} color={color} />
            ),
          }}
        />
      );
    } else {
      return (
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ employee }}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={24} color={color} />
            ),
          }}
        />
      );
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "black",
      }}
    >
      {RoleSpecificTabs()}
      {CommonTabs()}
    </Tab.Navigator>
  );
}
