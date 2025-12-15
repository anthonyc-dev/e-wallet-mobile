import { Platform } from "react-native";
import Constants from "expo-constants";

// Get API URL based on platform and environment
export const getApiUrl = () => {
  // Check for environment variable first
  const envApiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (envApiUrl) return envApiUrl;

  // Platform-specific defaults
  // Android emulator uses 10.0.2.2 to access host machine's localhost
  // iOS simulator can use localhost
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${host}:5001/api`;
};
