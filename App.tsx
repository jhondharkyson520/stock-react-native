import HomeScreen from "@/_src/presentation/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { DatabaseProvider } from "./_src/data/db/DataBaseContext";

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
};

const Stack = createNativeStackNavigator<RootStackParamList>();



export default function App() {

  // zerar banco de dados:
  /* useEffect(() => {
    const init = async () => {
      await resetDatabase();
      const db = await getDB();
      await runMigrations();
      console.log("Banco reiniciado e pronto!");
    };
    init();
  }, []); */

  return (
    <DatabaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home"
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  );
}
