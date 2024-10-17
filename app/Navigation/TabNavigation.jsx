// app/Navigation/TabNavigation.js
import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import TestScreen from '../Screen/FolderTest/TestScreen';
import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import UserProfileScreen from '../Screen/ProfileSreen/UserProfileScreen';
import NotificeScreen from '../Screen/NotificeScreen/NotificeScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'blue', // Đổi màu khi được chọn
            tabBarInactiveTintColor: 'black',
        }}>
           
            <Tab.Screen 
                name='Test' 
                component={TestScreen}
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{ color: color, fontSize: 15, marginTop: -7 }}>Home</Text>
                    ),
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="home" size={24} color={color} />
                    )
                }} 
            />
            <Tab.Screen 
                name='Notifications' // Đổi tên cho tab thứ hai
                component={NotificeScreen} // Chỉ định component cho tab thứ hai
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{ color: color, fontSize: 15, marginTop: -7 }}>Notifications</Text>
                    ),
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="bell" size={24} color={color} /> // Biểu tượng thông báo
                    )
                }} 
            />
            <Tab.Screen 
                name='Profile' // Đổi tên cho tab thứ ba
                component={UserProfileScreen} // Chỉ định component cho tab thứ ba
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{ color: color, fontSize: 15, marginTop: -7 }}>Profile</Text>
                    ),
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="user" size={24} color={color} /> // Biểu tượng người dùng
                    )
                }} 
            />
        </Tab.Navigator>
    );
}
