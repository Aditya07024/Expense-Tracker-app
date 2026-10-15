import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useFocusEffect, useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useCallback, useState } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/transactionItem";
import NoTransactionsFound from "../../components/NoTransactionFound";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user?.id);

  // Automatically refresh data whenever this screen is focused (e.g. returning from Create screen)
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        loadData();
      }
    }, [loadData, user?.id])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete this transaction?")) {
        deleteTransaction(id);
      }
    } else {
      Alert.alert("Delete", "Are you sure you want to delete?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ]);
    }
  };

  if (isLoading && !refreshing && transactions.length === 0) return <PageLoader />;

  const username = user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "User";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* Left */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>{username}</Text>
            </View>
          </View>
          {/* Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
        <BalanceCard summary={summary} />
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
