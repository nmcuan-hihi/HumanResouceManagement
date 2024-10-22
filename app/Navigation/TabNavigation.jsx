import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Import screens
import TestScreen from '../Screen/FolderTest/TestScreen';
import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import UserProfileScreen from '../Screen/ProfileSreen/UserProfileScreen';
import NotificeScreen from '../Screen/NotificeScreen/NotificeScreen';
import HomeScreenGD from '../Screen/HomeScreen/HomeScreenGD';
import ChammCong from '../Screen/MarkAttendaceScreen/MarkAttendace';
import EmployeeScreen from '../Screen/HomeScreen/MangageEmployeeScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigation({ route }) {
    const { role } = route.params || {}; // Get role from params

    // Common tabs for all roles
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
                initialParams={{ manv: route.params.employee ? route.params.employee.id : null }} // Pass employee ID
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

    // Role-specific tab configuration
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
