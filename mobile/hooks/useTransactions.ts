import { Transaction, TransactionSummary } from "@/types/types";
import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";

export type UseTransactionsReturn = {
  transactions: Transaction[];
  summary: TransactionSummary;
  isLoading: boolean;
  loadData: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
};

// Get API URL based on platform and environment
const getApiUrl = () => {
  // Check for environment variable first
  const envApiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (envApiUrl) return envApiUrl;

  // Platform-specific defaults
  // Android emulator uses 10.0.2.2 to access host machine's localhost
  // iOS simulator can use localhost
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${host}:5001/api`;
};

const API_URL = getApiUrl();

export const useTransactions = (userID: string): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  //fetch transaction
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/getTransaction/${userID}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  }, [userID]);

  //fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/getUserSummary/${userID}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch summary: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary({ balance: 0, income: 0, expenses: 0 });
    }
  }, [userID]);

  //load data
  const loadData = useCallback(async () => {
    if (!userID) return;

    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error load data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userID]);

  //delete transactions
  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/deleteTransaction/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete transaction: ${response.status}`
        );
      }

      await loadData();

      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message || "Failed to delete transaction");
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
