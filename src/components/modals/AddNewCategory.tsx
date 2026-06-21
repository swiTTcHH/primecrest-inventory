import api from '@/lib/api'
import { AddCategoryResponse } from '@/types/apiTypes'
import { useThemeColors } from '@/utils/helpers'
import { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, View, Text, Pressable, ActivityIndicator, ToastAndroid } from 'react-native'

interface AddNewCategoryForm {
    categoryName: string
    
}

const AddNewCategory = ({onClose}: {onClose: ()=> void}) => {
   
    const queryClient = useQueryClient()

    const {control, handleSubmit, formState: {errors}, reset} = useForm<AddNewCategoryForm>({
        defaultValues: {
            categoryName: ""
        }
    })

    const theme = useThemeColors()
    const styles = createStyles(theme)

    const {mutate, isPending} = useMutation<AddCategoryResponse, AxiosError<{message: string}>, AddNewCategoryForm>({
        mutationFn: async (data: AddNewCategoryForm) => {
            const response = await api.post("category", data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            reset()
            onClose()
        },
        onError: (error) => {
            ToastAndroid.show(
                error.response?.data?.message || "Something went wrong",
                ToastAndroid.LONG,
            )
            reset()
            onClose()
        },
    })

    const onSubmit = (data: AddNewCategoryForm) => {
        mutate(data)
    }

  return (
    <BottomSheetScrollView style={styles.container}>
        <Text style={[styles.heading]}>Add New Category</Text>

        <Controller
            control={control}
            rules={{ required: "Category Name is required" }}
            name="categoryName"
            render={({ field: { onChange, onBlur, value } }) => (
                <View>
                    <Text style={styles.label}>
                        Category Name
                    </Text>
                    <BottomSheetTextInput
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Category Name"
                        style={[
                            styles.input,
                            { color: theme.text },
                        ]}
                        value={value.toString()}
                        returnKeyType="go"
                        returnKeyLabel='Submit'
                        onSubmitEditing={handleSubmit(onSubmit)}
                        placeholderTextColor={"gray"}
                    />
                    {errors.categoryName && (
                        <Text style={styles.errorText}>
                            {errors.categoryName.message}
                        </Text>
                    )}
                </View>
            )}
        />
        <Pressable
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Category</Text>
        )}
      </Pressable>
    </BottomSheetScrollView>
  )
}

const createStyles = (theme: any)=> StyleSheet.create({
    container: {
			padding: 40,
			gap: 12,
		},
		heading: {
			color: theme.text,
			fontWeight: "bold",
			fontSize: 24,
		},
		formContainer: {
			marginVertical: 10,
			gap: 10,
		},
		label: {
			color: "#dbd9d9ff",
			marginVertical: 5,
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
		errorText: {
			color: "red",
			fontSize: 12,
			marginTop: 4,
			marginLeft: 4,
		},
})

export default AddNewCategory
