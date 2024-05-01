const fs = require('fs')


class ProductManager {
  #products
  #path

  constructor(pathof) {
    this.#products = []
    this.#path = pathof
  }
  async iniciar() {
    try {
      const products = await fs.promises.readFile(this.#path, 'utf-8')
      this.#products = JSON.parse(products)
    }
    catch (err) {
      if (err.code === 'ENOENT') {
        // El archivo no existe, se crea con un array vacío
        await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, '\t'))
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
    
    await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, '\t'))
  }



  async addProduct(newProduct) {
    console.log(newProduct)
    const { title, description, price, thumbnail, code, stock } = newProduct

    if (title || description || price || thumbnail || code || stock) {
      if (this.#products.some(product => product.code === code)) {
        console.log('Error: ya existe un producto con ese codigo')
        return false
      }

      const createProduct = {
        id: "",
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      }
      createProduct.id = Number.parseInt(Math.random() * 1000)


      const validateId = await this.#products.find(product => product.id === createProduct.id)
      while (validateId) {
        createProduct.id = Number.parseInt(Math.random() * 1000)
      }


      this.#products.push(createProduct)
      return true
      


    } else { return console.log('los campos no pueden estar vacios') }
  }

  async getProducts() {
    try {
      return this.#products

    }
    catch (err) {
      throw (err)
    }
  }




  async getProductById(id) {
    try {
      await this.iniciar()
      const foundProduct = await this.#products.find(product => product.id === id);
      console.log(foundProduct)

      if (foundProduct) {

        return (foundProduct)
      }else {
        console.error("Not Found")
        return 

      }
      
      
    }
    catch (err) {
      console.error("Error al procesar solicitud")
      throw (err)

    }

  }
  async updateProduct(pid, newData) {
    try {
      await this.iniciar()
      const foundProductIdx = this.#products.findIndex(product => product.id === pid);

      if (isNaN(pid)) {
        console.log({ error: "Invalid ID format" })
        return
      }

      if (foundProductIdx < 0) {
        console.log({ error: "User not found" })
        return
      }

      const newProductData = await { ...this.#products[foundProductIdx], ...newData }
      this.#products[foundProductIdx] = newProductData




      console.log({ status: "Success!", Message: "El producto ha sido actualizado correctamente" })

    }


    catch {
      console.error("error al actualizar el contenido")

    }
  }
  async deleteProduct(id) {
    try {
      const foundProductIdx = this.#products.findIndex(product => product.id === id)
      if (!foundProductIdx < 0) {
        this.#products.splice(foundProductIdx, 1)
        return
      }
      console.log({ error: "Producto no encontrado" })
      return


    }

    
    catch {
  console.log('error al eliminar el producto')
}


  }

};


module.exports = ProductManager
