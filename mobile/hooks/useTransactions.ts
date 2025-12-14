import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = "http://localhost:5001/api";

export const useTransactions = (userID: string) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/getTransaction/${userID}`);

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userID]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/getUserSummary/${userID}`);

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userID]);

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

  const deleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/deleteTransaction/${id}`);

      if (!response.ok) throw new Error("Failed to delete transaction");

      loadData();

      Alert.alert("Success", "Trasaction deleted successfully");
    } catch (error: any) {
      console.error("Error deleting trasaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  //2:52:36
  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
