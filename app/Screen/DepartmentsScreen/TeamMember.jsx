import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import BackNav from '../../Compoment/BackNav';

export default function TeamMembersScreen({ navigation }) {

    const handlePress = () => {
        navigation.navigate('AddMember');
    };
    const handlePress1 = () => {
        navigation.navigate('EmployeeDetail');
    };
    const teamMembers = [
        { id: 'NV001', name: 'Nguyễn Minh Quân', department: 'Phòng IT' },
        { id: 'NV002', name: 'Nguyễn Minh Quân', department: 'Phòng IT' },
        { id: 'NV003', name: 'Nguyễn Minh Quân', department: 'Phòng IT' },
        { id: 'NV004', name: 'Nguyễn Minh Quân', department: 'Phòng IT' },
        { id: 'NV005', name: 'Nguyễn Minh Quân', department: 'Phòng IT' },
        { id: 'NV006', name: 'Nguyễn Minh Quân', department: 'Phòng IT' },
        { id: 'NV007', name: 'Nguyễn Minh Quân', department: 'Phòng IT' },
        { id: 'NV008', name: 'Nguyễn Minh Quân', department: 'Phòng IT' },
    ];

    const renderMember = ({ item }) => (
        <View style={styles.memberItem}>
            
            <View style={styles.memberInfo}>
            <TouchableOpacity onPress={handlePress1} >
                <Text style={styles.memberId}>{item.id}</Text>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberDepartment}>{item.department}</Text>
                </TouchableOpacity>
            </View>
            <Image source={require("../../../assets/image/images.png")} style={styles.memberImage} />
           
        </View>
    );

    return (

        <><BackNav navigation={navigation} name={"Team Member"} btn={teamMembers.length} />

            <View style={styles.container}>
                <FlatList
                    data={teamMembers}
                    renderItem={renderMember}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer} />
                <TouchableOpacity style={styles.fab} onPress={handlePress}>
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            </View></>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 8,
        margin: 10,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        padding: 0, // Đặt padding bằng 0
        marginTop: -10, // Kéo FlatList lên gần hơn
    },
    memberItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        alignItems: 'center',
    },
    memberInfo: {
        flex: 1,
    },
    memberId: {
        fontWeight: 'bold',
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    memberDepartment: {
        color: 'gray',
    },
    memberImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    fabIcon: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
