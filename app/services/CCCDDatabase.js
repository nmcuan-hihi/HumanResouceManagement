import { getDatabase, get, ref, set, child } from "firebase/database";
import { app } from "../config/firebaseconfig";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { store } from "../redux/store"; // Import Redux store to access idCty

const database = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Function to upload CCCD images and save URLs to Realtime Database
export async function writeInfoCCCD(employeeId, imgFront, imgBack) {
    try {
        const state = store.getState();
        const idCty = state.congTy.idCty; // Get idCty from Redux store

        const frontImageRef = storageRef(storage, `${idCty}/cccd/${employeeId}/front.jpg`);
        const backImageRef = storageRef(storage, `${idCty}/cccd/${employeeId}/back.jpg`);

        // Upload front image
        const frontBlob = await (await fetch(imgFront)).blob();
        await uploadBytes(frontImageRef, frontBlob);

        // Upload back image
        const backBlob = await (await fetch(imgBack)).blob();
        await uploadBytes(backImageRef, backBlob);

        // Get URLs for both images
        const frontImageURL = await getDownloadURL(frontImageRef);
        const backImageURL = await getDownloadURL(backImageRef);

        // Save image URLs in Realtime Database under the company id
        await set(ref(database, `${idCty}/cccd/${employeeId}`), {
            frontImage: frontImageURL,
            backImage: backImageURL,
        });

        console.log("CCCD information has been successfully saved.");
    } catch (error) {
        console.error("Error saving CCCD images:", error);
    }
}

// Function to read CCCD image URLs from Realtime Database
export async function readInfoCCCD(employeeId) {
    try {
        const state = store.getState();
        const idCty = state.congTy.idCty; // Get idCty from Redux store

        const snapshot = await get(child(ref(database), `${idCty}/cccd/${employeeId}`));

        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("Successfully retrieved CCCD information:", data);
            return data;
        } else {
            console.log("No data found for employeeId:", employeeId);
            return null;
        }
    } catch (error) {
        console.error("Error reading CCCD information:", error);
        throw error;
    }
}
