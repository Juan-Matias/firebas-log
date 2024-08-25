
import { AntDesign, Ionicons,FontAwesome6, Feather} from '@expo/vector-icons';

export const icons = {
  home: (props)=> <AntDesign name='home' size={26} {...props}/>,
  carrito: (props)=> <AntDesign name='shoppingcart' size={26} {...props}/>,
  perfil: (props)=> <FontAwesome6 name='user' size={26} {...props}/>,
  pedidos: (props)=> <Feather name='book-open' size={26} {...props}/>,
  productos: (props)=> <Ionicons name='briefcase-outline' size={26} {...props}/>
}
