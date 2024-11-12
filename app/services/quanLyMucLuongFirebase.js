import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    query,
    where,
  } from "firebase/firestore";
  import { app } from "../config/firebaseconfig"; // Ensure firebase is configured correctly
  import dayjs from "dayjs"; // For easy date handling
  
  const firestore = getFirestore(app);
  
  export async function getCongThucLuong() {
    try {
      const querySnapshot = await getDocs(collection(firestore, "congthucluong"));
  
      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0]; // Get the first document
        return firstDoc.data();
      } else {
        console.log("Collection is empty!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
  export async function updateCongThucLuong(newData) {
    try {
      const docRef = doc(firestore, "congthucluong", "ctl1");
      await updateDoc(docRef, newData);
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
  
  export async function getAllChamCongDetails() {
    try {
      const chamCongCollection = collection(firestore, "chitietchamcong");
      const querySnapshot = await getDocs(chamCongCollection);
  
      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
  
        // Convert 'month' field from Timestamp to desired format
        let formattedMonth = null;
        if (docData.month) {
          const monthDate = docData.month.toDate(); // Convert Timestamp to Date
          formattedMonth = dayjs(monthDate).format("YYYY-MM-DD"); // Format date
        }
  
        return {
          id: doc.id, // Document ID
          ...docData,
          month: formattedMonth,
        };
      });
  
      return data;
    } catch (error) {
      console.error("Error fetching data from collection:", error);
      throw error;
    }
  }
  
  export async function getChamCongDetailsByMonth(year, month) {
    try {
      // Reference to the 'chitietchamcong' collection
      const chamCongCollection = collection(firestore, "chitietchamcong");
  
      // Create start and end timestamps for the target month
      const startOfMonth = dayjs(`${year}-${month + 1}-01`).toDate();
      const endOfMonth = dayjs(`${year}-${month + 2}-01`).toDate();
  
      // Query to get documents with 'month' within the time range
      const monthQuery = query(
        chamCongCollection,
        where("month", ">=", startOfMonth),
        where("month", "<", endOfMonth)
      );
  
      // Fetch documents matching the query
      const querySnapshot = await getDocs(monthQuery);
  
      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
  
        // Convert 'month' field from Timestamp to Date and format
        const monthDate = docData.month.toDate();
        const formattedMonth = dayjs(monthDate).format("YYYY-MM-DD");
  
        return {
          id: doc.id,
          ...docData,
          month: formattedMonth,
        };
      });
  
      return data;
    } catch (error) {
      console.error("Error fetching data from collection:", error);
      throw error;
    }
  }
  