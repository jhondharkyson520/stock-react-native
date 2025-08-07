import { maskValue } from "@/_src/utils/maskValue";
import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { Container } from "../screens/style/container";
import { CircleQtdControll, CircleTextQtdControll, ContainerViewNumbers, InputText, InputTextValue, LabelText, TextQtdControll } from "./style/ProductFormStyle";



export function ProductForm() {  
  const [loading, setLoading] = useState(false);
  const {products, error, handleCreateProduct} = useProducts();
  const [product, setProduct] = useState({
    name: '', 
    code: '', 
    description: '', 
    qtd: 1,
    value: '', 
    image: ''
  });

  const handleDecrease = () => {
    if(product.qtd > 0) {
      setProduct(prev => ({
        ...prev,
        qtd: prev.qtd - 1
      }));
    }
  };

  const handleIncrease = () => {
    setProduct(prev => ({
      ...prev,
      qtd: prev.qtd + 1
    }));
  };

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
        qtd: 0,
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

      
      <ContainerViewNumbers>
        <LabelText>Quantidade:</LabelText>
        <CircleQtdControll onPress={handleDecrease}>
          <CircleTextQtdControll>-</CircleTextQtdControll>
        </CircleQtdControll>

        <TextQtdControll>{product.qtd}</TextQtdControll>

        <CircleQtdControll onPress={handleIncrease}>
          <CircleTextQtdControll>+</CircleTextQtdControll>
        </CircleQtdControll>
      </ContainerViewNumbers>

      <ContainerViewNumbers>
        <LabelText>Valor:</LabelText>
        <InputTextValue
          placeholderTextColor="#FFFFFF"
          value={product.value}
          onChangeText={(text) => {
            const masked = maskValue(text);
            handleChange("value", masked);
          }}
        />
      </ContainerViewNumbers>

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
