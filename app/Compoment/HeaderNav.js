import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function HeaderNav({
  navigation,
  nameIconLeft,
  name,
  nameIconRight,
  onEditPress,
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Nút quay lại */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={nameIconLeft} size={24} color="black" />
        </TouchableOpacity>

        {/* Tiêu đề màn hình */}
        <Text style={styles.headerTitle}>{name}</Text>

        {/* Nút chỉnh sửa */}
        <TouchableOpacity onPress={onEditPress}>
          <Icon name={nameIconRight} size={30} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  saveButton: {
    color: "blue",
    fontWeight: "bold",
  },
  timeSection: {
    backgroundColor: "#FFD700",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  timeLabel: {
    marginBottom: 8,
  },
  timeInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeInput: {
    backgroundColor: "white",
    padding: 4,
    marginLeft: 8,
    width: 60,
    textAlign: "center",
  },
  calendarSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFD700",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarNavigation: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
    borderRadius: 16,
  },
  activeFilterButton: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
    marginRight: 4,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
    padding: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
  },
  employeeList: {
    marginHorizontal: 16,
  },
  employeeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  evenItem: {
    backgroundColor: "#E0FFFF",
  },
  oddItem: {
    backgroundColor: "#FFFACD",
  },
  uncheckedItem: {
    backgroundColor: "#D3D3D3",
  },
  employeeName: {
    fontWeight: "bold",
  },
  employeeDepartment: {
    color: "gray",
  },
});
