import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import BackNav from "../../Compoment/BackNav";
import { writeInfoCCCD, readInfoCCCD } from '../../services/CCCDDatabase'; // Import cả hai hàm
import ViewLoading, { openModal, closeModal } from "../../Compoment/ViewLoading"; // Ensure closeModal is imported

export default function CccdScreen({ navigation, route }) {
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontImageUrl, setFrontImageUrl] = useState(null);
    const [backImageUrl, setBackImageUrl] = useState(null);
    const { cccdNumber } = route.params;

    // Hàm yêu cầu quyền truy cập thư viện ảnh
    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.');
        }
    };

    useEffect(() => {
        requestPermission(); // Yêu cầu quyền truy cập
        const fetchData = async () => {
            try {
                const data = await readInfoCCCD(cccdNumber);
                if (data) {
                    setFrontImageUrl(data.frontImage);
                    setBackImageUrl(data.backImage);
                }
            } catch (error) {
                console.log("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, [cccdNumber]);

    const pickImage = async (setImage, setImageUrl) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            setImageUrl(uri);
        }
    };

    const handleAddCccdImg = async () => {
        if (!frontImage || !backImage) {
            Alert.alert('Chưa chọn ảnh!', 'Vui lòng chọn cả hai ảnh mặt trước và mặt sau.');
            return;
        }

        try {
            openModal(); // Open the loading modal
            await writeInfoCCCD(cccdNumber, frontImage, backImage);
            Alert.alert('Thành công!', 'Thông tin CCCD đã được lưu.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Lỗi!', 'Có lỗi xảy ra khi lưu thông tin.');
            console.error(error);
        } finally {
            closeModal(); // Ensure the modal is closed after completion
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.navContainer}>
                <BackNav
                    navigation={navigation}
                    name={"Thông Tin CCCD"}
                    btn={"Lưu"}
                    onEditPress={handleAddCccdImg} 
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.label}>Số CCCD</Text>
                <Text style={styles.input}>{cccdNumber}</Text>

                <Text style={{ marginBottom: 10 }}>Nhấp vào để chọn ảnh</Text>
                <TouchableOpacity
                    style={styles.uploadContainer}
                    onPress={() => pickImage(setFrontImage, setFrontImageUrl)}
                >
                    {frontImageUrl ? (
                        <Image source={{ uri: frontImageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.plus}>+</Text>
                            <Text style={styles.text}>Mặt trước</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.uploadContainer}
                    onPress={() => pickImage(setBackImage, setBackImageUrl)}
                >
                    {backImageUrl ? (
                        <Image source={{ uri: backImageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.plus}>+</Text>
                            <Text style={styles.text}>Mặt sau</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
            <ViewLoading/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    navContainer: {
        height: 60,
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        color: "blue",
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    uploadContainer: {
        height: 200,
        borderWidth: 1,
        borderColor: "#ccc",
        borderStyle: "dashed",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    placeholder: {
        alignItems: "center",
    },
    plus: {
        fontSize: 40,
        color: "#aaa",
    },
    text: {
        fontSize: 16,
        color: "#aaa",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
});
