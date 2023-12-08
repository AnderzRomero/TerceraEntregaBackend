import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as Strategy, ExtractJwt } from "passport-jwt";

import UserManager from "../dao/mongo/managers/usersManager.js";
import GithubStrategy from 'passport-github2';
import cartManager from "../dao/mongo/managers/cartsManager.js";
import auth from "../services/auth.js";
import config from "./config.js";



const usersServices = new UserManager();
const cartsServices = new cartManager();

const initializeStrategies = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email', session: false },
        async (req, email, password, done) => {
            try {
                const { firstName, lastName, age } = req.body;
                if (!firstName || !lastName || !age) return done(null, false, { message: "Valores incompletos" })
                //Coroborar que el usuario no exista.
                const exists = await usersServices.getBy({ email });
                if (exists) return done(null, false, { message: "Usuario ya registrado." });

                const hasedPassword = await auth.createHash(password);
                const newUser = { firstName, lastName, email, age, password: hasedPassword }

                //Revisar la librería temporal
                let cart;

                if (req.cookies['cart']) {//Obtener la que ya está de la cookie
                    cart = req.cookies['cart'];
                } else { //Crear una nueva librería en la base de datos
                    cartResult = await cartsServices.addCart();
                    cart = cartResult._id
                }
                newUser.cart = cart;

                const result = await usersServices.create(newUser);
                return done(null, result);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }));

    passport.use('login', new LocalStrategy({ usernameField: 'email', session: false }, async (email, password, done) => {
        try {
            if (!email || !password) return done(null, false, { message: "Valores incompletos" });
            if (email === config.app.ADMIN_EMAIL && password === config.app.ADMIN_PASSWORD) {
                const adminUser = {
                    role: 'admin',
                    id: '0',
                    firstName: 'admin'
                }
                return done(null, adminUser);
            }

            //Aquí el usuario sí debería existir, corroborar primero.
            const user = await usersServices.getBy({ email });
            if (!user) return done(null, false, { message: "Credenciales Incorrectas" });
            //Ahora toca validar su contraseña, ¿es equivalente?
            const isValidPassword = await auth.validatePassword(password, user.password);
            if (!isValidPassword) return done(null, false, { message: "Credenciales Incorrectas" });
            return done(null, user);
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }));

    passport.use('github', new GithubStrategy({
        session: false,
        clientID: 'Iv1.47994dddd59e9f0e',
        clientSecret: 'c07df5b4bf34171576817394190b1424b2f3b45b',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        const { email, name } = profile._json;

        const user = await usersServices.getBy({ email });
        if (!user) {
            let cart;

            const newUser = {
                firstName: name,
                email,
                password: ''
            }
            const cartResult = await cartsServices.addCart();
            cart = cartResult._id

            newUser.cart = cart;

            const result = await usersServices.create(newUser);
            done(null, result);
        } else {
            done(null, user);
        }
    }))

    passport.use('jwt', new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([auth.cookieExtractor]),
        secretOrKey: config.jwt.SECRET
    }, async (payload, done) => {
        return done(null, payload);
    }))
}

export default initializeStrategies;