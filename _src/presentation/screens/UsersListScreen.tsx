import { runMigrations } from "@/_src/data/db";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { UserForm } from "../components/UserForm";
import { UserRow } from "../components/UserRow";
import { useUsers } from "../hooks/useUsers";
import { Container } from "./style/container";

export function UsersListScreen() {
  const { users, loading, error, fetchUsers, handleCreateUser, handleDeleteUser } = useUsers();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await runMigrations(); // Executa as migrações no startup
        setDbReady(true);
      } catch (e) {
        console.error("Failed to initialize database:", e);
      }
    };
    initializeDb();
  }, []);

  if (!dbReady || loading) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchUsers} />
      </View>
    );
  }

  return (
    <Container>
      {isFormVisible ? (
        <UserForm
          onSave={(user) => {
            handleCreateUser(user);
            setIsFormVisible(false);
          }}
          onCancel={() => setIsFormVisible(false)}
        />
      ) : (
        <Button title="Adicionar Novo Usuário" onPress={() => setIsFormVisible(true)} />
      )}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id?.toString() || new Date().getTime().toString()}
        renderItem={({ item }) => <UserRow user={item} onDelete={handleDeleteUser} />}
        refreshing={loading}
        onRefresh={fetchUsers}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
