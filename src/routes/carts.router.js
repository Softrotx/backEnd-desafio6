const { Router } = require('express')
const router = Router();

router.post('/', async (req, res) => {
    try {
        const CartManager = req.app.get('CartManager')
        const createdCart = await CartManager.addCart()
        if (createdCart) {
            res.json({ status: "success!", Message: `El Carrito ID: ${createdCart.id} fue correctamente creado`, createdCart })
            return
        }
        res.json({ status: "Error!", Message: "El Carrito no pudo ser creado" })

    }
    catch (err) {
        throw err

    }
})

// obtener el carrito asociado a un ID
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        console.log(cartId)
        if (cartId.length !== 24) {
            // HTTP 400 => hay un error en el request o alguno de sus parámetros
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        const CartManager = req.app.get('CartManager')
        const productToCart = await CartManager.getCartById(cartId)

        res.json(productToCart)



    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        throw (err)

    }


})

router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const body = req.body
        if (cartId.length !== 24) {
            // HTTP 400 => hay un error en el request o alguno de sus parámetros
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        const CartManager = req.app.get('CartManager')
        const productsOnCart = await CartManager.updateCart(cartId, body)

        res.json(productsOnCart)



    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });

    }


})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        console.log(productId)
        if (productId.length !== 24 || cartId.length !== 24) {
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        const CartManager = req.app.get('CartManager')
        const ProductManager = req.app.get('ProductManager')
        const product = await ProductManager.getProductById(productId)
        if (!product) {
            res.status(400).json("producto no encontrado")
            return
        }
        const productOnCart = await CartManager.addProductOnCart(cartId, productId)
        console.log("se agregó el producto correctamente")

        res.json(productOnCart)
    }
    catch (err) {
        throw err
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body
        if (productId.length !== 24 || cartId.length !== 24) {
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        const CartManager = req.app.get('CartManager')
        const ProductManager = req.app.get('ProductManager')
        const product = await ProductManager.getProductById(productId)
        if (!product) {
            res.status(400).json("producto no encontrado")
            return
        }
        const productToCart = await CartManager.addProductOnCart(cartId, productId, quantity)

        res.json(productToCart)
    }
    catch (err) {
        throw err
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    console.log('hola mundo')
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        console.log({cid,pid})
        if (pid.length !== 24 || cid.length !== 24) {
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        const CartManager = req.app.get('CartManager')
        const productoEliminado = await CartManager.cartCleaner(cid, pid)

        res.json(productoEliminado)




    }
    catch(err){
        console.log(err)

    }

})
router.delete('/:cid/', async (req, res) => {
    try{
        const cid = req.params.cid
        if (cid.length !== 24) {
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        const CartManager = req.app.get('CartManager')
        const cart = await CartManager.cartCleaner(cid)

        res.json(cart)




    }
    catch(err){
        console.log(err)

    }

})








module.exports = router

