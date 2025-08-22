import { RootStackParamList } from "@/App";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, View } from "react-native";
import { CreateEntryStockProductScreen } from "./CreateEntryStockProductScreen";
import { CreateExitStockProductScreen } from "./CreateExitStockProductScreen";
import { ProductCreateScreen } from "./ProductCreateScreen";
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
        label="Entrada de produtos"
        onPress={() => props.navigation.navigate("CreateEntryStockProductScreen")}
      />
      <DrawerItem
        labelStyle={{ fontSize: 17, fontWeight: "bold" }}
        label="Saída de produtos"
        onPress={() => props.navigation.navigate("CreateExitStockProductScreen")}
      />
      <DrawerItem
        labelStyle={{ fontSize: 17, fontWeight: "bold" }}
        label="Novo Produto"
        onPress={() => props.navigation.navigate("ProductCreateScreen")}
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
        name="ProductsListScreen" 
        component={ProductsListScreen} 
        options={{ title: "Produtos Cadastrados" }} 
      />      
      <Drawer.Screen 
        name="StockListScreen" 
        component={StockListScreen} 
        options={{ title: "Controle de Estoque" }} 
      />
    </Drawer.Navigator>
  );
}
