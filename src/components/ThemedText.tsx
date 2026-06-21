import { Text, View } from 'react-native'
import { useTheme } from '@/lib/hooks/useTheme'
import { Colors, ThemeColor } from '@/lib/constants'

const ThemedText = (props: { children: React.ReactNode; bold?: boolean; size?: "sm" | "md" | "lg" }) => {
    const {children, bold, size} = props;
    const theme = useTheme();

    const themeColor = theme === "light" ? Colors.light : Colors.dark;

    const fontSize = size === "sm" ? 14 : size === "md" ? 16 : 18;
  
    return (
        <Text style={{color: themeColor.text, fontSize, fontWeight: bold ? "bold" : "normal"}}>{children}</Text>
    )
}

export default ThemedText