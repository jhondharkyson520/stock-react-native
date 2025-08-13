import HomeScreen from "@/_src/presentation/screens/HomeScreen";
import { UsersListScreen } from "@/_src/presentation/screens/UsersListScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import React from "react";
import { ProductCreateScreen } from "./_src/presentation/screens/ProductCreateScreen";
import { ProductEditScreen } from "./_src/presentation/screens/ProductEditScreen";
import { ProductsListScreen } from "./_src/presentation/screens/ProductListScreen";

export type RootStackParamList = {
  Home: undefined;
  UsersListScreen: undefined;
  ProductCreateScreen: undefined;
  ProductForm: undefined;
  ProductsListScreen: undefined;
  ProductEditScreen: { productId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const db = SQLite.openDatabaseSync("app.db");
  useDrizzleStudio(db);  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="UsersListScreen" component={UsersListScreen} />
        <Stack.Screen name="ProductCreateScreen" options={{title: 'Novo Produto 📦'}} component={ProductCreateScreen} />
        <Stack.Screen name="ProductsListScreen" options={{title: 'Lista de Produtos 📦'}}  component={ProductsListScreen} />
        <Stack.Screen name="ProductEditScreen" options={{title: 'Editar Produto 📦'}} component={ProductEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
