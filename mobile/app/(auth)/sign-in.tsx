import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { styles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded || loading) return;
    setError("");
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        // Successful login, set session active
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(
          "Sign-in incomplete:",
          JSON.stringify(signInAttempt, null, 2)
        );
        setError("Additional steps are required to sign in. Check your email.");
      }
    } catch (err: any) {
      console.error(err);

      // Clerk structured error handling
      if (err?.errors?.[0]?.code === "form_identifier_not_found") {
        setError("Email not registered. Please sign up first.");
      } else if (err?.errors?.[0]?.code === "form_password_incorrect") {
        setError("Incorrect password. Please try again.");
      } else if (err?.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={100}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity
          onPress={onSignInPress}
          style={[styles.button, loading && { opacity: 0.6 }]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              "Sign In"
            )}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href={"/(auth)/sign-up"} asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
