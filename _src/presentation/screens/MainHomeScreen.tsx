import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function MainHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Sistema de Estoque</Text>
      <Text style={styles.subtitle}>Use o menu para navegar pelas opções</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: "#555"
  }
});
