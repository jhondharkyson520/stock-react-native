import HomeScreen from "@/_src/presentation/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { FirestoreProvider } from "./_src/data/db/DataBaseContext";

export type RootStackParamList = {
  Home: undefined;
  ProductCreateScreen: undefined;
  ProductForm: undefined;
  ProductsListScreen: undefined;
  ProductEditScreen: { productId: string };
  StockCreateScreen: undefined;
  StockExitScreen: undefined;
  StockListScreen: undefined;
  ListOfProductsMinimumStockScreen: undefined;
  MainHomeScreen: undefined;
  DashboardScreen: undefined;
  CreateEntryStockProductScreen: undefined;
  CreateExitStockProductScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <FirestoreProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home"
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FirestoreProvider>
  );
}
