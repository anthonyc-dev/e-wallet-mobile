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
  const balance = Math.abs(summary?.balance ?? 0);
  const income = Math.abs(summary?.income ?? 0);
  const expenses = Math.abs(summary?.expenses ?? 0);
  const net = income - expenses;
  const isPositiveNet = net >= 0;

  return (
    <View>
      <View style={styles.balanceCard}>
        <View style={styles.balanceAccent} />
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceTitle}>Total Balance</Text>
          <View style={styles.balanceBadge}>
            <Text style={styles.balanceBadgeText}>Cash flow</Text>
          </View>
        </View>

        {/* commient */}
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>{formatPHP(balance)}</Text>
          <View
            style={[
              styles.netBadge,
              isPositiveNet ? styles.netBadgePositive : styles.netBadgeNegative,
            ]}
          >
            <Text
              style={[
                styles.netBadgeText,
                isPositiveNet
                  ? styles.netBadgeTextPositive
                  : styles.netBadgeTextNegative,
              ]}
            >
              {isPositiveNet ? "↑" : "↓"} {formatPHP(Math.abs(net))}
            </Text>
          </View>
        </View>

        <View style={styles.netRow}>
          <Text style={styles.netLabel}>Net this period</Text>
          <Text
            style={[
              styles.netAmount,
              { color: isPositiveNet ? COLORS.income : COLORS.expense },
            ]}
          >
            {isPositiveNet ? "On track" : "Review spend"}
          </Text>
        </View>

        <View style={styles.balanceStats}>
          <View style={styles.balanceStatItem}>
            <View style={[styles.statIcon, styles.statIconIncome]}>
              <Text style={styles.statIconSymbol}>↑</Text>
            </View>
            <Text style={styles.balanceStatLabel}>Income</Text>
            <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
              {formatPHP(income)}
            </Text>
          </View>

          <View style={[styles.balanceStatItem, styles.statDivider]} />

          <View style={styles.balanceStatItem}>
            <View style={[styles.statIcon, styles.statIconExpense]}>
              <Text style={styles.statIconSymbol}>↓</Text>
            </View>
            <Text style={styles.balanceStatLabel}>Expenses</Text>
            <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
              - {formatPHP(expenses)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BalanceCard;
