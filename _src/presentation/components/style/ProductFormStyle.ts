import styled from "styled-components/native";

export const InputText = styled.TextInput `
    background-color: #FFFFFF;
    color: #000000;
    height: 80px;
    font-size: 25px;
    border: none;
    border-radius: 10px;
    margin-bottom: 12px;
`;

export const ContainerViewNumbers = styled.View `
    display: flex;
    flex-direction: row;
    gap: 16px;
    padding: 13px 0px 13px 0px;
    align-items: center;
    //background-color: red;
`;

export const InputTextValue = styled.TextInput `
    background-color: #FFFFFF;
    color: #000000;
    height: 80px;
    width: 200px;
    font-size: 25px;
    border: none;
    border-radius: 10px;
    //margin-top: 15px;
`;

export const InputTextBarCode = styled.TextInput `
    background-color: #FFFFFF;
    color: #000000;
    height: 80px;
    width: 290px;
    font-size: 25px;
    border: none;
    border-radius: 10px;
    //margin-top: 15px;
`;

export const CircleQtdControll = styled.TouchableOpacity `
    width: 60px;
    height: 60px;
    border-radius: 40px;
    background-color: #FFF;
    align-items: center;
    justify-content: center;
`;

export const CircleTextQtdControll = styled.Text`
    font-size: 40px;
    font-weight: bold;
    color: #3B82F6;
`;

export const TextQtdControll = styled.Text`
    font-size: 25px;
    min-width: 30px;
    text-align: center;
    margin-inline: 10px;
    color: #000000;
`;

export const LabelText = styled.Text`
    font-size: 25px;
    margin-bottom: 10px;
    color: #2D2D2D;
    font-weight: bold;
`;

export const LabelTextButton = styled.Text`
    font-size: 25px;
    margin-bottom: 10px;
    color: #FFFFFF;
    font-weight: bold;
`;

export const OpenCameraScan = styled.TouchableOpacity`
    align-items: center;
    margin-top: 25px;
    margin-bottom: 45px;
`;

export const ContainerImageProduct = styled.TouchableOpacity`
    
    background-color: #FFFFFF;
    border-radius: 10px;
    height: 283px;
    width: 209px;
    justify-content: center;
    align-items: center;
`;

export const ButtonSave = styled.TouchableOpacity`
    background-color: #2563EB   ;
    justify-content: center;
    align-items: center;
    height: 80px;
    border: none;
    border-radius: 10px;
    margin-bottom: 12px;
`;
