import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

import { RootStackParamList } from "@/App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useStockMovement } from "../hooks/useStockMovement";


interface Product {
    product_id: string;
    name: string;
    total_added?: number;
    total_movement?: number;
    last_movement?: string | null;
}

type DashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DashboardScreen"
>;

export function DashboardScreen() {
    const {
        costByMonthUseStockMovement,
        firstYear,
        costPerYearUseStockMovement,
        rankingProductsInStockUseStockMovement,
        highRotationProductsUseStockMovement,
        productsWithoutRecentMovementUseStockMovement
    } = useStockMovement();

    const { width: screenWidth } = useWindowDimensions();

    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());

    const [monthlyCost, setMonthlyCost] = useState<number | null>(null);
    const [yearCost, setYearCost] = useState<number | null>(null);

    const [rankingProducts, setRankingProducts] = useState<Product[]>([]);
    const [highRotationProducts, setHighRotationProducts] = useState<Product[]>([]);
    const [noMovementProducts, setNoMovementProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(false);
    const [monthlyChartData, setMonthlyChartData] = useState<any>(null);
    const navigation = useNavigation<DashboardNavigationProp>();

    const fetchMainData = async () => {
        setLoading(true);
        try {
            const [costM, costY, ranking, highRot, noMove] = await Promise.all([
                costByMonthUseStockMovement(month, year),
                costPerYearUseStockMovement(year),
                rankingProductsInStockUseStockMovement(),
                highRotationProductsUseStockMovement(),
                productsWithoutRecentMovementUseStockMovement()
            ]);

            setMonthlyCost(costM);
            setYearCost(costY);
            setRankingProducts(ranking);
            setHighRotationProducts(highRot);
            setNoMovementProducts(noMove);
        } catch (e: any) {
            console.log("Erro ao buscar dados:", e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthlyChart = async () => {
        try {
            const costs = await Promise.all(
                Array.from({ length: 12 }, (_, i) => costByMonthUseStockMovement(i + 1, year))
            );

            setMonthlyChartData({
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                datasets: [{ data: costs }],
            });
        } catch (e: any) {
            console.log("Erro ao buscar gráfico mensal:", e.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMainData();
        }, [month, year])
    );

    useEffect(() => {
        fetchMonthlyChart();
    }, [year]);

    const formatCurrency = (value: number | null) =>
        value !== null ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value) : "-";

    

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <Text style={styles.title}>Dashboard do Estoque</Text>

            {/* Botões de Navegação */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.buttonCard, { backgroundColor: "#1a73e8" }]}
                    onPress={() => navigation.navigate("CreateEntryStockProductScreen")}
                >
                    <Text style={styles.buttonText}>Entrada</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonCard, { backgroundColor: "#34a853" }]}
                    onPress={() => navigation.navigate("CreateExitStockProductScreen")}
                >
                    <Text style={styles.buttonText}>Saída</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonCard, { backgroundColor: "#fbbc05" }]}
                    onPress={() => navigation.navigate("ProductCreateScreen")}
                >
                    <Text style={styles.buttonText}>Novo Produto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonCard, { backgroundColor: "#ea4335" }]}
                    onPress={() => navigation.navigate("ListOfProductsMinimumStockScreen")}
                >
                    <Text style={styles.buttonText}>Lista de Compras</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.pickerRow}>
                <View style={styles.pickerColumn}>
                    <Text>Mês</Text>
                    <Picker selectedValue={month} onValueChange={setMonth} style={styles.picker}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
                        ))}
                    </Picker>
                </View>

                {firstYear && (
                    <View style={styles.pickerColumn}>
                        <Text>Ano</Text>
                        <Picker selectedValue={year} onValueChange={setYear} style={styles.picker}>
                            {Array.from({ length: new Date().getFullYear() - firstYear + 1 }, (_, i) => {
                                const y = firstYear + i;
                                return <Picker.Item key={y} label={`${y}`} value={y} />;
                            })}
                        </Picker>
                    </View>
                )}
            </View>


            {loading && <ActivityIndicator size="large" color="#1a73e8" style={{ marginVertical: 20 }} />}

            <View style={styles.cardRow}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Custo Mensal</Text>
                    <Text style={styles.cardValue}>{formatCurrency(monthlyCost)}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Custo Anual</Text>
                    <Text style={styles.cardValue}>{formatCurrency(yearCost)}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Custos mensais de produtos</Text>
            {monthlyChartData && (
                <LineChart
                    data={monthlyChartData}
                    width={screenWidth - 40}
                    height={220}
                    yAxisLabel="R$ "
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#f0f0f0",
                        backgroundGradientTo: "#f0f0f0",
                        color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
                        strokeWidth: 2,
                    }}
                    style={{ borderRadius: 16, marginBottom: 20 }}
                />
            )}

            <Text style={styles.sectionTitle}>Ranking de Produtos que mais entram no Estoque</Text>
            <FlatList
                data={rankingProducts}
                keyExtractor={(item) => item.product_id?.toString() || Math.random().toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.productRow}>
                        <Text>{index + 1}. {item.name}</Text>
                        <Text>{item.total_added}</Text>
                    </View>
                )}
                scrollEnabled={false}
            />

            <Text style={styles.sectionTitle}>Produtos com Alta Rotatividade</Text>
            <ScrollView horizontal style={{ marginBottom: 20 }}>
                <BarChart
                    data={{
                        labels: highRotationProducts.map(p => p.name),
                        datasets: [{ data: highRotationProducts.map(p => p.total_movement || 0) }]
                    }}
                    width={Math.max(screenWidth, highRotationProducts.length * 60)}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
                        barPercentage: 0.5,
                    }}
                    style={{ borderRadius: 16 }} yAxisSuffix={""} />
            </ScrollView>

            <Text style={styles.sectionTitle}>Produtos sem movimentação nos últimos 30 dias</Text>
            <FlatList
                data={noMovementProducts}
                keyExtractor={(item, index) => item.product_id?.toString() || index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.productRow, { backgroundColor: "#ffe6e6" }]}>
                        <Text>{item.name}</Text>
                        <Text>{item.last_movement ?? "Nunca"}</Text>
                    </View>
                )}
                scrollEnabled={false}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    cardRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
    card: { flex: 1, backgroundColor: "#f0f4ff", padding: 15, borderRadius: 12, marginHorizontal: 5 },
    cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    cardValue: { fontSize: 18, color: "#1a73e8" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
    productRow: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 10,
    },
    pickerColumn: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: 1,
        marginHorizontal: 5,
    },
    picker: {
        width: '100%',
    },
    buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    flexWrap: "wrap", // permite quebrar a linha se não couber
    },
    buttonCard: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    marginBottom: 10,
    },
    buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    },
});
