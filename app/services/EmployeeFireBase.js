import {
    getDatabase,
    ref,
    set,
    get,
    child,
    update,
    remove,
  } from "firebase/database";
  import { app } from "../config/firebaseconfig";
  import { firestore } from '../config/firebaseconfig';
  
  import { initializeApp } from "firebase/app";
  import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";
  
  import { collection, query, orderBy, limit, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
  
  const database = getDatabase(app);
  const storage = getStorage(app); // Khởi tạo Firebase Storage
  
  
  
  export const addEmployeeFireStore = async (employee,profileImage) => {
    try {
      employee.employeeId = await getNewEmployeeId();
      employee.matKhau = employee.employeeId; 
      
      // Tạo tham chiếu tới nơi lưu trữ hình ảnh
    const imageRef = storageRef(
        storage,
        `employee/${employee.employeeId}.jpg`
      );
  
      // Tải lên hình ảnh
      const response = await fetch(profileImage);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
  
      // Lấy URL hình ảnh
      const imageUrl = await getDownloadURL(imageRef);
  
      // Cập nhật imageUrl vào employeeData
      const emp = { ...employee, imageUrl };
  
      // Thêm nhân viên vào Firestore với employeeId làm ID
      await setDoc(doc(firestore, "employees", employee.employeeId), emp);
      console.log("Employee successfully added to Firestore!");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };
  
  // Hàm đọc danh sách nhân viên từ Firestore
export async function readEmployeesFireStore() {
    try {
      const employeeCollection = collection(firestore, "employees"); 
      const employeeSnapshot = await getDocs(employeeCollection); 
  
      if (!employeeSnapshot.empty) {
        const employees = employeeSnapshot.docs.map(doc => ({
          id: doc.id, // Thêm id của tài liệu
          ...doc.data(), // Thêm dữ liệu của tài liệu
        }));
  
        return employees; // Trả về danh sách nhân viên
      } else {
        console.log("No data available");
        return null; // Không có dữ liệu
      }
    } catch (error) {
      console.error("Error reading employees:", error);
      throw error; // Ném lỗi nếu có
    }
  }

// Hàm lấy thông tin nhân viên theo ID
export async function getEmployeeById(employeeId) {
    try {
      const employeeDocRef = doc(firestore, "employees", employeeId); // Tham chiếu đến tài liệu nhân viên theo ID
      const employeeDoc = await getDoc(employeeDocRef); // Lấy tài liệu
  
      if (employeeDoc.exists()) {
        return {
          id: employeeDoc.id, 
          ...employeeDoc.data(), 
        };
      } else {
        console.log("No such employee!");
        return null; // Không tìm thấy nhân viên
      }
    } catch (error) {
      console.error("Error getting employee by ID:", error);
      throw error; // Ném lỗi nếu có
    }
  }



  // Hàm lấy mã nhân viên mới với +1
export async function getNewEmployeeId() {
    try {
      const q = query(
        collection(firestore, "employees"),
        orderBy("employeeId", "desc"), // Sắp xếp theo mã giảm dần
        limit(1) // Lấy nhân viên có mã lớn nhất
      );
  
      const querySnapshot = await getDocs(q);
  
      let newId;
      if (!querySnapshot.empty) {
        const latestEmployee = querySnapshot.docs[0].data();
        const latestId = parseInt(latestEmployee.employeeId.slice(2)); 
        newId = `NV${(latestId + 1).toString().padStart(3, '0')}`;
      } else {
        // Trường hợp chưa có nhân viên nào
        newId = "NV000";
      }
      return newId;
    } catch (error) {
      console.error("Error fetching latest employee ID:", error);
      throw error;
    }
  }