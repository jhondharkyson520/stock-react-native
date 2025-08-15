import { StockMovement } from "@/_src/domain/models/StockMovement";
import { formatToCurrencyInput } from "@/_src/utils/maskValue";
import { useState } from "react";
import { Image, ScrollView } from "react-native";
import { Container } from "../screens/style/container";
import { shadowStyle } from "../screens/style/shadowStyle";
import { ButtonLarge, CircleQtdControll, CircleTextQtdControll, ContainerViewNumbers, InputText, InputTextValue, LabelText, LabelTextButton, TextQtdControll } from "./style/ProductFormStyle";

interface StockFormProps {
  onCreate: (stock: StockMovement) => Promise<void>;
  loading: boolean;
}

export function CreateEntryStockForm({loading, onCreate}: StockFormProps) {
    const [formData, setFormData] = useState({
        product_id: '', 
        qtd: 0, 
        cost: 0,
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
        
    };
  
  return (
    <ScrollView>
      <Container>
      <Image style={{alignSelf: 'center', marginBottom: 50}} source={require('../../../assets/LogoPinguim.png')}/>
      <InputText
        style={shadowStyle.shadow}
        placeholder="Product ID V"
        placeholderTextColor="#000000"
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
      
        <ContainerViewNumbers>
            <LabelText>Valor R$:</LabelText>
            <InputTextValue
                style={shadowStyle.shadow}
                placeholderTextColor="#000000"
                keyboardType="numeric"
                value={formatToCurrencyInput(safeValue(formData.cost)).display}
                onChangeText={(text) => {
                  const { raw } = formatToCurrencyInput(text);
                  handleChange("cost", raw);
                }}
              />
        </ContainerViewNumbers>

        <ButtonLarge style={shadowStyle.shadow} onPress={handleSave}>
            <LabelTextButton>Lançar Entrada</LabelTextButton>
        </ButtonLarge>
    </Container>
    </ScrollView>
  );
}
