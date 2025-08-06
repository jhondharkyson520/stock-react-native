import HomeScreen from "@/_src/presentation/screens/HomeScreen";
import { UsersListScreen } from "@/_src/presentation/screens/UsersListScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import React from "react";
import { ProductScreen } from "./_src/presentation/screens/ProductScreen";

export type RootStackParamList = {
  Home: undefined;
  UsersListScreen: undefined;
  ProductScreen: undefined;
  ProductForm: undefined;
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
        <Stack.Screen name="ProductScreen" component={ProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
