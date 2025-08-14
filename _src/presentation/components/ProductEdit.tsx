import { Product } from "@/_src/domain/models/Products";
import { formatToCurrencyInput } from "@/_src/utils/maskValue";
import { RootStackParamList } from "@/App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Image, Modal, ScrollView, Text, View } from "react-native";
import { Container } from "../screens/style/container";
import { shadowStyle } from "../screens/style/shadowStyle";
import {
  BorderFromImage,
  ButtonLarge,
  CircleQtdControll,
  CircleTextQtdControll,
  ContainerImageProduct,
  ContainerViewNumbers,
  InputText,
  InputTextBarCode,
  InputTextValue,
  LabelText,
  LabelTextButton,
  OpenCameraScan,
  TextQtdControll
} from "./style/ProductFormStyle";

type ProductEditScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductEditScreen"
>;

interface ProductEditProps {
  product: Product;
  onEdit: (product: Product) => Promise<void>;
}

export function ProductEdit({product, onEdit}: ProductEditProps) {  
  const [loading, setLoading] = useState(false);  
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const barCodeLock = useRef(false);
  const navigation = useNavigation<ProductEditScreenNavigationProp>();
  const [localProduct, setLocalProduct] = useState(product);

  useEffect(() => {
    setLocalProduct(product);
  }, [product]);  

  const handleDecrease = () => {
    setLocalProduct((prev) => ({
      ...prev,
      qtd: Math.max(0, prev.qtd - 1),
    }));
  };

  const handleIncrease = () => {
    setLocalProduct(prev => ({
      ...prev,
      qtd: prev.qtd + 1
    }));
  };

  const handleChange = (key: keyof Product, value: string | number) => {
    setLocalProduct(prev => ({...prev, [key]: value}));
  };

  const handleEdit = async () => {
    if(!localProduct.name || !localProduct.code) {
      alert('Name or code invalid');
      return;
    }
    setLoading(true);
    try{
      const updatedProduct = {
        ...localProduct,
        value: Number(localProduct.value),
        qtd: Number(localProduct.qtd),
      };

      await onEdit(updatedProduct);

      Alert.alert("Atualizado", "Produto atualizado com sucesso");
      
      navigation.goBack();          
    } catch(err) {
      //console.error(err);
      Alert.alert("Erro", "Não foi possível salvar o produto");
    } finally {      
      setLoading(false); 
    }
  }

  const handleOpenCamera = async () => {
    const {granted} = await requestPermission();
    if(!granted) {
      Alert.alert("Permissão", "Você precisa permitir o uso da câmera");
      return;
    }      
    setModalIsVisible(true)
    barCodeLock.current = false;
  };

  const handleBarCodeRead = (data: string) => {
    if (data && !barCodeLock.current) {
      barCodeLock.current = true;
      setLocalProduct((prev) => ({ ...prev, code: data }));
      setModalIsVisible(false);
      Alert.alert("Código", `Código lido: ${data}`);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permissão", "Permissão da câmera é necessária");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const photo = result.assets[0];
        const fileName = photo.fileName || `product_${Date.now()}.jpg`;
        const newPath = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.copyAsync({
          from: photo.uri,
          to: newPath,
        });

        setLocalProduct((prev) => ({ ...prev, image: newPath }));
      }
    } catch (err) {
      console.error("Erro ao tirar foto:", err);
      Alert.alert("Erro", "Não foi possível tirar a foto");
    }
  };

  const safeValue = (value: string | null | number | undefined): string => {
    if (value === null || value === undefined) return "";
    return String(value);
  };
  
  return (
    <ScrollView>
      <Container>
      <Image style={{alignSelf: 'center', marginBottom: 50}} source={require('../../../assets/LogoPinguim.png')}/>
      <InputText
        style={shadowStyle.shadow}
        placeholder="Nome"
        placeholderTextColor="#000000"
        value={localProduct.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      
      <InputText
        style={shadowStyle.shadow}
        placeholder="Descrição (opcional)"
        placeholderTextColor="#000000"
        value={safeValue(localProduct.description)}
        onChangeText={(text) => handleChange("description", text)}
      />

      
      <ContainerViewNumbers>
        <LabelText>Quantidade:</LabelText>
        <CircleQtdControll style={shadowStyle.shadow} onPress={handleDecrease}>
          <CircleTextQtdControll>-</CircleTextQtdControll>
        </CircleQtdControll>

        <TextQtdControll>{localProduct.qtd}</TextQtdControll>

        <CircleQtdControll style={shadowStyle.shadow} onPress={handleIncrease}>
          <CircleTextQtdControll>+</CircleTextQtdControll>
        </CircleQtdControll>
      </ContainerViewNumbers>

      <ContainerViewNumbers>
        <LabelText>Valor R$:</LabelText>
        <InputTextValue
          style={shadowStyle.shadow}
          placeholderTextColor="#000000"
          keyboardType="numeric"
          value={formatToCurrencyInput(safeValue(localProduct.value)).display}
          onChangeText={(text) => {
            const { raw } = formatToCurrencyInput(text);
            handleChange("value", raw);
          }}
        />
      </ContainerViewNumbers>

      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 15,
        marginBottom: 20
      }}>
          <OpenCameraScan 
            onPress={handleOpenCamera} 
            style={shadowStyle.shadow}
          >
              <View style={{
                height: 2,
                width: '100%',
                backgroundColor: 'red',
                position: 'absolute',
              }} />
              <Image 
                source={require('../../../assets/iconBarCode.png')}
                style={{ width: 70, height: 50, tintColor: '#003F77' }}
              />
            
          </OpenCameraScan>

          <InputTextBarCode
            style={shadowStyle.shadow}
            placeholder="Código de barras"
            placeholderTextColor="#000000"
            keyboardType="numeric"
            value={product.code}
            onChangeText={(text) => handleChange("code", text)}
          />
      </View>    
      

      

      <View style={{ marginTop: 25, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
      <ContainerImageProduct style={shadowStyle.shadow}>
        <BorderFromImage onPress={handleTakePhoto}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
            />
          ) : (
            <>
              <Image
                source={require('../../../assets/addImageProduct.png')}
                style={{ width: 50, height: 50, tintColor: '#003F77' }}
              />
              <Text style={{fontSize: 18, color: '#616161'}}>Toque para adicionar imagem</Text>
            </>
          )}
        </BorderFromImage>
        
      </ContainerImageProduct>
    </View>

      <ButtonLarge style={shadowStyle.shadow} onPress={handleEdit}>
        <LabelTextButton>Atualizar</LabelTextButton>
      </ButtonLarge>

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
