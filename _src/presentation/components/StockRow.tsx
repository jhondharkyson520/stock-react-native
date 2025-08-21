import { StockMovement } from "@/_src/domain/models/StockMovement";
import { RootStackParamList } from "@/App";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { shadowStyle } from "../screens/style/shadowStyle";
import { ButtonLarge, LabelTextButton } from "./style/ProductFormStyle";

interface StockRowProps {
  stock: StockMovement;
  onDelete: (id: string) => void;
}

type StockRowScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StockListScreen"
>;


export function StockRow({stock, onDelete}: StockRowProps) {
  const navigation = useNavigation<StockRowScreenNavigationProp>();

  const deleteHistoryStock = async () => {
    if(!stock.id) return;
    try {
      await onDelete(stock.id);
      Alert.alert('Success!', 'Product deleted success');
    } catch (err) {
      Alert.alert('Error!', 'Error delete product');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>id: {stock.id}</Text>
        <Text style={styles.name}>product_id: {stock.product_id}</Text> 
        <Text style={styles.name}>type: {stock.type}</Text>
        <Text style={styles.name}>qtd: {stock.qtd}</Text>
        <Text style={styles.name}>cost: {stock.cost}</Text>
        <Text style={styles.name}>date_movement: {stock.date_movement}</Text>
        <ButtonLarge style={shadowStyle.shadow} onPress={deleteHistoryStock}>
          <LabelTextButton>Deletar</LabelTextButton>
        </ButtonLarge> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});
