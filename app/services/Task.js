import {
  getDatabase,
  ref,
  set,
  get ,
  onValue ,
  update,
  remove, query, orderByChild, equalTo,
  push
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import { getStorage } from "firebase/storage";
import { store } from "../redux/store"; // Import Redux store to access idCty

const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage

// Lấy idCty từ Redux store
const getIdCty = () => {
  const state = store.getState();
  return state.congTy.idCty; // Lấy idCty từ state.congTy
};


// Tạo thông báo mới cho nhiệm vụ
export async function taoTaskDataBase(nhiemvu) {
  const idCty = getIdCty(); // Lấy idCty từ Redux
  try {
    const notificationRef = ref(database, `${idCty}/nhiemvu`); // Đặt idCty vào đường dẫn

    // Tạo thông báo mới
    const newNotificationRef = push(notificationRef);

    // Dữ liệu thông báo
    const notificationData = {
      manhiemvu: newNotificationRef.key,
      ...nhiemvu, // Giữ nguyên các dữ liệu khác từ nhiệm vụ
    };

    // Lưu thông báo vào Realtime Database
    await set(newNotificationRef, notificationData);

    console.log("Thông báo đã được tạo thành công:", notificationData);
    return notificationData;
  } catch (error) {
    console.error("Lỗi khi tạo thông báo:", error);
    throw error;
  }
}
  // export const getAssignedTask = async (employeeId, manhiemvu) => {
  //   try {
  //     if (!employeeId || !manhiemvu) {
  //       console.error("Dữ liệu đầu vào không hợp lệ?");
  //       return null;
  //     }

  //     const idCty = getIdCty();
  //     const taskRef = ref(database,`${idCty}/nhiemvuphancong`);

  //     const snapshot = await get(taskRef);
  //     if (!snapshot.exists()) {
  //       return null;
  //     }

  //     const tasks = snapshot.val();
  //     const taskKey = Object.keys(tasks).find(
  //       key => tasks[key].employeeId === employeeId && tasks[key].manhiemvu === manhiemvu
  //     );

  //     if (!taskKey) {
  //       return null;
  //     }

  //     return tasks[taskKey];

  //   } catch (error) {
  //     console.error("Lỗi khi lấy thông tin nhiệm vụ:", error);
  //     throw error;
  //   }
  // };

  export const getAssignedTask = (employeeId, manhiemvu) => {
    return new Promise((resolve, reject) => {
      try {
        if (!employeeId || !manhiemvu) {
          console.error("Dữ liệu đầu vào không hợp lệ?");
          reject("Dữ liệu đầu vào không hợp lệ");
          return;
        }
  
        const idCty = getIdCty(); // ID công ty từ Redux hoặc nguồn khác
        const taskRef = ref(database, `${idCty}/nhiemvuphancong`);
  
        // Đăng ký lắng nghe sự thay đổi
        onValue(
          taskRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const tasks = snapshot.val();
              // Tìm nhiệm vụ phân công dựa trên employeeId và manhiemvu
              const task = Object.values(tasks).find(
                (task) => task.employeeId === employeeId && task.manhiemvu === manhiemvu
              );
  
              // Trả về nhiệm vụ tìm thấy hoặc null nếu không tìm thấy
              resolve(task || null);
            } else {
              resolve(null); // Không có nhiệm vụ nào
            }
          },
          (error) => {
            console.error("Lỗi khi lắng nghe nhiệm vụ phân công:", error);
            reject(error);
          }
        );
      } catch (error) {
        console.error("Lỗi khi lắng nghe nhiệm vụ phân công:", error);
        reject(error);
      }
    });
  };
  

export const updateAssignedTaskStatus = async (employeeId, manhiemvu, trangthai) => {
  try {
    // Validate đầu vào
    if (!employeeId || !manhiemvu || typeof trangthai !== "boolean") {
      console.error("Dữ liệu đầu vào không hợp lệ");
      return false;
    }
    const idCty = getIdCty();
    // Tham chiếu đến node nhiemvuphancong
    const taskRef = ref(database, `${idCty}/nhiemvuphancong`);
    // Lấy dữ liệu hiện tại
    const snapshot = await get(taskRef);
    if (!snapshot.exists()) {
      console.error("Không tìm thấy dữ liệu nhiệm vụ phân công");
      return false;
    }
    const tasks = snapshot.val();
    // Tìm key của task cần update
    const taskKey = Object.keys(tasks).find(
      key => tasks[key].employeeId === employeeId && tasks[key].manhiemvu === manhiemvu
    );
    if (!taskKey) {
      console.error("Không tìm thấy nhiệm vụ phù hợp");
      return false;
    }
    // Cập nhật trạng thái
    const taskUpdateRef = ref(database, `${idCty}/nhiemvuphancong/${taskKey}`);
    await update(taskUpdateRef, {
      trangthai: trangthai,
    });
    console.log(`Đã cập nhật trạng thái nhiệm vụ ${manhiemvu} thành ${trangthai}`);
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái nhiệm vụ:", error);
    throw error;
  }
};
export function layTatCaNhiemVu() {
  return new Promise((resolve, reject) => {
    const idCty = getIdCty(); // Get company ID
    const tasksRef = ref(database, `${idCty}/nhiemvu`);

    // Using Firebase's onValue to listen for changes in the data
    onValue(
      tasksRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const allTasks = Object.values(snapshot.val());
          resolve(allTasks); // Resolve the promise with the tasks data
        } else {
          resolve([]); // No tasks available, resolve with an empty array
        }
      },
      (error) => {
        console.error("Lỗi khi lắng nghe nhiệm vụ:", error);
        reject(error); // Reject the promise if there's an error
      }
    );
  });
}




