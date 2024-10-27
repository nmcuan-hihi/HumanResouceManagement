import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import BackNav from "../../Compoment/BackNav";

export default function CccdScreen({ navigation }) {
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);

    const pickImage = async (setImage) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Đảm bảo BackNav luôn nằm trên cùng */}
            <View style={styles.navContainer}>
                <BackNav
                    navigation={navigation}
                    name={"Thông Tin CCCD"}
                    btn={"Lưu"}
                    onEditPress={null}
                />
            </View>

            {/* Nội dung chính cuộn được */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.label}>Số CCCD</Text>
                <Text style={styles.input}>1324</Text>

                <Text style={{marginBottom:10}}>Nhấp vào để chọn ảnh</Text>
                <TouchableOpacity
                    style={styles.uploadContainer}
                    onPress={() => pickImage(setFrontImage)}
                >
                    {frontImage ? (
                        <Image source={{ uri: frontImage }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.plus}>+</Text>
                            <Text style={styles.text}>Mặt trước</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.uploadContainer}
                    onPress={() => pickImage(setBackImage)}
                >
                    {backImage ? (
                        <Image source={{ uri: backImage }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.plus}>+</Text>
                            <Text style={styles.text}>Mặt sau</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    navContainer: {
        height: 60, // Điều chỉnh chiều cao BackNav nếu cần
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40, // Tạo khoảng trống bên dưới
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
