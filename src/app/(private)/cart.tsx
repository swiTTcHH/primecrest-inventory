import { View, Text,FlatList, Pressable, StyleSheet, TextInput, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { clearCart, removeFromCart, updateQuantity } from '@/store/slice/cartSlice'
import { formatMoney, useThemeColors } from '@/utils/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { RootState } from '@/store/storeTypes'
import api from '@/lib/api'

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cartStore);
  const theme = useThemeColors()
  const dispatch = useDispatch();
  const queryClient = useQueryClient()

  const {mutate, isPending} = useMutation({
    mutationFn: async () => {
      const payload = cart.cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        unitPrice: item.product.price
      }))

      const res = await api.post("/sales", {
        items: payload,
        discount: 0
      })
      return res.data
    },
    onSuccess: (data) => {
      ToastAndroid.show(
        `Purchased successful`,
        ToastAndroid.LONG
      )
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // queryClient.invalidateQueries({ queryKey: ["admin products"] });
      dispatch(clearCart())
    },
    onError: (error) => {
      ToastAndroid.show(
        error.message ||
        `Purchased failed: ${error.message}`,
        ToastAndroid.LONG
      )
    }

  })

  const handleCheckout = () => {
    mutate()
  }

  return (
    <SafeAreaView style={{flex: 1, height: "100%", backgroundColor: theme.background}}>
      <Text style={{textAlign: "center", fontSize: 24, fontWeight: "bold", paddingVertical: 10, color: theme.text}}>My Cart</Text>
      <View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10,borderBottomWidth: 1, borderBottomColor: theme.text}}>
        <Text style={{fontSize: 16, fontWeight: "600", color: theme.text}}>Total Amount:</Text>
        <Text style={{fontSize: 16, fontWeight: "600", color: theme.text}}>{formatMoney(cart?.cartTotalAmount) || 0}</Text>
      </View>

      <FlatList
        data={cart?.cartItems || []}
        keyExtractor={(item) => item.product._id}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, {"justifyContent": "space-between", "alignItems": "center","flexDirection": "row", backgroundColor: theme.backgroundElement}]}>
            <View>
              <Text style={[styles.productName, {color: theme.text}]}>{item.product.name}</Text>
              <Text style={{color: theme.text}}>{formatMoney(item.product.price)}</Text>
              <View style={[styles.quantityContainer]}>
                  <Pressable 
                    onPress={() => 
                      dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity - 1, stockQuantity: item.product.stockQuantity }))
                    }
                    disabled={item.quantity === 1}
                    style={({pressed}) => [styles.quantityButton, pressed && {opacity: 0.7}, {backgroundColor: theme.background}]}
                  >
                    <Text style={[styles.quantityButtonText, {color: theme.text}]}>-</Text>
                  </Pressable>
                  <TextInput value={item.quantity.toString()} 
                    keyboardType='number-pad'
                    onChangeText={(e) => {
                      const num = parseInt(e)
                      if (num > 0) {
                        dispatch(updateQuantity({ productId: item.product._id, quantity: num, stockQuantity: item.product.stockQuantity }))
                      } else {
                        dispatch(updateQuantity({ productId: item.product._id, quantity: 0, stockQuantity: item.product.stockQuantity }))
                        // dispatch(removeFromCart(item.product._id))
                      }
                    }}
                    onSubmitEditing={()=>{
                      if(item.quantity === 0){
                        dispatch(removeFromCart(item.product._id))
                      }
                    }}
                    style={[styles.quantityText, {color: theme.text, backgroundColor: theme.background}]}>
                  </TextInput>
                  <Pressable 
                    onPress={() => 
                      dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity + 1, stockQuantity: item.product.stockQuantity }))
                    }
                    style={({pressed}) => [styles.quantityButton, pressed && {opacity: 0.7}, {backgroundColor: theme.background}]}
                  >
                    <Text style={[styles.quantityButtonText, {color: theme.text}]}>+</Text>
                  </Pressable>
                </View>
              </View>
              <Pressable 
                onPress={() => dispatch(removeFromCart(item.product._id))}
                style={({pressed}) => [styles.removeButton, pressed && {opacity: 0.7}]}
              >
                <Ionicons name="trash-outline" size={24} color="#ef4444" />
              </Pressable>
            </View>
          )}
        />
        {cart?.cartItems.length > 0 && (
          <View style={{gap: 2, marginBottom: 5, flexDirection: "row"}}>
            <Pressable 
              onPress={() => {
                dispatch(clearCart());
              }}
              style={({pressed}) => [styles.checkoutButton, pressed && {opacity: 0.7}, {backgroundColor: theme.backgroundElement}]}
              >
              <Text style={styles.checkoutButtonText}>Clear Cart</Text>
            </Pressable>

            <Pressable 
              style={({pressed}) => [styles.checkoutButton, pressed && {opacity: 0.7}, {backgroundColor: theme.accent}, isPending && {opacity: 0.7}]}
              onPress={handleCheckout}
              disabled={isPending || cart.cartItems.length === 0}
            >
              {isPending ? <ActivityIndicator color={theme.text} /> : <Text style={styles.checkoutButtonText}>Checkout</Text>}
            </Pressable>
            
          </View>  
        )}
    </SafeAreaView>
  )
}

export default Cart

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    gap: 8,
    marginTop: 8,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 32,
    textAlign: "center",
  },
  removeButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    padding: 4,
  },
  checkoutButton: {
    backgroundColor: "#012849",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: "auto"
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  
});