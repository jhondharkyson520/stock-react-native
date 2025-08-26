import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useStockMovement } from "../hooks/useStockMovement";

export function MainHomeScreen() {
  const { costByMonthUseStockMovement, firstYear, costPerYearUseStockMovement, rankingProductsInStockUseStockMovement, highRotationProductsUseStockMovement } = useStockMovement();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [monthlyCost, setMonthlyCost] = useState<number | null>(null);
  const [yearCost, setYearCost] = useState<number | null>(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const [rankingProductsInStock, setRankingProductsInStock] = useState<{product_id: string; name: string; total_added: number}[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [loadingHighRotation, setLoadingHighRotation] = useState(false);
  const [highRotationProducts, setHighRotationProducts] = useState<{ product_id: string; name: string; total_movement: number }[]>([]);

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

  const fetchRankingProductsInStock = async () => {
    try {
      setLoadingRanking(true);
      const products_added = await rankingProductsInStockUseStockMovement();
      setRankingProductsInStock(products_added);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Erro ao buscar custo");
      setRankingProductsInStock([]);
    } finally {
      setLoadingRanking(false);
    }
  };
  
  const fetchHighRotationProducts = async () => {
    try {
      setLoadingHighRotation(true);
      const productsHighRotationResult = await highRotationProductsUseStockMovement();
      setHighRotationProducts(productsHighRotationResult);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Erro ao buscar custo");
      setHighRotationProducts([]);
    } finally {
      setLoadingHighRotation(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCost();
      fetchCostPerYear();
      fetchRankingProductsInStock();
      fetchHighRotationProducts();
    }, [month, year])
  );

  return (
    <ScrollView style={styles.container}>
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

      {loadingRanking && <Text>Carregando ranking...</Text>}
      {!loadingRanking && rankingProductsInStock.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.cost}>Ranking de produtos que mais entram em estoque:</Text>
          {rankingProductsInStock.map((item, index) => (
            <Text key={item.product_id} style={styles.cost}>
              {index + 1}. {item.name} - {item.total_added}
            </Text>
          ))}
        </View>
      )}

      

      {loadingHighRotation && <Text>Carregando rotation os products...</Text>}
      {!loadingHighRotation && highRotationProducts.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.cost}>Produtos com mais rotatividade em estoque</Text>
          {highRotationProducts.map((item, index) => (
            <Text key={item.product_id} style={styles.cost}>
              {index + 1}. {item.name} - {item.total_movement}
            </Text>
          ))}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
  pickerContainer: { flexDirection: "row", marginBottom: 20, justifyContent: "space-between", width: "80%" },
  picker: { flex: 1, height: 50 },
  cost: { marginTop: 20, fontSize: 18, fontWeight: "bold", color: "#1a73e8" },
  error: { marginTop: 20, color: "red" },  
});
