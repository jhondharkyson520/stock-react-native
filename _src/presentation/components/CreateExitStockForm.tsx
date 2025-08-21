import { StockMovement } from "@/_src/domain/models/StockMovement";
import { useState } from "react";
import { Alert, Image, ScrollView } from "react-native";
import v4 from "react-native-uuid";
import { useProducts } from "../hooks/useProducts";
import { Container } from "../screens/style/container";
import { shadowStyle } from "../screens/style/shadowStyle";
import { InputBarCode } from "./InputBarCode";
import { ButtonLarge, CircleQtdControll, CircleTextQtdControll, ContainerViewNumbers, LabelText, LabelTextButton, TextQtdControll } from "./style/ProductFormStyle";

interface StockFormProps {
  onCreate: (stock: StockMovement) => Promise<void>;
  loading: boolean;
}

export function CreateExitStockForm({loading, onCreate}: StockFormProps) {
    const { productByBarCode, handleDecreaseQtdProduct } = useProducts();
    const [formData, setFormData] = useState({
        id: '',
        product_id: '', 
        qtd: 1, 
        cost: 0,
        type: "saida",
        date_movement: new Date().toISOString(),
      });

    const handleDecrease = () => {
      setFormData((prev) => ({
        ...prev,
        qtd: Math.max(0, prev.qtd - 1),
      }));
    };
  
    const handleIncrease = () => {
      setFormData(prev => ({
        ...prev,
        qtd: prev.qtd + 1
      }));
    };
  
    const handleChange = (key: keyof StockMovement, cost: string | number) => {
      setFormData(prev => ({...prev, [key]: cost}));
    };

    const safeValue = (cost: string | null | number | undefined): string => {
        if (cost === null || cost === undefined) return "";
        return String(cost);
    };

    const handleSave = async () => {
      if (!formData.product_id) {
        Alert.alert("Erro", "Por favor, informe o código de barras.");
        return;
      }
      if (formData.qtd <= 0) {
        Alert.alert("Erro", "A quantidade deve ser maior que zero.");
        return;
      }

      const product = await productByBarCode(formData.product_id.toString());

      if (!product) {
        Alert.alert("Erro", "Produto com o código de barras informado não está cadastrado.");
        return;
      }

      const movementToSave = {
        ...formData,
        id: v4.v4(),
      }
       try {
        await handleDecreaseQtdProduct({ qtd: formData.qtd, code: formData.product_id });
        await onCreate(movementToSave);
        Alert.alert('Lançamento de saída feito com sucesso!');

        setFormData({
          id: '',
          product_id: '', 
          qtd: 1, 
          cost: 0,
          type: "saida",
          date_movement: new Date().toISOString(),
        });

      } catch (error: any) {
        //console.log('Erro em handlesave', error);
        Alert.alert("Erro", error.message ?? "Falha ao lançar saída.");
      }
    };
  
  return (
    <ScrollView>
      <Container>
      <Image style={{alignSelf: 'center', marginBottom: 50}} source={require('../../../assets/LogoPinguim.png')}/>
      <InputBarCode
        onBarCodeScanned={(code) => handleChange("product_id", code)}
        value={formData.product_id}
        placeholder="Código de barras aqui"
      />

        <ContainerViewNumbers>
            <LabelText>Quantidade:</LabelText>
            <CircleQtdControll style={shadowStyle.shadow} onPress={handleDecrease}>
                <CircleTextQtdControll>-</CircleTextQtdControll>
            </CircleQtdControll>
      
            <TextQtdControll>{formData.qtd}</TextQtdControll>
      
            <CircleQtdControll style={shadowStyle.shadow} onPress={handleIncrease}>
                <CircleTextQtdControll>+</CircleTextQtdControll>
            </CircleQtdControll>
        </ContainerViewNumbers>

        <ButtonLarge style={shadowStyle.shadow} onPress={handleSave}>
            <LabelTextButton>Lançar Saída</LabelTextButton>
        </ButtonLarge>
    </Container>
    </ScrollView>
  );
}
