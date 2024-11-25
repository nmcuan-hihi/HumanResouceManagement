import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { getEmployeeById } from "../../services/EmployeeFireBase";
import { layTatCaNhiemVu, layNhiemVuById, listenForTask, layTatCaNhiemVuPhanCong, layTatCaNhiemVuPhanCongByMaNV } from "../../services/Task";

import BackNav from "../../Compoment/BackNav";


const TaskScreen = ({ route, navigation }) => {
  const { employee } = route.params || {};
  const [tasks, setTasks] = useState([]);
  const [fullTasks, setFullTasks] = useState([]);
  const [tasksNV, setTasksNV] = useState([]);
  const [fullTasksNV, setFullTasksNV] = useState([]);


  const [fullAllTasksNV, setFullAlTasksNV] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchTasks() {
      try {
        // Instead of directly using await, use the callback version of the function
        const unsubscribe = layTatCaNhiemVuPhanCongByMaNV("MN001", (tasks) => {
          console.log("Nhiệm vụ phân công:", tasks);
          // Now you can store the tasks in the state or process them
          setFullTasks(tasks);
        });
  
        // If you want to unsubscribe later
        return unsubscribe;
      } catch (error) {
        console.error("Lỗi khi lấy nhiệm vụ phân công:", error);
      }
    }
  
    fetchTasks();
  }, []);
  

  useEffect(() => {
    function fetchAllAssignedTasks() {
      // Gọi hàm layTatCaNhiemVuPhanCong và truyền callback để xử lý kết quả
      layTatCaNhiemVuPhanCong((tasks) => {
        console.log("Danh sách nhiệm vụ phân công:", tasks);
        setFullAlTasksNV(tasks); // Cập nhật state với dữ liệu đã lấy
      });
    }
  
    fetchAllAssignedTasks(); // Gọi hàm để lấy nhiệm vụ phân công
  }, []); // Chạy 1 lần khi component được mount
  



  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const employeeId = employee.employeeId;
        const tasksData = await layTatCaNhiemVu();
        setFullTasks(tasksData)
        if (tasksData) {

          // Filter tasks for the employee or their department
          const filteredTasks = tasksData.filter((task) => {
            return task.employee == employeeId
          });


          setTasks(filteredTasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [employee]);

  useEffect(() => {
    const unsubscribe = listenForTask(employee.employeeId, (newTasks) => {
      setTasksNV(newTasks);

      // Lọc danh sách thông báo từ fullTasks dựa trên manhiemvu trong newTasks
      const filteredTasks = fullTasks.filter((task) =>
        newTasks.some((newTask) => newTask.manhiemvu === task.manhiemvu)
      );
      setFullTasksNV(filteredTasks)
      console.log(filteredTasks, '-adasd21321312 dsd       dsd    312312312sda----')

      // Xử lý dữ liệu được lọc (ví dụ: cập nhật state khác nếu cần)
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [employee, fullTasks]);








  const handleTaskPress = (task, tyle) => {
    // Gọi hàm layNhiemVuById với callback
    layNhiemVuById(task.manhiemvu, (taskDetails) => {
      if (taskDetails) {
        // Nếu tìm thấy nhiệm vụ, chuyển hướng đến màn hình TaskDetail
        navigation.navigate("TaskDetail", { task: taskDetails, employee, tyle });
      } else {
        // Nếu không tìm thấy nhiệm vụ, log lỗi
        console.error("Task not found");
      }
    });
  };
  
  const handleAddTask = () => {
    navigation.navigate("AddTask", { employee });
  };

  // Check if the employee is a department head
  const isDepartmentHead = employee.chucvuId !== "NV"; // Assuming "GD" is the ID for trưởng phòng

  console.log("adsadsadsaddddd Tasks:", employee.chucvuId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackNav
          navigation={navigation}
          btn={isDepartmentHead ? "Thêm" : ""}
          name={"Nhiệm Vụ"}
          onEditPress={isDepartmentHead ? handleAddTask : null}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isDepartmentHead ? (
          tasks.length > 0 ? (
            tasks.map((task) => {
              // Lấy các nhiệm vụ phân công liên quan
              const relatedTaskNVs = fullAllTasksNV.filter(
                (nvTask) => nvTask.manhiemvu === task.manhiemvu
              );
              const relatedTaskNVsTrangThai = relatedTaskNVs.filter((nv) => {
               return nv.trangthai == true
              })

              const completionPercentage = (relatedTaskNVsTrangThai.length / relatedTaskNVs.length) * 100;

              return (
                <TouchableOpacity
                  key={task.manhiemvu}
                  style={styles.taskCard}
                  onPress={() => handleTaskPress(task,completionPercentage)}
                >
                  <Text style={styles.taskTitle}>{task.taskName}</Text>
                  <View style={styles.taskDetails}>
                    <Text style={styles.detailText}>Start: {task.startDate} {relatedTaskNVsTrangThai.length}</Text>
                    <Text style={styles.detailText}>End: {task.endDate}</Text>
                    <Text style={styles.detailText}>Assigned to: {task.assignedEmployees}</Text>
                    
                    {/* Thanh độ dài hoàn thành */}
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${completionPercentage}%` },
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noTasksText}>Không có nhiệm vụ nào!</Text>
          )
        ) : fullTasksNV.length > 0 ? (
          fullTasksNV.map((task) => {
            // Kiểm tra xem task có trong tasksNV không
            const matchedTask = tasksNV.find(
              (nvTask) => nvTask.manhiemvu === task.manhiemvu && nvTask.employeeId === employee.employeeId
            );

            // Đặt màu nền dựa trên trạng thái
            const backgroundColor = matchedTask
              ? matchedTask.trangthai === true
                ? "#00FF00"
                : "yellow"
              : "white";

            return (
              <TouchableOpacity
                key={task.manhiemvu}
                style={[styles.taskCard, { backgroundColor }]}
                onPress={() => handleTaskPress(task,0)}
              >
                <Text style={styles.taskTitle}>{task.taskName}</Text>
                <View style={styles.taskDetails}>
                  <Text style={styles.detailText}>Start: {task.startDate}</Text>
                  <Text style={styles.detailText}>End: {task.endDate}</Text>
                  <Text style={styles.detailText}>Assigned to: {task.assignedEmployees}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.noTasksText}>Không có nhiệm vụ nào!</Text>
        )}



      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  taskDetails: {
    flexDirection: "column",
    marginBottom: 14,
  },
  detailText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  noTasksText: {
    textAlign: "center",
    fontSize: 16,
    color: "#B0B0B0",
    marginTop: 40,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#B0B0B0",
  },
  progressContainer: {
    height: 10, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 5, 
    overflow: 'hidden', 
  },
  progressBar: {
    height: '100%', 
    backgroundColor: '#4caf50', 
  },
});

export default TaskScreen;
