import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Ensure you have navigation set up

const TaskDetailsScreen = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backButton}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Task Details</Text>
      </View>

      {/* Task Information */}
      <View style={styles.taskInfo}>
        <Text style={styles.label}>Tên nhiệm vụ</Text>
        <Text style={styles.info}>Nhiệm vụ 1</Text>

        <Text style={styles.label}>Start Date and Time</Text>
        <Text style={styles.info}>03/10/2022, 3:44 am</Text>

        <Text style={styles.label}>Chi tiết</Text>
        <Text style={styles.info}>
          Reference site about Lorem Ipsum, giving information on its origins, 
          as well as a random Lipsum generator.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#000',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D4676',
  },
  taskInfo: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  info: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 20,
  },
});

export default TaskDetailsScreen;
