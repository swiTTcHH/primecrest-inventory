import AdminSalesCard from '@/components/AdminSalesCard'
import type { DailySalesData, WeeklySalesData } from '@/components/AdminSalesCard'
import api from '@/lib/api'
import { useThemeColors } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { ScrollView, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Sales = () => {
  const theme = useThemeColors()

  const { data: todaySales, isLoading: todayLoading } = useQuery<DailySalesData>({
    queryKey: ["todaySales"],
    queryFn: async () => {
      const res = await api.get("sales/daily")
      return res.data
    }
  })

  const { data: weeklySales, isLoading: weeklyLoading } = useQuery<WeeklySalesData>({
    queryKey: ["weeklySales"],
    queryFn: async () => {
      const res = await api.get("sales/weekly")
      return res.data
    }
  })

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: true, headerTitle: "Sales Stats" }} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.heading, { color: theme.text }]}>Sales</Text>

        <AdminSalesCard
          variant="daily"
          data={todaySales}
          isLoading={todayLoading}
        />

        <AdminSalesCard
          variant="weekly"
          data={weeklySales}
          isLoading={weeklyLoading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 20,
  },
})

export default Sales