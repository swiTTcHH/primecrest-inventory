import { Colors } from "@/lib/constants";
import { useTheme } from "@/lib/hooks/useTheme";

export const formatMoney = (amount: number) => {
	return new Intl.NumberFormat("NGN", {
		notation: "compact",
		compactDisplay: "short",
		minimumFractionDigits: 2,
		style: "currency",
		currency: "NGN",
	}).format(amount);
};

export const useThemeColors = () => {
	const theme = useTheme();
	const colors =
		typeof theme === "string"
			? theme === "light"
				? Colors.light
				: Colors.dark
			: theme;

	return colors;
};

export const generateSKU = (productName: string) => {
	const sku = productName
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, "-") // Replace any non-alphanumeric characters with -
		.replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
	return sku;
};


export const formatDate = (dateString:string) => {
  if (!dateString || dateString === "Unknown") return "Unknown";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};