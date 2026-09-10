import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

const BIOMETRIC_ENABLED_KEY = "biometric-unlock-enabled";

export const isBiometricUnlockEnabled = async () => (await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY)) === "true";

export const setBiometricUnlockEnabled = async (enabled: boolean) => {
	if (enabled) {
		await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, "true");
	} else {
		await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
	}
};

export const canUseBiometrics = async () => {
	if (Platform.OS === "web") return false;

	const hasHardware = await LocalAuthentication.hasHardwareAsync();
	const isEnrolled = await LocalAuthentication.isEnrolledAsync();
	return hasHardware && isEnrolled;
};

export const authenticateWithBiometrics = () =>
	LocalAuthentication.authenticateAsync({
		promptMessage: "Unlock PrimeCrest Inventory",
		promptDescription: "Confirm your identity to continue",
		cancelLabel: "Cancel",
	});


