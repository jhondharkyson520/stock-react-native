import { RootStackParamList } from "@/App";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { Container } from "./style/container";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <Container>
      <Image source={require('../../../assets/LogoPinguim.png')}/>
      <TouchableOpacity onPress={() => navigation.navigate("ProductCreateScreen")}>
        <Text>New Products</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ProductsListScreen")}>
        <Text>Products List</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("UsersListScreen")}>
        <Text>Users</Text>
      </TouchableOpacity>
    
    

      <Text>Documentos - href = documentScreen</Text>
      <Text>Relatórios - href = relatoriosScreen</Text>
    </Container>
  );
}
