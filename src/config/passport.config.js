import passport from "passport";
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import UserManager from "../dao/mongo/managers/usersManager.js";
import auth from "../services/auth.js";
import { Strategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { cookieExtractor } from "../utils.js";

dotenv.config();


// Estrategia local = registro y login 
const LocalStrategy = local.Strategy; // local = username + password

const usersServices = new UserManager();

const initializeStrategies = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email', session: false }, async (req, email, password, done) => {
        try {
            const { firstName, lastName, age } = req.body;
            if (!firstName || !lastName || !age) return done(null, false, { message: "Valores incompletos" })
            //Corroborar que el usuario no exista.
            const exists = await usersServices.getBy({ email });
            if (exists) return done(null, false, { message: "Usuario ya registrado." });

            const hasedPassword = await auth.createHash(password);
            const newUser = { firstName, lastName, email, age, password: hasedPassword }
            const result = await usersServices.create(newUser);

            return done(null, result);
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email', session: false }, async (email, password, done) => {
        try {
            if (!email || !password) return done(null, false, { message: "Valores incompletos" });

            const user = await usersServices.getBy({ email });
            if (!user) return done(null, false, { message: "Credenciales Incorrectas" });
            const isValidPassword = await auth.validatePassword(password, user.password);
            if (!isValidPassword) return done(null, false, { message: "Credenciales Incorrectas" });

            return done(null, user);
        } catch (error) {
            console.log(error);
            return done(error);
        }


    }))

    passport.use('github', new GithubStrategy({session:false, 
        clientID: 'Iv1.47994dddd59e9f0e',
        clientSecret: 'c07df5b4bf34171576817394190b1424b2f3b45b',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        const { email, name } = profile._json;

        const user = await usersServices.getBy({ email });
        if (!user) {
            const newUser = {
                firstName: name,
                email,
                password: ''
            }
            const result = await usersServices.create(newUser);
            done(null, result);
        } else {
            done(null, user);
        }
    }))

    passport.use('jwt', new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_KEY
    }, async (payload, done) => {
        return done(null, payload);
    }))


    passport.serializeUser((user, done) => {
        return done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        const user = await usersServices.getBy({ _id: id });
        done(null, user);
    })


}

export default initializeStrategies;