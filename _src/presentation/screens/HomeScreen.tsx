import { RootStackParamList } from "@/App";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, View } from "react-native";
import { CreateEntryStockProductScreen } from "./CreateEntryStockProductScreen";
import { CreateExitStockProductScreen } from "./CreateExitStockProductScreen";
import { DashboardScreen } from "./DashboardScreen";
import { ListOfProductsMinimumStockScreen } from "./ListOfProductsMinimumStockScreen";
import { ProductCreateScreen } from "./ProductCreateScreen";
import { ProductEditScreen } from "./ProductEditScreen";
import { ProductsListScreen } from "./ProductListScreen";
import { StockListScreen } from "./StockListScreen";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Image
          source={require("../../../assets/LogoPinguim.png")}
          style={{ width: 120, height: 120, resizeMode: "contain" }}
        />
      </View>
      <DrawerItem
        labelStyle={{ fontSize: 17, fontWeight: "bold" }}
        label="Home"
        onPress={() => props.navigation.navigate("DashboardScreen")}
      />
      <DrawerItem
        labelStyle={{ fontSize: 17, fontWeight: "bold" }}
        label="Lista de produtos"
        onPress={() => props.navigation.navigate("ProductsListScreen")}
      />      
      <DrawerItem
        labelStyle={{ fontSize: 17, fontWeight: "bold" }}
        label="Estoque detalhado"
        onPress={() => props.navigation.navigate("StockListScreen")}
      />
    </DrawerContentScrollView>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <Drawer.Navigator
      initialRouteName="DashboardScreen"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: "#fff",
          width: 250,
        },
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen 
        name="DashboardScreen" 
        component={DashboardScreen} 
        options={{
        headerTitle: () => (
          <Image
            source={require("../../../assets/LogoPinguim.png")}
            style={{ marginLeft: 14, width: 120, height: 40, resizeMode: "contain" }}
          />
        ),
          headerTitleAlign: "left",
        }}
      />      
      <Drawer.Screen 
        name="ProductsListScreen" 
        component={ProductsListScreen} 
        options={{ title: "Lista de Produtos" }} 
      />
      <Drawer.Screen 
        name="StockListScreen" 
        component={StockListScreen} 
        options={{ title: "Controle de Estoque" }} 
      />

      <Drawer.Screen 
        name="CreateEntryStockProductScreen" 
        component={CreateEntryStockProductScreen} 
        options={{ title: "Entrada de Produtos" }} 
      />
      <Drawer.Screen 
        name="CreateExitStockProductScreen" 
        component={CreateExitStockProductScreen} 
        options={{ title: "Saída de Produtos" }} 
      />
      <Drawer.Screen 
        name="ProductCreateScreen" 
        component={ProductCreateScreen} 
        options={{ title: "Novo Produto" }} 
      />

      <Drawer.Screen 
        name="ListOfProductsMinimumStockScreen" 
        component={ListOfProductsMinimumStockScreen} 
        options={{ title: "Lista de compras" }} 
      />
      <Drawer.Screen 
        name="ProductEditScreen" 
        component={ProductEditScreen} 
        options={{ title: "Editar produto" }} 
      />

    </Drawer.Navigator>
  );
}
