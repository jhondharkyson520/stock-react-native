import { isValidEmail, isValidName } from "@/_src/utils/validators";
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { User } from "../../domain/models/User";

interface UserFormProps {
  onSave: (user: Omit<User, "id">) => void;
  onCancel: () => void;
}

export function UserForm({ onSave, onCancel }: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = () => {
    if (isValidName(name) && isValidEmail(email)) {      
      onSave({ name, email });
      setName("");
      setEmail("");
    } else {
      alert('Name or Email invalid')
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
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
