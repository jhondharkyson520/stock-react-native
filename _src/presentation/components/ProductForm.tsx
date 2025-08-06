import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { useProducts } from "../hooks/useProducts";
import { Container } from "../screens/style/container";



export function ProductForm() {
  const {products, error, handleCreateProduct} = useProducts();
  const [product, setProduct] = useState({
    name: '', 
    code: '', 
    description: '', 
    qtd: '', 
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
      const created = await handleCreateProduct({
        ...product,
        qtd: Number(product.qtd)
      });

      setProduct({
        name: "",
        code: "",
        description: "",
        qtd: "",
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
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={product.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Code"
        value={product.code}
        onChangeText={(text) => handleChange("code", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={product.description}
        onChangeText={(text) => handleChange("description", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Qtd"
        value={product.qtd}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("qtd", text)}
      />
      <TextInput
        style={styles.input}
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

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
});
