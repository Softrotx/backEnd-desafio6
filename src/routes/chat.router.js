const { Chat } = require('../dao/models');
const { Router } = require('express')
const router = Router();



router.post('/', async (req, res) => {
    const msg = req.body
    const mensajeDB = await Chat.create(msg)
    if (mensajeDB){
        res.json(mensajeDB)
    }
    

})

module.exports = router