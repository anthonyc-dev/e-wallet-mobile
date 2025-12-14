import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Transaction } from "@/types/types";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatDate, formatPHP } from "@/libs/utils";

interface TransactionProps {
  item: Transaction;
  onDelete: (id: string) => void;
}

// Map categories to their respective icons
export type Category =
  | "Food & Drinks"
  | "Shopping"
  | "Transportation"
  | "Entertainment"
  | "Bills"
  | "Income"
  | "Other";

export const CATEGORY_ICONS: Record<Category, string> = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Income: "cash",
  Other: "ellipsis-horizontal",
};

const TransactionItem = ({ item, onDelete }: TransactionProps) => {
  const isIncome = item.amount > 0;
  const iconName =
    item.category && item.category in CATEGORY_ICONS
      ? CATEGORY_ICONS[item.category as Category]
      : "pricetag-outline";

  return (
    <View style={styles.transactionCard} key={item.id}>
      <TouchableOpacity style={styles.transactionContent}>
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={iconName as any}
            size={22}
            color={isIncome ? COLORS.income : COLORS.expense}
          />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isIncome ? COLORS.income : COLORS.expense },
            ]}
          >
            {isIncome ? "+" : "-"} {formatPHP(Math.abs(item.amount ?? 0))}
          </Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id.toString())}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};

export default TransactionItem;
