import { Pressable, Text, StyleSheet, View, ToastAndroid } from 'react-native'
import { PRODUCT } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/slice/cartSlice'
import { formatMoney, useThemeColors } from '@/utils/helpers'

const SingleProductCard = ({product}: {product: PRODUCT}) => {
  const theme = useThemeColors()
  const cart = useSelector((state: any) => state.cartStore)
  const dispatch = useDispatch();

  // Get quantity if product is in cart
  const cartItem = cart?.cartItems?.find((cartItem: any) => cartItem.product?._id === product?._id);
  const quantityInCart = cartItem?.quantity || 0;

  return (
    <View style={[styles.card, {backgroundColor: theme.backgroundElement}]}>
      <View>
        <Text style={[styles.name, {color: theme.text}]}>{product?.name}</Text>
        <Text style={[styles.price, {color: theme.text}]}>{formatMoney(product?.price)}</Text>
        <Text style={[styles.stock, {color: theme.text}]}>Stock: {product?.stockQuantity}</Text>
      </View>
        
        <Pressable 
          onPress={() => {
            dispatch(addToCart({ product, quantity: 1 }));
            ToastAndroid.show(`Added ${product?.name} to cart`, ToastAndroid.SHORT);
          }}

          disabled={quantityInCart >= product?.stockQuantity}
          // disabled={cart.cartItems.find((cartItem: any) => cartItem.product._id === product._id)} 
        >
          <Ionicons name="cart-outline" size={24} color={quantityInCart >= product?.stockQuantity ? "gray" : theme.accent} />
        </Pressable>
    </View>
  )
}

export default SingleProductCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#030609",
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#012849",
    },
    stock: {
        fontSize: 14,
        color: "#9CA3AF",
    },
})