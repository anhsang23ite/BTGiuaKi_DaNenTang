import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import ProductListScreen from './screens/ProductListScreen';
import AddProductScreen from './screens/AddProductScreen';
import EditProductScreen from './screens/EditProductScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
        <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Quản lý Sản phẩm' }} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Thêm sản phẩm' }} />
        <Stack.Screen name="EditProduct" component={EditProductScreen} options={{ title: 'Sửa sản phẩm' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
