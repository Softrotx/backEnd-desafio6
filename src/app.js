// node_modules
const express = require('express');
const { mongoose } = require('mongoose');
const handlebars = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')
const sessionMiddleware = require('./session/mongoStorage')
const { dbName, mongoUrl} = require('./dbConfig')
const passport = require('passport')
const initializePassport = require('./config/passport.config');

// Modulos de Manager
const ProductManager = require('./dao/DBModules/productManager')
const CartManager = require('./dao/DBModules/cartManager')

// Routes
const productsRouter = require('./routes/products.router')
const viewsRouter = require('./routes/views.router')
const chatRouter = require('./routes/chat.router')
const cartsRouter = require('./routes/carts.router')
const sessionsRouter = require('./routes/sessions.router')

//WebSocket
const { Server } = require('socket.io')
const { Chat } = require('./dao/models');



const fileStorage = FileStore(session)
const app = express();
// permitir envío de información mediante formularios y JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(sessionMiddleware)

// passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')


//redireccion de api y views 
app.use(express.static(`${__dirname}/../public`))
app.use('/', viewsRouter)
app.use('/api/products', productsRouter )
app.use('/api/carts', cartsRouter )
app.use('/api/chat', chatRouter )
app.use('/api/sessions', sessionsRouter )

const main = async () => {

    await mongoose.connect(mongoUrl,{ dbName: dbName })

    // Linea de comando para usar el Manager de fileStorage

    const productos = new ProductManager(`${__dirname}/assets/Productos.json`)
    const carrito = new CartManager(`${__dirname}/assets/Carts.json`)
    // await productos.iniciar()
    // await carrito.iniciar()

    // activar el servidor , localhost:8080
    app.set('ProductManager', productos)
    app.set('CartManager', carrito)
    const httpServer = await app.listen(8080, () => {
        console.log('servidor listo')
    })
    // crear un servidor para WS
    const io = new Server(httpServer)
    const menssageLogs = []

    io.on('connection', clientSocket => {
        const user = clientSocket.id.replace(/[A-Z, 0-9,-,_]/g, '')
        console.log(`Nuevo cliente conectado => ${user}`)

    
        clientSocket.on('message', (data) => {
            const msg = data
            const message = {user, msg}
            menssageLogs.push(message)
            io.emit('message', message)

            Chat.create()


        })
        for (const message of menssageLogs) {
            clientSocket.emit('message', message)
    
        }
    
    })


}

main()

