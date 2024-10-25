import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Dashboard from "../../Compoment/Dashboard";
import { readEmployees } from "../../services/database";
export default function HomeScreen({ navigation, route }) {
  const { employee } = route.params;
  const [listEmployee, setListEmployee] = useState([]);

  // lấy danh sách nv

  const getListNV = async () => {
    const data = await readEmployees();

    const dataArr = Object.values(data);
    console.log(dataArr);

    const newData = dataArr.filter((nv) => {
      return nv.phongbanId == employee.phongbanId;
    });

    setListEmployee(newData);
    console.log(newData);
  };

  useEffect(() => {
    getListNV();
  }, []);
  return <Dashboard listEmployee={listEmployee} employee={employee}/>;
}
