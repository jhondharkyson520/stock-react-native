import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useStockMovement } from "../hooks/useStockMovement";

export function MainHomeScreen() {
  const { costByMonthUseStockMovement, firstYear, costPerYearUseStockMovement } = useStockMovement();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [monthlyCost, setMonthlyCost] = useState<number | null>(null);
  const [yearCost, setYearCost] = useState<number | null>(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const fetchCost = async () => {
    try {
      setLoading(true);
      const total = await costByMonthUseStockMovement(month, year);
      setMonthlyCost(total);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Erro ao buscar custo");
      setMonthlyCost(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCostPerYear = async () => {
    try {
      setLoading(true);
      const total_cost = await costPerYearUseStockMovement(year);
      setYearCost(total_cost);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Erro ao buscar custo");
      setYearCost(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCost();
      fetchCostPerYear();
    }, [month, year])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Sistema de Estoque</Text>
      <Text style={styles.subtitle}>Selecione o mês e ano para ver o custo total:</Text>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={month} onValueChange={(value) => setMonth(value)} style={styles.picker}>
          {Array.from({ length: 12 }, (_, i) => (
            <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
          ))}
        </Picker>

        <Picker selectedValue={year} onValueChange={(value) => setYear(value)} style={styles.picker}>
          {firstYear !== null &&
            Array.from({ length: currentYear - firstYear + 1 }, (_, i) => {
              const y = firstYear + i;
              return <Picker.Item key={y} label={`${y}`} value={y} />;
            })}
        </Picker>
      </View>

      <Button title="Buscar custo mensal" onPress={fetchCost} />

      {loading && <Text>Carregando...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {monthlyCost !== null && !loading && !error && (
        <Text style={styles.cost}>Custo total do mês: R$ {monthlyCost.toFixed(2)}</Text>
      )}
      
      <Text style={styles.subtitle}>Selecione o ano para ver o custo total:</Text>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={year} onValueChange={(value) => setYear(value)} style={styles.picker}>
          {firstYear !== null &&
            Array.from({ length: currentYear - firstYear + 1 }, (_, i) => {
              const y = firstYear + i;
              return <Picker.Item key={y} label={`${y}`} value={y} />;
          })}
        </Picker>
      </View>

      <Button title="Buscar custo anual" onPress={fetchCostPerYear} />

      {loading && <Text>Carregando...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {yearCost !== null && !loading && !error && (
        <Text style={styles.cost}>Custo total do ano: R$ {yearCost.toFixed(2)}</Text>
      )}     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
  pickerContainer: { flexDirection: "row", marginBottom: 20, justifyContent: "space-between", width: "80%" },
  picker: { flex: 1, height: 50 },
  cost: { marginTop: 20, fontSize: 18, fontWeight: "bold", color: "#1a73e8" },
  error: { marginTop: 20, color: "red" },  
});
