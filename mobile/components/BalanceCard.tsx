import { View, Text } from "react-native";
import React from "react";
import { TransactionSummary } from "@/types/types";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { formatPHP } from "@/libs/utils";

interface BalanceCardProps {
  summary: TransactionSummary;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ summary }) => {
  return (
    <View>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          {formatPHP(Math.abs(summary?.balance ?? 0))}
        </Text>
        <View style={styles.balanceStats}>
          <View style={styles.balanceStatItem}>
            <Text style={styles.balanceStatLabel}>Income</Text>
            <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
              {formatPHP(Math.abs(summary?.income ?? 0))}
            </Text>
          </View>
          <View style={[styles.balanceStatItem, styles.statDivider]} />
          <View style={styles.balanceStatItem}>
            <Text style={styles.balanceStatLabel}>Expenses</Text>
            <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
              - {formatPHP(Math.abs(summary?.expenses ?? 0))}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BalanceCard;
