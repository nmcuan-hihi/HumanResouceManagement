import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = [
  {
    name: 'Dữ liệu 1',
    population: 215000,
    color: '#ff6384',
    legendFontColor: '#ffffff',
    legendFontSize: 15,
  },
  {
    name: 'Dữ liệu 2',
    population: 280000,
    color: '#36a2eb',
    legendFontColor: '#ffffff',
    legendFontSize: 15,
  },
  {
    name: 'Dữ liệu 3',
    population: 400000,
    color: '#cc65fe',
    legendFontColor: '#ffffff',
    legendFontSize: 15,
  },
  {
    name: 'Dữ liệu 4',
    population: 190000,
    color: '#ffce56',
    legendFontColor: '#ffffff',
    legendFontSize: 15,
  },
];

const Chart = () => {
  return (
    <View>
      <PieChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

export default Chart;