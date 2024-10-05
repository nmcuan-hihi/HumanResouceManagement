import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/Screen/LoginSreen/LoginScreen';
import HomeScreen from './app/Screen/HomeScreen/HomeScreen';
import { useFonts } from 'expo-font';
const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'FBold': require('./assets/fonts/JosefinSans-Bold.ttf'),
    'FMedium': require('./assets/fonts/JosefinSans-Medium.ttf'),
    'FRegular': require('./assets/fonts/JosefinSans-Regular.ttf'),
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
       

      </Stack.Navigator>  
    </NavigationContainer>
    <StatusBar style="auto" />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
  },
});
