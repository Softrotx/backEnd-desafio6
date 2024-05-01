
const { CartsModel } = require('../models')
const { Products } = require("../models")


const { Carts, ProductsOnCart } = CartsModel

class CartManager {

  constructor() {
  }

  async addCart() {
    const newCart = {
      products: []
    }
    const Cart = await Carts.create(newCart)

    return Cart
  }

  async getCartById(id) {
    try {
      const foundcart = await Carts.findById(id).populate('products.productId')

      if (foundcart) {

        return foundcart
      }
      console.log("Not Found")
    }
    catch (err) {
      console.error("Error al procesar solicitud")
      throw (err)
    }
  }
  async addProductOnCart(cid, pid, quantity) {
    try {
      const cart = await Carts.findById(cid)
      if (cart) {
        const foundProduct = await cart.products.find((product) => product.productId.equals(pid))
        console.log("producto encontrado?: " + foundProduct + " " + "id " + pid)
        if (foundProduct) {
          if (quantity === undefined) {
            const updatedCart = await Carts.findOneAndUpdate(
              { _id: cid, "products.productId": pid },
              { $inc: { "products.$.quantity": 1 } }
            )
            return { status: "Success!", message: "El carrito ha sido actualizado correctamente", updatedCart }

          }
          const updatedCart = await Carts.findOneAndUpdate(
            { _id: cid, "products.productId": pid },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
          )
          return { status: "Success!", message: "El carrito ha sido actualizado correctamente", updatedCart }
        }

        const newProduct = new ProductsOnCart({
          productId: pid, quantity: 1
        })
        cart.products.push(newProduct)
        cart.save()

        console.log({ status: "Success!", message: "El carrito ha sido actualizado correctamente" })
        return cart

      }
    } catch (err) {
      console.error("Error updating cart:", err)
      throw err // Propagar el error para que sea manejado por el código que llama a esta función
    }
  }

  async updateCart(cid, productsToAdd) {
    try {
      const productsAdded = []
      const productswithIdWrong = []
      const cart = await Carts.findById(cid)
      // 1 validar si el id del carrito existe
      if (!cart) {
        throw new Error(`El carrito ${cid} no existe`)
      }
      //   // 2 validar si el producto ya existe en el carrito
      for (const product of productsToAdd) {
        const productToAddId = product.productId
        let productToAddquantity = product.quantity
        if (productToAddId.length !== 24) {
          //EL ID no es valido
          productswithIdWrong.push(product)
        } else {
          const foundProduct = cart.products.find(p => p.productId === productToAddId)
          if (foundProduct !== undefined) {
            // 3 si encuentra el producto , suma la cantidad existente a la cantidad agregada
            productToAddquantity += foundProduct.quantity
            await Carts.findOneAndUpdate(
              { _id: cid, "products.productId": productToAddId },
              { $set: { "products.$.quantity": productToAddquantity } },
              { new: true }
            )
            productsAdded.push({productId:productToAddId, quantity:productToAddquantity})
            console.log(`Se actualizó la cantidad del producto ${productToAddId}`)
            //4 si no encuentra el producto valida si existe en el product manager
          } else {
            const validProduct = await Products.findById(productToAddId)
            if (validProduct) {
              //5 si el producto existe , crea un nuevo subdocumento con el producto y lo agrega al carrito
              const newProduct = new ProductsOnCart({
                productId: productToAddId,
                quantity: productToAddquantity
              })
              cart.products.push(newProduct)
              cart.save()
              productsAdded.push(product)
              console.log(`${productToAddId} agregado al carrito`)
            } else {
              //6 si no encuentra el producto agrega el producto a un array con todos los productos inexistentes
              console.log(`el producto ID ${productToAddId} no existe no fue posible agregarlo al carrito`)
              productswithIdWrong.push(product)
            }
          }
        }
      }
      console.log({ status: "Success!", message: "El carrito ha sido actualizado correctamente", productsAdded, productswithIdWrong })
      return cart
    } catch (err) {
      console.error("Error updating cart:", err)
      throw err // Propagar el error para que sea manejado por el código que llama a esta función
    }
  }



  async cartCleaner(cid, pid) {
    try {
      const cart = await Carts.findById(cid)
      if (cart) {

        if (pid !== undefined) {
          const foundProduct = await cart.products.find(product => product.productId === pid)
          if (foundProduct) {
            await Carts.findByIdAndUpdate(cid, { $pull: { products: { productId: pid } } })
            return `Producto ID ${pid} eliminado del carrito ${cid}`

          } else {
            return `el producto ${pid} no existe en el carrito ${cid}`
          }

        }
        await Carts.findByIdAndUpdate(cid, { $set: { products: [] } })
        return `Carrito ID ${cid} vaciado`

      }
      return `el carrito ${cid} no existe`
    }



    catch (err) {
      console.log('error al eliminar el carto. error :' + err)
    }


  }

}


module.exports = CartManager

