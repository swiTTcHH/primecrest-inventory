import AdminProductCard from "@/components/AdminProductCard";
import CategoryDropdown from "@/components/CategoryDropdown";
import AddNewCategory from "@/components/modals/AddNewCategory";
import AddProduct from "@/components/modals/AddProduct";
import DeleteProduct from "@/components/modals/DeleteProduct";
import EditProduct from "@/components/modals/EditProduct";
import api from "@/lib/api";
import { ProductResponse } from "@/types/apiTypes";
import { PRODUCT } from "@/types/types";
import { useThemeColors } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const Products = () => {
  const theme = useThemeColors();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PRODUCT | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const queryClient = useQueryClient()

  const bottomSheetRef = useRef<BottomSheet>(null);
  const deleteRef = useRef<BottomSheet>(null)
  const addRef = useRef<BottomSheet>(null)
  const categoryRef = useRef<BottomSheet>(null)

  const closeModal = (ref: React.RefObject<BottomSheet | null>) => {
    setSelectedProduct(null)
    ref.current?.close()
  }

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("categories");
      return res.data;
    },
  });

  const renderRightAction = (product: PRODUCT) => {
    return (
      <View
        style={[
          {
            height: "80%",
            flexDirection: "row",
            gap: 8,
            marginVertical: "auto",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }
        ]}
      >
        <Pressable
          style={({ pressed }) => [ styles.swipeButton,
            {backgroundColor: theme.accent,},
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => { setSelectedProduct(product); setIsEditOpen(true); bottomSheetRef.current?.expand() }}
        >
          <Text
            style={[
              {
                color: theme.text,
                fontWeight: "bold",
                fontSize: 20,
              },
            ]}
          >
            Edit
          </Text>
          <Ionicons
            name="pencil-outline"
            size={16}
            color={theme.text}
          />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.swipeButton,
            { backgroundColor: "red", marginRight: 4 },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => { setSelectedProduct(product); setDeleteOpen(true); deleteRef.current?.expand() }}
        >
          <Text
            style={[
              {
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
              },
            ]}
          >
            Delete
          </Text>
          <Ionicons
            name="trash"
            size={16}
            color={theme.text}
          />
        </Pressable>
      </View>
    );
  };

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ["products", searchTerm] });
  };

  const {
    data: products,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductResponse, AxiosError>({
    queryKey: ["products", searchTerm, category],
    queryFn: async ({ pageParam = 1 }) => {
      const response = (await api.get("/products", {
        params: { limit: 10, page: pageParam, search: searchTerm, ...(category && { category: category }) },
      })) as ProductResponse;
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Stack.Screen options={{ headerTitle: "Product Management" }} />
      
      <View style={{ paddingHorizontal:10, marginBottom: 20, gap: 10 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* search bar */}
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

        {/* categories and add new category */}
        {categoriesLoading ? <ActivityIndicator size="large" color={theme.text} /> : 
        <>
          <View style={{ marginTop: 10, paddingVertical: 15}}>
            <CategoryDropdown setCategory={setCategory} category={category} resultDisabled/>
          </View>

          <Pressable onPress={() => {
            categoryRef.current?.expand();
            setIsCategoryOpen(true);
          }} style={{paddingVertical: 12}}>
            <Text style={{fontSize: 16, color: theme.text, fontWeight: "bold", textAlign: "right", textDecorationLine: "underline", textDecorationColor: theme.text}}>Add New Category</Text>
          </Pressable>
        </>
          }
      </View>

      {isLoading ? <ActivityIndicator size={"large"} color="white" /> : <FlatList
        data={products?.pages.flatMap((page) => page.data) || []}
        keyExtractor={(item) => item?._id}
        contentContainerStyle={{opacity: isEditOpen || deleteOpen || isAddOpen ? 0.2 : 1}}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightAction(item)}>
            <AdminProductCard product={item} />
          </Swipeable>

        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage && hasNextPage ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 30,
              }}
            >
              <ActivityIndicator
                size="large"
                color="#000000"
              />
            </View>
          ) : null
        }
      />}

      <Pressable
        onPress={() => {setIsAddOpen(true); addRef.current?.expand()}}
        style={[
          styles.addProductButton,
          { backgroundColor: theme.accentDark },
        ]}
      >
        <Ionicons name="add-outline" size={24} color={"white"} />
      </Pressable>

      {/* Edit Product */}
      <BottomSheet
        ref={bottomSheetRef}
        onClose={() => { setIsEditOpen(false); setSelectedProduct(null); }}
        snapPoints={["60%"]}
        index={-1}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.backgroundElement }}
      >
        <BottomSheetView>
          {selectedProduct && <EditProduct product={selectedProduct} onClose={()=>closeModal(bottomSheetRef)} />}
        </BottomSheetView>
      </BottomSheet>
      
      {/* Delete Product */}
      <BottomSheet
        ref={deleteRef}
        onClose={() => { setDeleteOpen(false); setSelectedProduct(null); }}
        snapPoints={["28%"]}
        index={-1}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.backgroundElement }}
      >
        <BottomSheetView>
          {selectedProduct && <DeleteProduct product={selectedProduct} onClose={()=>closeModal(deleteRef)} />}
        </BottomSheetView>
      </BottomSheet>
      
      {/* Add Product */}
      <BottomSheet
        ref={addRef}
        onClose={() => setIsAddOpen(false)}
        snapPoints={["40%", "85%"]}
        index={-1}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.backgroundElement }}
      >
        {/* <BottomSheetView> */}
          {<AddProduct onClose={()=>closeModal(addRef)} />}
        {/* </BottomSheetView> */}
      </BottomSheet>
      
      {/* Add Category */}
      <BottomSheet
        ref={categoryRef}
        onClose={() => setIsCategoryOpen(false)}
        snapPoints={["40%"]}
        index={-1}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.backgroundElement }}
      >
        {/* <BottomSheetView> */}
          {<AddNewCategory onClose={()=>closeModal(categoryRef)} />}
        {/* </BottomSheetView> */}
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: "100%",
    // position: "relative"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addProductButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 12,
    borderRadius: "100%",
    // zIndex: 9999,
  },
  addProductText: {
    color: "#fff",
    fontWeight: "bold",
  },

  productList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  productStock: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#28A745",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  swipeButton: {
    flexDirection: "row", 
    gap: 8, 
    height: "100%", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 8, 
    borderRadius: 8,
  }
});
