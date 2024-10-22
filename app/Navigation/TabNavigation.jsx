import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Import các màn hình
import TestScreen from '../Screen/FolderTest/TestScreen';
import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import UserProfileScreen from '../Screen/ProfileSreen/UserProfileScreen';
import NotificeScreen from '../Screen/NotificeScreen/NotificeScreen';
import HomeScreenGD from '../Screen/HomeScreen/HomeScreenGD';
import QuanLyMucLuong from '../Screen/QuanLyLuong/QuanLyMucLuong';
import ChammCong from '../Screen/MarkAttendaceScreen/MarkAttendace';
import EmployeeScreen from '../Screen/HomeScreen/MangageEmployeeScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigation({ route }) {
    const { role } = route.params || {}; // Lấy role từ params
    const { keyID } = route.params || {}; // Lấy userlogin từ params

    // Các tab dùng chung cho mọi role
    const CommonTabs = () => (
        <>
            <Tab.Screen 
                name="Notifications" 
                component={NotificeScreen} 
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{ color, fontSize: 15, marginTop: -7 }}>Notifications</Text>
                    ),
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="bell" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={UserProfileScreen} 
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

    // Cấu hình tab riêng dựa trên role
    const RoleSpecificTabs = () => {
        switch (role) {
            case 'NV':
                return (
                    <Tab.Screen 
                        name="Home" 
                        component={HomeScreen} 
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color }) => (
                                <FontAwesome name="home" size={24} color={color} />
                            ),
                        }}
                    />
                );
            case 'GD':
                return (
                    <Tab.Screen 
                        name="Dashboard" 
                        component={HomeScreenGD} 
                        options={{
                            tabBarLabel: 'Dashboard',
                            tabBarIcon: ({ color }) => (
                                <FontAwesome name="dashboard" size={24} color={color} />
                            ),
                        }}
                    />
                );
            case 'KT':
                return (
                    <Tab.Screen 
                        name="SalaryManagement" 
                        initialParams={{ keyID }}
                        component={ChammCong} 
                        options={{
                            tabBarLabel: 'Salary',
                            tabBarIcon: ({ color }) => (
                                <FontAwesome name="money" size={24} color={color} />
                            ),
                        }}
                    />
                );
            case 'NS':
                return (
                    <Tab.Screen 
                        name="Employees" 
                        component={EmployeeScreen} 
                        options={{
                            tabBarLabel: 'Employees',
                            tabBarIcon: ({ color }) => (
                                <FontAwesome name="users" size={24} color={color} />
                            ),
                        }}
                    />
                );
            default:
                return (
                    <Tab.Screen 
                        name="Home" 
                        component={HomeScreen} 
                        options={{
                            tabBarLabel: 'Home',
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
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'black',
            }}
        >
            {RoleSpecificTabs()}
            {CommonTabs()}
        </Tab.Navigator>
    );
}
