import react from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import ItemDepartment from "../../Compoment/ItemDepartment";

const dataPB = [
  {
    maPB: "PB01",
    tenPB: "Phòng IT",
  },
];
const ListDepartementScreen = () => {
  return (
    <View style={styles.container}>
    
      <ItemDepartment />
    </View>
  );
};
styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListDepartementScreen;
