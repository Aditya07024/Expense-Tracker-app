import { useClerk } from "@clerk/clerk-expo";
import { Alert, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { styles } from "../assets/styles/home.styles";
import { useRouter } from "expo-router";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const performSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleSignOut = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to logout?")) {
        performSignOut();
      }
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: performSignOut,
        },
      ]);
    }
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};