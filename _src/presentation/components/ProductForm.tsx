import { Product } from "@/_src/domain/models/Products";
import { formatToCurrencyInput } from "@/_src/utils/maskValue";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from "react";
import { Alert, Button, Image, Modal, ScrollView, Text, View } from "react-native";
import { Container } from "../screens/style/container";
import { shadowStyle } from "../screens/style/shadowStyle";
import { BorderFromImage, ButtonLarge, ContainerImageProduct, ContainerViewNumbers, InputText, InputTextBarCode, InputTextValue, LabelText, LabelTextButton, OpenCameraScan } from "./style/ProductFormStyle";

interface ProductFormProps {
  onCreate: (product: Product) => Promise<void>;
  loading: boolean;
}

export function ProductForm({onCreate, loading}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '', 
    code: '', 
    description: '', 
    qtd: 0,
    value: '', 
    image: ''
  });
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const barCodeLock = useRef(false);

  const handleChange = (key: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      Alert.alert("Erro", "Nome e código de barras são obrigatórios");
      return;
    }
    try {
      const imageToSave = formData.image && formData.image !== "" ? formData.image : "blank";
      const newProduct: Product = {
        ...formData,
        value: Number(formData.value) || 0,
        qtd: formData.qtd,
        image: imageToSave,
      };
      await onCreate(newProduct);
      Alert.alert("Sucesso", "Produto salvo com sucesso");
      setFormData({
        name: "",
        code: "",
        description: "",
        qtd: 0,
        value: "",
        image: "",
      });
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      Alert.alert("Erro", "Não foi possível salvar o produto");
    }
  };

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
    setFormData({
      ...formData,
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

      setFormData(prev => ({ ...prev, image: newPath }));
    }
  } catch (err) {
    console.log("Erro ao tirar foto:", err);
    Alert.alert("Erro", "Não foi possível tirar a foto.");
  }
};

  return (
    <ScrollView>
      <Container>
      <Image style={{alignSelf: 'center', marginBottom: 50}} source={require('../../../assets/LogoPinguim.png')}/>
      <InputText
        style={shadowStyle.shadow}
        placeholder="Nome"
        placeholderTextColor="#000000"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      
      <InputText
        style={shadowStyle.shadow}
        placeholder="Descrição (opcional)"
        placeholderTextColor="#000000"
        value={formData.description}
        onChangeText={(text) => handleChange("description", text)}
      />


      <ContainerViewNumbers>
        <LabelText>Valor R$:</LabelText>
        <InputTextValue
          style={shadowStyle.shadow}
          placeholderTextColor="#000000"
          keyboardType="numeric"
          value={formatToCurrencyInput(formData.value).display}
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
            value={formData.code}
            onChangeText={(text) => handleChange("code", text)}
          />
      </View>    
      

      

      <View style={{ marginTop: 25, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
      <ContainerImageProduct style={shadowStyle.shadow}>
        <BorderFromImage onPress={handleTakePhoto}>
          {formData.image ? (
            <Image
              source={{ uri: formData.image }}
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

      <ButtonLarge style={shadowStyle.shadow} onPress={handleSave}>
        <LabelTextButton>Cadastrar</LabelTextButton>
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
