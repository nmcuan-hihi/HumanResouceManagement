import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import BackNav from "../../Compoment/BackNav";

const TaskDetail = ({ route }) => {
  const { task } = route.params;  // Access the task passed via navigation

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackNav name={"Chi tiết nhiệm vụ"} />
      </View>

      {/* Task Details */}
      <View style={styles.section}>
        <Text style={styles.label}>Tên nhiệm vụ</Text>
        <Text style={styles.value}>{task.taskName}</Text>
      </View>

      {/* Time details in row */}
      <View style={styles.rowSection}>
        <View style={styles.timeSection}>
          <Text style={styles.label}>Thời gian bắt đầu</Text>
          <Text style={styles.value}>{task.startDate}</Text>
        </View>
        <View style={styles.timeSection}>
          <Text style={styles.label}>Thời gian kết thúc</Text>
          <Text style={styles.value}>{task.endDate}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Chi tiết</Text>
        <Text style={styles.value}>{task.description || "No description available."}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  rowSection: {
    flexDirection: "row",  // Align child components in a row
    justifyContent: "space-between",  // Spread them out evenly
    marginBottom: 16,
  },
  timeSection: {
    flex: 1,  // This makes both sections take equal space
    marginRight: 8,  // Adds spacing between the time sections
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",  // Make the label text bold
    color: "#757575",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
  },
});

export default TaskDetail;
