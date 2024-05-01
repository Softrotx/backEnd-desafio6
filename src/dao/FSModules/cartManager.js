const fs = require('fs')


class CartManager {
  #carts
  #path

  constructor(pathof) {
    this.#carts = []
    this.#path = pathof
  }
  async iniciar() {
    try {
      const carts = await fs.promises.readFile(this.#path, 'utf-8')
      this.#carts = JSON.parse(carts)
    }
    catch (err) {
      if (err.code === 'ENOENT') {
        // El archivo no existe, se crea con un array vacío
        await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, '\t'))
        console.log('Archivo creado con un array vacío.');
        return [];
      } else {
        // Otro tipo de error, se maneja aquí
        console.error('Error al leer el archivo:', err.message);
        throw err;
      }
    }
  }


  async updateFile() {

    await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, '\t'))
  }



  async addCart() {
    const newCart = {
      id: "",
      products: []
    }
    newCart.id = Number.parseInt(Math.random() * 1000)
    const validateId = await this.#carts.find(cart => cart.id === newCart.id)
    while (validateId) {
      newCart.id = Number.parseInt(Math.random() * 1000)
    }
    await this.#carts.push(newCart)
    return newCart
  }

  async getCartById(id) {
    try {
      const foundcart = await this.#carts.find(cart => cart.id === id);
      console.log(foundcart)

      if (foundcart) {

        return (foundcart)
      }
      console.log("Not Found")
    }
    catch (err) {
      console.error("Error al procesar solicitud")
      throw (err)

    }

  }
  async updateCart(cid, productData) {
    try {

      const cartIndex = this.#carts.findIndex(cart => cart.id === cid);

      if (cartIndex < 0) {
        console.log({ error: "No existe el Carrito solicitado" })
        return
      }
      const productOnCart = await this.#carts[cartIndex].products.findIndex(({ ProductID }) => ProductID === +productData.id)

      if (productOnCart >= 0) {
        let cantidad = parseInt(this.#carts[cartIndex].products[productOnCart].quantity) + 1
        this.#carts[cartIndex].products[productOnCart].quantity = cantidad
      } else {
        this.#carts[cartIndex].products.push({ ProductID: productData.id, quantity: 1 })
      }
      
      console.log({ status: "Success!", Message: "El carrito ha sido actualizado correctamente" })
      return this.#carts[cartIndex]
    }


    catch {
      console.error("error al actualizar el contenido")

    }
  }
  async deletecart(id) {
    try {
      const foundcartIdx = this.#carts.findIndex(cart => cart.id === id)
      if (!foundcartIdx < 0) {
        this.#carts.splice(foundcartIdx, 1)
        return
      }
      console.log({ error: "carto no encontrado" })
      return


    }


    catch {
      console.log('error al eliminar el carto')
    }


  }

};


module.exports = CartManager
