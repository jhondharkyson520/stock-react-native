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

export default function ProductScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <Container>
      <TouchableOpacity onPress={() => navigation.navigate("UsersListScreen")}>
        <Text>Products</Text>
      </TouchableOpacity>
    </Container>
  );
}
