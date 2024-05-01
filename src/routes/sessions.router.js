const { Router } = require('express')
const { User } = require('../dao/models')
const { createHash, isValidPassword } = require('../utils/utils')
const passport = require('passport')

const router = Router()

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req,res) => {})
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/'}), (req,res) => {
    req.session.user = {_id: req.user._id}
    res.redirect('/')
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentials" })
    }

    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        email: req.user.email
    }
    // 2. crear nueva sesión si el usuario existe
    res.redirect('/products')
})
router.get('/faillogin', (req, res) => {
    res.send({ error: 'Failed Login' })
})

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.send({ status: "Success", message: "User registered" })
})
router.get('/failregister', async (req, res) => {
    console.log("Failed Strategy")
    res.send({ error: "Failed" })
})


router.get('/logout', (req, res) => {
    req.session.destroy(err =>
        res.redirect('/'))
})



module.exports = router