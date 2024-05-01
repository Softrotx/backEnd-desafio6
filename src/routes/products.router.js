const { Router } = require('express')
const router = Router();



router.get('/', async (req, res) => {
    try {
        const ProductManager = req.app.get('ProductManager')
        const products = await ProductManager.getProducts(req.query)
        if (products) {
            if(products.hasPrevPage){
                console.log(req.query.page)
                //pendiente . agregar link previo y siguiente
                res.json([{ status: 'Success' }, products])

            }
            res.json([{ status: 'Success' }, products])

        }
    }
    catch (err) {
        console.error("Error al procesar solicitud")
        throw (err)
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        if (pid.length !== 24) {
            // HTTP 400 => hay un error en el request o alguno de sus parámetros
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        const ProductManager = req.app.get('ProductManager')
        const productFound = await ProductManager.getProductById(pid)
        if (productFound === undefined) {
            res.status(400).json({ error: "No existe el producto solicitado" })
            return
        }
        res.json(productFound)


    }
    catch (err) {
        throw (err)
    }
})

router.post('/', async (req, res) => {
    try {
        const ProductManager = req.app.get('ProductManager')

        const nuevoProducto = await ProductManager.addProduct(req.body)
        console.log(nuevoProducto)
        if (nuevoProducto) {
            res.json(nuevoProducto)


            return
        }
        res.json({ status: "Error!", Message: "El producto no pudo ser agregado" })



    }
    catch (err) {
        throw err

    }
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    const ProductManager = req.app.get('ProductManager')
    const Updated = await ProductManager.updateProduct(pid, req.body)
    // await ProductManager.updateFile()
    res.json(`producto correctamente actualizado: ${Updated}`)
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    const ProductManager = req.app.get('ProductManager')
    const deleted = await ProductManager.deleteProduct(pid)
    // await ProductManager.updateFile()

    res.status(202).send(deleted)





})

module.exports = router

