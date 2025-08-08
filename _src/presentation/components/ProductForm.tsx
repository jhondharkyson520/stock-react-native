import { formatToCurrencyInput } from "@/_src/utils/maskValue";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from "react";
import { Alert, Button, Image, Modal, ScrollView, View } from "react-native";
import { useProducts } from "../hooks/useProducts";
import { Container } from "../screens/style/container";
import { ButtonSave, CircleQtdControll, CircleTextQtdControll, ContainerImageProduct, ContainerViewNumbers, InputText, InputTextBarCode, InputTextValue, LabelText, LabelTextButton, OpenCameraScan, TextQtdControll } from "./style/ProductFormStyle";


export function ProductForm() {  
  const [loading, setLoading] = useState(false);
  const {products, error, handleCreateProduct} = useProducts();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const barCodeLock = useRef(false);
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
        image: product.image
      });

      Alert.alert(" Salvo", "Produto salvo com sucesso");

      setProduct({
        name: "",
        code: '',
        description: "",
        qtd: 0,
        value: "",
        image: ""
      });
    } catch(err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível salvar o produto");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCamera = async () => {
    try {
      const {granted} = await requestPermission();
      if(!granted) {
        return Alert.alert("Camera", "Você precisa permitir o uso da camera");
      }
      setModalIsVisible(true)
      barCodeLock.current = false;
    } catch (error) {
      console.log(error);      
    }
  };

  const handleBarCodeRead = (data: string) => {
    setModalIsVisible(false);
    setProduct({
      ...product,
      code: data
    });
    Alert.alert("Código", data);  
  }

  const handleTakePhoto = async () => {
  try {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      return Alert.alert("Permissão", "Permissão da câmera é necessária.");
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const photo = result.assets[0];
      const fileName = photo.fileName || `product_${Date.now()}.jpg`;
      const newPath = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({
        from: photo.uri,
        to: newPath,
      });

      setProduct(prev => ({ ...prev, image: newPath }));
    }
  } catch (err) {
    console.log("Erro ao tirar foto:", err);
    Alert.alert("Erro", "Não foi possível tirar a foto.");
  }
};

  
  return (
    <ScrollView>
      <Container>
      <InputText
        placeholder="Nome"
        placeholderTextColor="#000000"
        value={product.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      
      <InputText
        placeholder="Descrição (opcional)"
        placeholderTextColor="#000000"
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
        <LabelText>Valor R$:</LabelText>
        <InputTextValue
          placeholderTextColor="#000000"
          keyboardType="numeric"
          value={formatToCurrencyInput(product.value).display}
          onChangeText={(text) => {
            const { raw } = formatToCurrencyInput(text);
            handleChange("value", raw);
          }}
        />
      </ContainerViewNumbers>

      <ContainerViewNumbers>
          <OpenCameraScan onPress={handleOpenCamera}>
            <Image 
              source={require('../../../assets/iconBarCode.png')}
               style={{ width: 70, height: 50 }}
            />
          </OpenCameraScan>

          <InputTextBarCode 
            placeholder="Código de barras"
            placeholderTextColor="#000000"
            keyboardType="numeric"
            value={product.code}
            onChangeText={(text) => handleChange("code", text)}
          />
      </ContainerViewNumbers>    
      

      

      <View style={{ marginTop: 25, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
      <ContainerImageProduct onPress={handleTakePhoto}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={{ width: 150, height: 150, borderRadius: 8 }}
          />
        ) : (
          <Image
            source={require('../../../assets/addImageProduct.png')}
            style={{ width: 150, height: 150 }}
          />
        )}
      </ContainerImageProduct>
    </View>

      <ButtonSave onPress={handleSave}>
        <LabelTextButton>Cadastrar</LabelTextButton>
      </ButtonSave>

      <Modal visible={modalIsVisible}>
          <CameraView 
            style={{ flex: 1}} 
            facing="back"
            onBarcodeScanned={({data}) => {
              if(data && !barCodeLock.current) {
                barCodeLock.current = true;
                setTimeout(() => handleBarCodeRead(data), 1700);
              }
            }
            }
          />
           <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              width: 250,
              height: 150,
              borderColor: 'black',
              borderWidth: 2,
              borderRadius: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }} />
          </View>
          <View style={{position: "absolute", bottom: 32, left: 32, right: 32}}>
              <Button title="Cancelar" onPress={() => setModalIsVisible(false)}/>
          </View>
      </Modal>
    </Container>
    </ScrollView>
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
