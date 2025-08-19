import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from "react";
import { Alert, Button, Image, Modal, StyleProp, View, ViewStyle } from "react-native";
import { Container } from "../screens/style/container";
import { shadowStyle } from "../screens/style/shadowStyle";
import { InputTextBarCode, OpenCameraScan } from "./style/ProductFormStyle";

interface InputBarCodeProps {
    onBarCodeScanned: (code: string) => void;
    value: string;
    initialCode?: string;
    placeholder?: string;
    containerStyle?: StyleProp<ViewStyle>;
    icon?: string;
    iconTintColor?: string;
}

export function InputBarCode({
    onBarCodeScanned,
    initialCode = '',
    value = '',
    placeholder = 'Código de barras',
    containerStyle,
    icon = '../../../assets/iconBarCode.png',
    iconTintColor = '#003F77',
}: InputBarCodeProps) {
    const [code, setCode] = useState(value);

    React.useEffect(() => {
        setCode(value);
    }, [value]);

    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const barCodeLock = useRef(false);

    const handleOpenCamera = async () => {
        try {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert("Permissão negada", "Você precisa permitir o uso da câmera.");
                return;
            }
            setModalIsVisible(true);
            barCodeLock.current = false;
        } catch (error) {
            console.error("Erro ao abrir câmera:", error);
            Alert.alert("Erro", "Não foi possível acessar a câmera.");
        }
    };

    const handleBarCodeRead = (data: string) => {
        setModalIsVisible(false);
        setCode(data);
        onBarCodeScanned(data);
        Alert.alert("Código lido", data);
    };
    return (
        <Container>
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
                    value={code}
                    onChangeText={(text) => {
                        setCode(text);
                        onBarCodeScanned(text);
                    }}
                />
            </View>

            <Modal
                visible={modalIsVisible}
                animationType="slide"
                onRequestClose={() => setModalIsVisible(false)}
            >
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={({ data }) => {
                        if (data && !barCodeLock.current) {
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
                <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
                    <Button title="Cancelar" onPress={() => setModalIsVisible(false)} />
                </View>
            </Modal>
        </Container>
    );
}
