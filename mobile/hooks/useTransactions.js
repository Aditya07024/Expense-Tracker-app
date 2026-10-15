// react custom hook file

import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch summary");
      const data = await response.json();
      setSummary(data || { balance: 0, income: 0, expenses: 0 });
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    // 1. Instant optimistic update: remove transaction from list immediately
    const prevTransactions = transactions;
    setTransactions((prev) => prev.filter((item) => item.id !== id));

    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete transaction");

      // 2. Fetch updated summary and transactions in background
      await loadData();
    } catch (error) {
      // Rollback on failure
      setTransactions(prevTransactions);
      console.error("Error deleting transaction:", error);
      const errorMsg = error.message || "Failed to delete transaction";
      if (Platform.OS === "web") {
        alert(errorMsg);
      } else {
        Alert.alert("Error", errorMsg);
      }
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};