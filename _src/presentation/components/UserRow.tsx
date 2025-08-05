import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { User } from "../../domain/models/User";

interface UserRowProps {
  user: User;
  onDelete: (id: string) => void;
}

export function UserRow({ user, onDelete }: UserRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <Button title="Deletar" onPress={() => user.id && onDelete(user.id)} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});