export function layNhiemVuById(manhiemvu, callback) {
  const idCty = getIdCty();
  const taskRef = ref(database, `${idCty}/nhiemvu/${manhiemvu}`);

  onValue(taskRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null); // Không tìm thấy nhiệm vụ
    }
  }, (error) => {
    console.error("Lỗi khi lắng nghe nhiệm vụ:", error);
  });
}


export function listenForTask(employeeId, callback) {
  const idCty = getIdCty();
  const thongBaonhanVienRef = ref(database, `${idCty}/nhiemvuphancong`); // Thêm idCty vào tham chiếu

  // Đăng ký listener trên ref này
  onValue(thongBaonhanVienRef, (snapshot) => {
    if (snapshot.exists()) {
      const danhSachThongBao = [];
      snapshot.forEach((childSnapshot) => {
        const thongBao = childSnapshot.val();
        // Kiểm tra nếu employeeId khớp
        if (thongBao.employeeId === employeeId) {
          danhSachThongBao.push(thongBao);
        }
      });
      // Gọi callback với danh sách thông báo
      callback(danhSachThongBao);
    } else {
      console.log("Không có dữ liệu nào.");
      callback([]);
    }
  });
}
// Thêm thông báo cho nhân viên
export async function themTaskPhanCong(employeeId, manhiemvu) {
  const idCty = getIdCty(); // Lấy idCty từ Redux
  try {
    // Dữ liệu thông báo cho nhân viên
    const notificationNhanVienData = {
      manhiemvu,
      employeeId,
      trangthai: false, // Trạng thái mặc định của nhiệm vụ là chưa hoàn thành
    };

    // Tạo key bằng employeeId-maThongBao
    const newNotificationKey = `${employeeId}-${manhiemvu}`;

    // Lưu thông báo cho nhân viên vào Realtime Database với key đã chỉ định
    await set(
      ref(database, `${idCty}/nhiemvuphancong/${newNotificationKey}`), // Thêm idCty vào tham chiếu
      notificationNhanVienData
    );

    console.log("Thông báo cho nhân viên đã được tạo thành công:", notificationNhanVienData);
    return notificationNhanVienData;
  } catch (error) {
    console.error("Lỗi khi thêm thông báo cho nhân viên:", error);
    throw error;
  }
}
// hàm liệt kê nhiệm vụ nhân viên 
// export const getTaskStatistics = async (employeeId) => {
//   try {
//     const tasks = await getEmployeeAssignedTasks(employeeId);
    
//     const statistics = {
//       totalTasks: tasks.length,
//       completedTasks: tasks.filter(task => task.trangthai).length,
//       pendingTasks: tasks.filter(task => !task.trangthai).length,
//       completionRate: tasks.length > 0 
//         ? ((tasks.filter(task => task.trangthai).length / tasks.length) * 100).toFixed(2)
//         : 0
//     };

//     return statistics;
//   } catch (error) {
//     console.error("Lỗi khi lấy thống kê nhiệm vụ:", error);
//     throw error;
//   }
  
// };


// export async function layTatCaNhiemVuPhanCongByMaNV(manhiemvu) {
//   const idCty = getIdCty(); // ID công ty từ Redux hoặc nguồn khác
//   try {
//     const tasksRef = ref(database, `${idCty}/nhiemvuphancong`); // Tham chiếu đến nhánh "nhiemvuphancong"
//     const snapshot = await get(tasksRef);

//     if (snapshot.exists()) {
//       const allTasks = snapshot.val();
//       // Lọc nhiệm vụ phân công theo manhiemvu
//       const filteredTasks = Object.values(allTasks).filter(
//         (task) => task.manhiemvu === manhiemvu
//       );
//       return filteredTasks;
//     } else {
//       return []; // Không có nhiệm vụ phân công nào
//     }
//   } catch (error) {
//     console.error("Error fetching assigned tasks:", error);
//     throw error;
//   }
// }


export function layTatCaNhiemVuPhanCongByMaNV(manhiemvu, callback) {
  const idCty = getIdCty(); // ID công ty từ Redux hoặc nguồn khác
  const tasksRef = ref(database, `${idCty}/nhiemvuphancong`);

  // Đăng ký lắng nghe dữ liệu
  const unsubscribe = onValue(
    tasksRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const allTasks = snapshot.val();

        // Lọc nhiệm vụ phân công theo `manhiemvu`
        const filteredTasks = Object.values(allTasks).filter(
          (task) => task.manhiemvu === manhiemvu
        );

        // Gọi hàm callback với danh sách nhiệm vụ đã lọc
        callback(filteredTasks);
      } else {
        callback([]); // Không có nhiệm vụ nào
      }
    },
    (error) => {
      console.error("Error listening for assigned tasks:", error);
    }
  );

  // Trả về hàm hủy đăng ký lắng nghe
  return () => unsubscribe();
}

export function layTatCaNhiemVuPhanCong(callback) {
  const idCty = getIdCty();
  const tasksRef = ref(database, `${idCty}/nhiemvuphancong`);

  onValue(tasksRef, (snapshot) => {
    if (snapshot.exists()) {
      const allTasks = Object.values(snapshot.val());
      callback(allTasks);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Lỗi khi lắng nghe nhiệm vụ phân công:", error);
  });
}











