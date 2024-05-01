const passport = require('passport')
const local = require('passport-local')
const { User } = require('../dao/models')
const { createHash, isValidPassword } = require('../utils/utils')
const GitHubStrategy = require('passport-github2')
const { clientID, clientSecret, callbackURL } = require('./github.private')

const LocalStrategy = local.Strategy
const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID,
        clientSecret,
        callbackURL
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            console.log('profile GitHub: ' + profile)
            const user = await User.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user)
            }
            const fullName = profile._json.name
            const firstName = fullName.substring(0, fullName.lastIndexOf(' '))
            const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1)
            const newUser = {
                firstName,
                lastName,
                age: 30,
                email: profile._json.emails,
                password: ''
            }
            const result = await User.create(newUser)
            done(null,result)
        }
        catch (err) {
            return done(err)

        }
    }))

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { firstName, lastName, email, age } = req.body
            try {
                const user = await User.findOne({ email: username })
                if (user) {
                    console.log("user Already exists")
                    return done(null, false)
                }
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userService.create(newUser)
                return done(null, result)

            }
            catch (err) {
                return done("error al obtener el usuario: " + err)

            }
        }
    ))
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username })
            if (!user) {
                console.log("User doesn't exist")
                return done(null, false)
            }
            if (!isValidPassword(user, password)) {
                return done(null, false)
            } else {
                return done(null, user)
            }
        }
        catch (err) {
            return done(err)

        }
    }))

    passport.serializeUser(async (user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
    })

}

module.exports = initializePassport