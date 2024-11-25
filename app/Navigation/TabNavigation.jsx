import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Badge } from "react-native-elements";
import { ref, onValue } from "firebase/database";
// Import các màn hình
import TestScreen from "../Screen/FolderTest/TestScreen";
import HomeScreen from "../Screen/HomeScreen/HomeScreen";
import UserProfileScreen from "../Screen/ProfileSreen/UserProfileScreen";
import NotificeScreen from "../Screen/NotificeScreen/NotificeScreen";
import HomeScreenGD from "../Screen/HomeScreen/HomeScreenGD";
import QuanLyMucLuong from "../Screen/QuanLyLuong/QuanLyMucLuong";
import ChammCong from "../Screen/MarkAttendaceScreen/MarkAttendace";
import EmployeeScreen from "../Screen/HomeScreen/MangageEmployeeScreen";
import HomeMessenger from "../Screen/MessengerScreen/HomeMessenger";
import { listenForNotifications } from "../services/thongBaoFirebase";
import { database } from "../config/firebaseconfig";
import { store } from "../redux/store";

const Tab = createBottomTabNavigator();

export default function TabNavigation({ route }) {
  const { employee } = route.params || {};
  const role = employee?.chucvuId; // Kiểm tra role từ params
  const userID = employee.employeeId;
  const [unreadCount, setUnreadCount] = useState(0);

  const [unreadNotifications, setUnreadNotifications] = useState(0);
  // Lấy idCty từ store
  const state = store.getState();
  const idCty = state.congTy.idCty;

  
  useEffect(() => {
    const callback = (danhSachThongBao) => {
      const count = danhSachThongBao.filter(
        (thongBao) => !thongBao.trangThai
      ).length;

      setUnreadNotifications(count);
    };

    listenForNotifications(employee.employeeId, callback);

    return () => {};
  }, [employee.employeeId]);

  useEffect(() => {
    // Set up a listener for changes in the "chats" node
    const chatsRef = ref(database, `${idCty}/chats`);
  
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      if (snapshot.exists()) {
        let count = 0;
        snapshot.forEach((childSnapshot) => {
          const chatData = childSnapshot.val();
          const { lastSend, status, participants } = chatData;
  
          if (participants && participants.includes(userID)) {
            // Increment unread count if the message is unread and not sent by the current user
            if (lastSend !== userID && status === "0") {
              count += 1;
            }
          }
        });
        setUnreadCount(count); // Update state with the new unread count
      } else {
        setUnreadCount(0); // No messages found
      }
    });
  
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userID, idCty]);
  

  const IconWithBadge = ({ name, badgeCount, color, size, iconType }) => {
    const IconComponent =
      iconType === "MaterialIcons" ? MaterialIcons : AntDesign;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <IconComponent name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <Badge
            value={badgeCount}
            status="error"
            containerStyle={{ position: "absolute", top: -4, right: -4 }}
          />
        )}
      </View>
    );
  };

  // Các tab dùng chung cho mọi role
  const CommonTabs = () => (
    <>
      <Tab.Screen
        name="Notifications"
        component={NotificeScreen}
        initialParams={{ employee }}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginTop: -7 }}>
              Notifications
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <IconWithBadge
              name="notifications"
              size={24}
              color={color}
              badgeCount={unreadNotifications}
              iconType="MaterialIcons"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Mes"
        component={HomeMessenger}
        initialParams={{ employee }}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginTop: -7 }}>
              Messenger
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <IconWithBadge
              name="message1"
              size={24}
              color={color}
              badgeCount={unreadCount}
              iconType="AntDesign"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        initialParams={{ employee }}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginTop: -7 }}>Profile</Text>
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
     if (role === "TP" && employee?.phongbanId === "NS") {
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
    } else if (role === "TP" ) {
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
    } else if (role === "NV") {
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
