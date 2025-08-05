import { RootStackParamList } from "@/App";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Container } from "./style/container";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <Container>
      <TouchableOpacity onPress={() => navigation.navigate("ProductScreen")}>
        <Text>Products</Text>
      </TouchableOpacity>
      <Text>Documentos - href = documentScreen</Text>
      <Text>Relatórios - href = relatoriosScreen</Text>
    </Container>
  );
}
