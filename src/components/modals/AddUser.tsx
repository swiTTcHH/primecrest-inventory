import api from "@/lib/api";
import { useThemeColors } from "@/utils/helpers";
import {useState} from "react";
import { BottomSheetTextInput, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import Select from "../Select";

type UserFormData = {
  name: string;
  email: string;
  role: string;
  password: string;
};

const AddUser = ({ onClose }: { onClose: () => void }) => {
  const theme = useThemeColors();
  const [showPassword, setShowPassword] = useState(false);
  const styles = createStyles(theme);

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      role: "shopkeeper",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation<
    any,
    AxiosError<{ message: string }>,
    UserFormData
  >({
    mutationFn: async (data) => {
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role || "shopkeeper",
        password: data.password,
      };

      const response = await api.post("/users", payload)
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["usersReport"] });
      ToastAndroid.show("User created successfully", ToastAndroid.LONG);
      reset();
      onClose();
    },
    onError: (error) => {
      ToastAndroid.show(
        error.response?.data?.message || "Failed to create user",
        ToastAndroid.LONG
      );
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (!data.name.trim()) {
      setError("name", { message: "Name is required" });
      return;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("email", { message: "Enter a valid email address" });
      return;
    }
    if (!data.password || data.password.length < 8 || !/^.*[^A-Za-z0-9].*$/.test(data.password)) {
      setError("password", { message: "Password must be at least 8 characters with a special symbol" });
      return;
    }
    mutate(data);
  };

  return (
    <BottomSheetScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.heading]}>Create User</Text>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          rules={{ required: "Name is required" }}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.label}>Full Name</Text>
              <BottomSheetTextInput
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="John Doe"
                value={value}
                returnKeyType="next"
                style={[styles.input, { color: theme.text }]}
                placeholderTextColor={"gray"}
              />
              {errors.name && (
                <Text style={[styles.errorText]}>{errors.name.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          rules={{ required: "Email is required" }}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.label}>Email Address</Text>
              <BottomSheetTextInput
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="example@mail.com"
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                style={[styles.input, { color: theme.text }]}
                placeholderTextColor={"gray"}
              />
              {errors.email && (
                <Text style={[styles.errorText]}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          rules={{ required: "Password is required" }}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.label}>Password</Text>
              
              <View style={[styles.input, {flexDirection: "row", alignItems: "center", gap: 5}]}>
                
                <BottomSheetTextInput
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Password (min 8 characters)"
                  value={value}
                  secureTextEntry = {showPassword}
                  autoCapitalize="none"
                  returnKeyType="next"
                  style={[{ color: theme.text, flex: 1 }]}
                  placeholderTextColor={"gray"}
                  />

                  <Pressable onPress={() => setShowPassword(prev => !prev)}>
                      <Text style={[styles.errorText]}>{showPassword ? "Hide" : "Show"}</Text>
                  </Pressable>
                
              </View>
              {errors.password && (
                <Text style={[styles.errorText]}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value } }) => (
            <View style={{ height: 90 }}>
              <Select
                data={[
                  { name: "User", value: "shopkeeper" },
                  { name: "Admin", value: "admin" },
                ]}
                value={value}
                setValue={onChange}
                identifier="value"
                resultDisabled
                label="User Role"
                defaultLabel="Select Role"
              />
            </View>
          )}
        />
      </View>

      <Pressable
        style={[
          styles.button,
          isPending && {
            opacity: 0.7,
            backgroundColor: theme.accent,
          },
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create User</Text>
        )}
      </Pressable>
    </BottomSheetScrollView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 30,
    },
    heading: {
      color: theme.text,
      fontWeight: "bold",
      fontSize: 24,
      marginBottom: 10,
    },
    formContainer: {
      marginVertical: 10,
      gap: 8,
    },
    label: {
      color: theme.textSecondary || "#dbd9d9ff",
      marginVertical: 4,
      fontSize: 14,
      fontWeight: "600",
    },
    input: {
      borderColor: "gray",
      borderWidth: 1,
      padding: 10,
      fontSize: 16,
      borderRadius: 8,
    },
    button: {
      padding: 12,
      marginTop: 20,
      borderRadius: 8,
      alignItems: "center",
      backgroundColor: theme.accentDark,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginTop: 2,
      marginLeft: 4,
    },
  });

export default AddUser;
