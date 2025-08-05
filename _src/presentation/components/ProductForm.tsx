import { Product } from "@/_src/domain/models/Products";
import { isValidEmail, isValidName } from "@/_src/utils/validators";
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { Container } from "../screens/style/container";

interface ProductFormProps {
  onSave: (product: Omit<Product, "id">) => void;
  onCancel: () => void;
}

export function ProductForm({ onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = () => {
    if (isValidName(name) && isValidEmail(email)) {      
      //onSave({ name, email });
      setName("");
      setEmail("");
    } else {
      alert('Name or Email invalid')
    }
  };

  return (
    <Container>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.buttonContainer}>
        <Button title="Salvar" onPress={handleSave} />
        <Button title="Cancelar" onPress={onCancel} color="gray" />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
});
