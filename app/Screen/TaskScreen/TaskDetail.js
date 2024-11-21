import React ,{useEffect,useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import BackNav from "../../Compoment/BackNav";
const TaskDetail = (navigation) => {
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <BackNav name={"Chi tiết nhiệm vụ"} />
      </View>

      {/* Task Details */}
      <View style={styles.section}>
        <Text style={styles.label}>Tên nhiệm vụ</Text>
        <Text style={styles.value}>Nhiệm vụ 1</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Start Date and Time</Text>
        <Text style={styles.value}>03/10/2022, 3:44 am</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Chi tiết</Text>
        <Text style={styles.value}>
          Reference site about Lorem Ipsum, giving information on its origins,
          as well as a random Lipsum generator
        </Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#1E88E5", // Blue shade for the title
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#757575", // Gray shade for labels
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242", // Darker text color for values
  },
});

export default TaskDetail;
