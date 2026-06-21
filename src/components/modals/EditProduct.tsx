import { View, Text, StyleSheet, Pressable, ActivityIndicator, ToastAndroid } from 'react-native'
import React from 'react'
import { PRODUCT } from '@/types/types'
import { Controller, useForm } from 'react-hook-form'
import { useThemeColors } from '@/utils/helpers'
import { TextInput } from 'react-native-gesture-handler'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import api from '@/lib/api'
import { EditProductResponse } from '@/types/apiTypes'
import { AxiosError } from 'axios'

interface EditProductForm{
  name: string;
  price: number;
  stockQuantity: number;
  costPrice: number;
}

const EditProduct = ({product, onClose}: {product: PRODUCT, onClose: ()=> void}) => {
  const theme = useThemeColors()
  const styles = createStyles(theme)
  
  const queryClient = useQueryClient()

  const {control, handleSubmit, formState: {errors}} = useForm<EditProductForm>({
    defaultValues: {
      name: product?.name,
      price: product.price,
      stockQuantity: product.stockQuantity,
      costPrice: product.costPrice
    }
  })


  const {mutate, isPending} = useMutation<EditProductResponse, AxiosError<{message: string}>, EditProductForm>({
    mutationFn: async (data: EditProductForm) => {
      const response = await api.put(`products/${product._id}`, data)
      return response.data
    }, 
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["products"]}),
      onClose()
    },
    onError: (error) => {
      ToastAndroid.show(error.response?.data?.message || "Something went wrong", ToastAndroid.LONG)
      onClose()
    }
  })

  const onSubmit = (data: EditProductForm) => {
    mutate(data)
  }

  


  return (
    <View style={styles.container}>
      <Text style={[styles.heading]}>Edit Product</Text>

      <View style={styles.formContainer}>
        <Controller 
          control={control}
          name="name"
          render = {({field: {onChange, onBlur, value}}) => (
            <View>
              <Text style={styles.label}>Product Name</Text>
              <BottomSheetTextInput
                onChangeText={onChange}
                onBlur={onBlur} 
                placeholder='name'
                value={value}
                returnKeyType='next'
                style={[styles.input, { color: theme.text }]}

                placeholderTextColor={theme.text}
              />
            </View>
          )}
        />

        <Controller 
          control={control}
          name='price'
          render = {({field: {onChange, onBlur, value}}) => (
            <View>
              <Text style={styles.label}>Product Price</Text>
              <BottomSheetTextInput
                onChangeText={onChange}
                onBlur={onBlur} 
                placeholder='price'
                style={[styles.input, { color: theme.text }]}
                value={value.toString()}
                returnKeyType='next'
                placeholderTextColor={theme.text}
                keyboardType='numeric'
                />
            </View>
          )}
        />

        <Controller 
          control={control}
          name='stockQuantity'
          render = {({field: {onChange, onBlur, value}}) => (
            <View>
              <Text style={styles.label}>Stock Quantity</Text>
              <BottomSheetTextInput
                onChangeText={onChange}
                onBlur={onBlur} 
                style={[styles.input, { color: theme.text }]}
                placeholder='stockQuantity'
                value={value.toString()}
                returnKeyType='next'
                placeholderTextColor={theme.text}
                keyboardType='numeric'
                />
            </View>
          )}
        />
        <Controller 
          control={control}
          name='costPrice'
          render = {({field: {onChange, onBlur, value}}) => (
            <View>
              <Text style={styles.label}>Cost Price</Text>
              <BottomSheetTextInput
                onChangeText={onChange}
                onBlur={onBlur} 
                style={[styles.input, { color: theme.text }]}
                placeholder='Costprice'
                value={value.toString()}
                returnKeyType='next'
                placeholderTextColor={theme.text}
                keyboardType='numeric'
                />
            </View>
          )}
        />
      </View>

      <Pressable style={[styles.button, isPending && {opacity: 0.7, backgroundColor: theme.accent} ]} onPress={handleSubmit(onSubmit)} disabled={isPending}>
        {isPending ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Update</Text>}
      </Pressable>
    </View>
  )
}

const createStyles = (theme: any) =>StyleSheet.create({
  container: {
    padding: 40,
  },
  heading: {
    color: theme.text,
    fontWeight: "bold",
    fontSize: 24,
    paddingVertical: 10,
  },
  formContainer:{
    marginVertical: 10,
    gap: 10,
  },
  label: {
    color: "#dbd9d9ff",
    fontSize: 16,
  },
  input: {
		borderColor: "gray",
		borderWidth: 1,
		padding: 12,
    fontSize: 18,
		marginVertical: 4,
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
	},
})

export default EditProduct