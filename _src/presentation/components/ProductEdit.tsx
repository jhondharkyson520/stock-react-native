import { formatToCurrencyInput } from "@/_src/utils/maskValue";
import { RootStackParamList } from "@/App";
import { useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Image, Modal, ScrollView, Text, View } from "react-native";
import { useProducts } from "../hooks/useProducts";
import { Container } from "../screens/style/container";
import { shadowStyle } from "../screens/style/shadowStyle";
import { BorderFromImage, ButtonLarge, CircleQtdControll, CircleTextQtdControll, ContainerImageProduct, ContainerViewNumbers, InputText, InputTextBarCode, InputTextValue, LabelText, LabelTextButton, OpenCameraScan, TextQtdControll } from "./style/ProductFormStyle";

type ProductEditScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductEditScreen"
>;

type RouteParams = {
  productId: string;
};

export function ProductEdit() {  
  const [loading, setLoading] = useState(false);
  const {products, error, handleEditProduct, productById} = useProducts();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const barCodeLock = useRef(false);
  const navigation = useNavigation<ProductEditScreenNavigationProp>();
  const route = useRoute();
  const { productId } = route.params as RouteParams;
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

  const handleEdit = async () => {
    if(!product.name || !product.code) {
      alert('Name or code invalid');
      return;
    }
    setLoading(true);
    try{
      await handleEditProduct({
        ...product,
        qtd: Number(product.qtd),
        value: Number(product.value),
        image: product.image
      });

      Alert.alert("Atualizado", "Produto atualizado com sucesso");
      navigation.navigate("Home");
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
      allowsEditing: false,
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

useEffect(() => {
    const fetchProduct = async () => {
      try {
        const foundProduct = await productById(productId);
        if (foundProduct) {
          setProduct({
            name: foundProduct.name,
            code: foundProduct.code,
            description: foundProduct.description || "",
            qtd: foundProduct.qtd,
            value: foundProduct.value.toString(),
            image: foundProduct.image || "",
          });
        }
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  
  return (
    <ScrollView>
      <Container>
      <Image style={{alignSelf: 'center', marginBottom: 50}} source={require('../../../assets/LogoPinguim.png')}/>
      <InputText
        style={shadowStyle.shadow}
        placeholder="Nome"
        placeholderTextColor="#000000"
        value={product.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      
      <InputText
        style={shadowStyle.shadow}
        placeholder="Descrição (opcional)"
        placeholderTextColor="#000000"
        value={product.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      
      <ContainerViewNumbers>
        <LabelText>Quantidade:</LabelText>
        <CircleQtdControll style={shadowStyle.shadow} onPress={handleDecrease}>
          <CircleTextQtdControll>-</CircleTextQtdControll>
        </CircleQtdControll>

        <TextQtdControll>{product.qtd}</TextQtdControll>

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
          value={formatToCurrencyInput(product.value).display}
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
