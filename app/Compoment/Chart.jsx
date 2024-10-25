import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { readEmployees, readPhongBan } from "../services/database";



const Chart = () => {
  const [listEmployee, setListEmployee] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);
  const [dataChart, setDataChart] = useState([]);

  // Hàm lấy danh sách nhân viên
  const getListNV = async () => {
    try {
      const data = await readEmployees();
      setListEmployee(Object.values(data));
      console.log(data, "Danh sách nhân viên");
    } catch (error) {
      console.error("Lỗi lấy danh sách nhân viên:", error);
    }
  };

  // Hàm lấy danh sách phòng ban
  const getListPB = async () => {
    try {
      const data = await readPhongBan();
      setListPhongBan(Object.values(data));
      console.log(data, "Danh sách phòng ban");
    } catch (error) {
      console.error("Lỗi lấy danh sách phòng ban:", error);
    }
  };

  // Tính toán số lượng nhân viên theo từng phòng ban
  const processData = () => {
    const phongBanMap = {};

    // Khởi tạo số lượng nhân viên mỗi phòng bằng 0
    listPhongBan.forEach((pb) => {
      phongBanMap[pb.maPhongBan] = { name: pb.tenPhongBan, count: 0 };
    });

    // Duyệt danh sách nhân viên và tăng số lượng tương ứng
    listEmployee.forEach((nv) => {
      if (nv.phongbanId && phongBanMap[nv.phongbanId]) {
        phongBanMap[nv.phongbanId].count += 1;
      }
    });

    // Chuyển dữ liệu sang format của biểu đồ
    const chartData = Object.values(phongBanMap).map((pb) => ({
      name: pb.name,
      population: pb.count,
      color: getRandomColor(),
      legendFontColor: "blue",
      legendFontSize: 15,
    }));

    setDataChart(chartData);
  };

  // Hàm tạo màu ngẫu nhiên cho mỗi phần biểu đồ
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Gọi hàm lấy dữ liệu khi component mount
  useEffect(() => {
    getListNV();
    getListPB();
  }, []);

  // Tính toán lại dữ liệu khi nhân viên hoặc phòng ban thay đổi
  useEffect(() => {
    if (listEmployee.length > 0 && listPhongBan.length > 0) {
      processData();
    }
  }, [listEmployee, listPhongBan]);

  return (
    <View>
      {dataChart.length > 0 ? (
        <PieChart
          data={dataChart}
          width={380}
          height={180}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          absolute
        />
      ) : (
        <Text>Đang tải dữ liệu...</Text>
      )}
    </View>
  );
};

export default Chart;
