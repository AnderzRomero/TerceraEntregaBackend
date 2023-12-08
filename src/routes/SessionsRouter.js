import jwt from 'jsonwebtoken';
import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import config from '../config/config.js';


class SessionsRouter extends BaseRouter {
    init() {
        // EndPoint para crear un usuario y almacenarlo en la Base de Datos
        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'LOCALS' }), async (req, res) => {
            res.clearCookie('cart');
            res.sendSuccess('Usuario registrado correctamente');
        })
        // EndPoint para logearse con el usuario
        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'JWT' }), async (req, res) => {
            const tokenizedUser = {
                name: `${req.user.firstName} ${req.user.lastName}`,
                nombres: req.user.firstName,
                apellidos: req.user.lastName,
                id: req.user._id,
                role: req.user.role,
                cart: req.user.cart
            }
            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
            res.cookie(config.jwt.COOKIE, token);
            res.clearCookie('cart');
            res.sendSuccess('logeado correctamente');
        })
        this.get('/current', ['AUTH'], async (req, res) => {
            console.log(req.user);
            res.sendSuccessWithPayload(req.user);
        })
        // EndPoints para autenticacion de terceros
        this.get('/github', ['NO_AUTH'], passportCall('github', { strategyType: 'LOCALS' }), async (req, res) => { });   //Trigger de mi estartegia de passport
        this.get('/githubcallback', ['NO_AUTH'], passportCall('github', { strategyType: 'LOCALS' }), async (req, res) => {
            if (!req.user) {
                return res.status(403).sendError("No se pudo autenticar");
            } else {
                const tokenizedUser = {
                    name: `${req.user.firstName}`,
                    id: req.user._id,
                    role: req.user.role,
                    cart: req.user.cart
                }

                const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
                res.cookie(config.jwt.COOKIE, token);
                res.clearCookie('cart');
                return res.redirect('/api/products');
            }
        })
        // EndPoint para Finalizar la session
        this.get('/logout', ['USER'], async (req, res) => {
            res.clearCookie('authCookie'); // Elimina la cookie del token
            return res.redirect('/');

        });
    }
}

const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();