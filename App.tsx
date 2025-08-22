import HomeScreen from "@/_src/presentation/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import React from "react";

export type RootStackParamList = {
  Home: undefined;
  ProductCreateScreen: undefined;
  ProductForm: undefined;
  ProductsListScreen: undefined;
  ProductEditScreen: { productId: string };
  StockCreateScreen: undefined;
  StockExitScreen: undefined;
  StockListScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const db = SQLite.openDatabaseSync("app.db");
  useDrizzleStudio(db);  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
