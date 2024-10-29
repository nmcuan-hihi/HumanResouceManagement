import {
    getDatabase,
    get,
    child,
    ref,
    set,
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";

const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage

export async function writeInfoCCCD(employeeId, imgFront, imgBack) {
    try {
        // Tạo tham chiếu tới nơi lưu trữ hình ảnh
        const frontImageRef = storageRef(storage, `cccd/${employeeId}/front.jpg`);
        const backImageRef = storageRef(storage, `cccd/${employeeId}/back.jpg`);

        // Tải lên hình ảnh mặt trước
        const frontBlob = await (await fetch(imgFront)).blob();
        await uploadBytes(frontImageRef, frontBlob);

        // Tải lên hình ảnh mặt sau
        const backBlob = await (await fetch(imgBack)).blob();
        await uploadBytes(backImageRef, backBlob);

        // Lấy URL hình ảnh
        const frontImageURL = await getDownloadURL(frontImageRef);
        const backImageURL = await getDownloadURL(backImageRef);

        // Ghi dữ liệu vào Realtime Database
        await set(ref(database, `cccd/${employeeId}`), {
            frontImage: frontImageURL,
            backImage: backImageURL,
        });

        console.log("Thông tin CCCD đã được lưu thành công.");
    } catch (error) {
        console.error("Lỗi khi thêm ảnh CCCD:", error);
    }
}

export async function readInfoCCCD(employeeId) {
    try {
        // Tạo tham chiếu đến dữ liệu CCCD của nhân viên
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `cccd/${employeeId}`));

        if (snapshot.exists()) {
            const data = snapshot.val();
            const frontImage = data.frontImage;
            const backImage = data.backImage;

            console.log("Thông tin CCCD đã được đọc thành công:", data);
            return {
                frontImage,
                backImage,
            };
        } else {
            console.log("Không tìm thấy dữ liệu cho employeeId:", employeeId);
            return null; 
        }
    } catch (error) {
        console.error("Lỗi khi đọc thông tin CCCD:", error);
        throw error; 
    }
}
