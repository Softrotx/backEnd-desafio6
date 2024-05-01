const { Router } = require('express')
const router = Router();
const { User } = require('../dao/models')


router.get('/', (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render('index', {
        title: 'Home',
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn,
    })
})

router.get('/login', (_, res) => {
    // TODO: agregar middleware, sólo se puede acceder si no está logueado
    res.render('login', {
        title: 'Login'
    })
})

router.get('/register', (_, res) => {
    // TODO: agregar middleware, sólo se puede acceder si no está logueado
    res.render('register', {
        title: 'Register'
    })
})

router.get('/profile', async (req, res) => {
    // TODO: agregar middleware, sólo se puede acceder si está logueado
    // TODO: mostrar los datos del usuario actualmente loggeado, en vez de los fake
    const idFromSession = req.session.user.email
    console.log(req.session.user)
    const user = await User.findOne({ email: idFromSession })

    res.render('profile', {
        title: 'My profile',
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email
        }
    })
})

router.get('/products', async (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    const productManager = req.app.get("ProductManager")
    const products = await productManager.getProducts(req.query)
    console.log(products)
    
    res.render('products', {
        title: 'Todos los Productos',
        useWS: false,
        useSweetAlert: true,
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn,
        scripts: [
            
            'products.js'

        ],
        products,
        styles: [
            'index.css'
        ]
    })
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        if (cartId.length !== 24) {
            // HTTP 400 => hay un error en el request o alguno de sus parámetros
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        const CartManager = req.app.get('CartManager')
        const productToCart = await CartManager.getCartById(cartId)

        const products = productToCart.products.map(d => d.toObject({ virtuals: true }))
        console.log(productToCart)

        res.render('carts', {
            title: 'Carrito',
            useWS: false,
            useSweetAlert: true,
            scripts: [
            ],
            products,
            styles: [
                'index.css'
            ]
        })
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        throw (err)

    }

})

module.exports = router