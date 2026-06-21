import { View, Text, ActivityIndicator, FlatList, TextInput, Pressable } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import SingleProductCard from '@/components/SingleProductCard'
import { ProductResponse } from '@/types/apiTypes'
import { AxiosError } from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import Select from '@/components/Select'
import { useThemeColors } from '@/utils/helpers'
import CategoryDropdown from '@/components/CategoryDropdown'

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const queryClient = useQueryClient();

  const theme = useThemeColors()

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("categories");
      return res.data;
    },
  });

  const { data: products, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage,} = useInfiniteQuery<ProductResponse, AxiosError>({
    queryKey: ["products", searchTerm, category],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/products", { params: { limit: 10, page: pageParam, search: searchTerm, ...(category && { category: category }) } }) as ProductResponse;
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta?.page + 1;
      if (nextPage <= lastPage.meta?.totalPages) {
        return nextPage;
      }

      return undefined;
    },
  });

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ["products", searchTerm] });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ paddingHorizontal: "5%", marginVertical: 20, gap: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.text }}>Products</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>

          <View style={{ flex: 1, borderColor: theme.text, borderWidth: 1, padding: 12, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TextInput
              onChangeText={setSearchTerm}
              value={searchTerm}
              placeholder="Search"
              placeholderTextColor={theme.text}
              style={{ flex: 1, fontSize: 16, color: theme.text }}
              returnKeyType='search'
              clearButtonMode='while-editing'
              keyboardType='default'
              onSubmitEditing={handleSearch}
            />

            {searchTerm && searchTerm.length > 0 && (
              <Pressable onPress={() => {
                setSearchTerm("")
                queryClient.invalidateQueries({ queryKey: ["products"] });
              }}>
                <Ionicons name="close" size={24} color="red" />
              </Pressable>
            )}
          </View>
        </View>

        {categoriesLoading ? <ActivityIndicator size="large" color={theme.text} /> : <View style={{ marginTop: 10, paddingVertical: 15 }}><CategoryDropdown setCategory={setCategory} category={category} resultDisabled/></View>}
      </View>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: "100%" }}>
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      ) : (
        <FlatList
          data={products?.pages.flatMap((page) => page.data) || []}
          keyExtractor={item => item?._id}
          renderItem={({ item }) => (<SingleProductCard product={item} />)}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage && hasNextPage ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginVertical: 30 }}>
                <ActivityIndicator size="large" color="#000000" />
              </View>) : null
          }
        />
      )}
    </SafeAreaView>
  )
}

export default Shop