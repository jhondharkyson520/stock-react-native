import { Product } from "@/_src/domain/models/Products";
import { RootStackParamList } from "@/App";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductRowProps {
  product: Product;
  onDelete: (id: string) => void;
}

type ProductRowScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsListScreen"
>;

export function ProductRow({ product, onDelete }: ProductRowProps) {
  const navigation = useNavigation<ProductRowScreenNavigationProp>();

  const deleteProduct = async () => {
    if (!product.id) return;
    try {
      await onDelete(product.id);
      Alert.alert("Success", "Product deleted successfully");
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to delete product");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {product.image !== "blank" ? (
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}
        <Text style={styles.detail}>R${Number(product.value).toFixed(2)}</Text>
        <Text style={styles.detail}>Qtd: {product.qtd}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (!product.id) {
                Alert.alert("Invalid Product", "Product ID is missing");
                return;
              }
              navigation.navigate("ProductEditScreen", { productId: product.id });
            }}
            accessibilityLabel={`Edit product ${product.name}`}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteProduct}
            accessibilityLabel={`Delete product ${product.name}`}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    marginRight: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  placeholderText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
    lineHeight: 20,
  },
  detail: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});