import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { useProducts } from "../hooks/useProducts";
import { Container } from "../screens/style/container";
import { InputText } from "./style/ProductFormStyle";



export function ProductForm() {
  const {products, error, handleCreateProduct} = useProducts();
  const [product, setProduct] = useState({
    name: '', 
    code: '', 
    description: '', 
    qtd: '',
    value: '', 
    image: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof product, value: string) => {
    setProduct(prev => ({...prev, [key]: value}));
  };

  const handleSave = async () => {
    if(!product.name || !product.code) {
      alert('Name or code invalid');
      return;
    }
    setLoading(true);
    try{
      await handleCreateProduct({
        ...product,
        qtd: Number(product.qtd),
        value: Number(product.value),
      });

      setProduct({
        name: "",
        code: "",
        description: "",
        qtd: "",
        value: "",
        image: ""
      });
    } catch(err) {
      console.error(err);
      alert('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Container>
      <InputText
        placeholder="Nome"
        placeholderTextColor="#FFFFFF"
        value={product.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      
      <InputText
        placeholder="Descrição (opcional)"
        placeholderTextColor="#FFFFFF"
        value={product.description}
        onChangeText={(text) => handleChange("description", text)}
      />
      <TextInput
        placeholder="Qtd"
        value={product.qtd}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("qtd", text)}
      />
      <TextInput
        placeholder="Value"
        value={product.value}
        onChangeText={(text) => handleChange("value", text)}
      />

      <TextInput
        placeholder="Code"
        value={product.code}
        onChangeText={(text) => handleChange("code", text)}
      />
      <TextInput
        placeholder="Image"
        value={product.image}
        onChangeText={(text) => handleChange("image", text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Salvar" onPress={handleSave} />
        <Button title="Cancelar" color="gray" />
      </View>
    </Container>
  );
}

/*
  Collor palete
  .color1 { #bab491 };
  .color2 { #95906c };
  .color3 { #706b48 };
  .color4 { #4a4724 };
  .color5 { #252200 };

*/

const styles = StyleSheet.create({
  
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
});
