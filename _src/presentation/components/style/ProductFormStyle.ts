import styled from "styled-components/native";

export const InputText = styled.TextInput `
    background-color: #706B48;
    color: #FFFFFF;
    height: 40px;
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
    background-color: #706B48;
    color: #FFFFFF;
    height: 35px;
    width: 130px;
    border: none;
    border-radius: 10px;
    //margin-top: 15px;
`;

export const CircleQtdControll = styled.TouchableOpacity `
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: #FFF;
    align-items: center;
    justify-content: center;
`;

export const CircleTextQtdControll = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #252200;
`;

export const TextQtdControll = styled.Text`
    font-size: 22px;
    min-width: 30px;
    text-align: center;
    margin-inline: 10px;
    color: #252200;
`;

export const LabelText = styled.Text`
    font-size: 15px;
    margin-bottom: 10px;
    color: #FFFFFF;
    font-weight: bold;
`;
