import HomeScreen from "@/_src/presentation/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import React from "react";
import { CreateEntryStockProductScreen } from "./_src/presentation/screens/CreateEntryStockProductScreen";
import { ProductCreateScreen } from "./_src/presentation/screens/ProductCreateScreen";
import { ProductEditScreen } from "./_src/presentation/screens/ProductEditScreen";
import { ProductsListScreen } from "./_src/presentation/screens/ProductListScreen";

export type RootStackParamList = {
  Home: undefined;
  ProductCreateScreen: undefined;
  ProductForm: undefined;
  ProductsListScreen: undefined;
  ProductEditScreen: { productId: string };
  StockCreateScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const db = SQLite.openDatabaseSync("app.db");
  useDrizzleStudio(db);  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductCreateScreen" options={{title: 'Novo Produto 📦'}} component={ProductCreateScreen} />
        <Stack.Screen name="ProductsListScreen" options={{title: 'Lista de Produtos 📦'}}  component={ProductsListScreen} />
        <Stack.Screen name="ProductEditScreen" options={{title: 'Editar Produto 📦'}} component={ProductEditScreen} />
        <Stack.Screen name="StockCreateScreen" options={{title: 'Entrada de produtos 📦'}} component={CreateEntryStockProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
