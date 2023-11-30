import jwt from 'jsonwebtoken';
import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
// import config from '../config/config.js';
import dotenv from "dotenv";

dotenv.config();

class SessionsRouter extends BaseRouter {
    init() {
        // EndPoint para crear un usuario y almacenarlo en la Base de Datos
        this.post('/register', passportCall('register'), async (req, res) => {
            // res.clearCookie('library');
            res.sendSuccess('Usuario registrado correctamente');
        })
        // EndPoint para logearse con el usuario
        this.post('/login', passportCall('login'), async (req, res) => {
            const tokenizedUser = {
                name: `${req.user.firstName} ${req.user.lastName}`,
                nombres: req.user.firstName,
                apellidos: req.user.lastName,
                id: req.user._id,
                role: req.user.role
            }
            const token = jwt.sign(tokenizedUser, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.cookie('authCookie', token, { httpOnly: true });
            // res.clearCookie('library');
            res.sendSuccess('logeado correctamente');
        })
        this.get('/current', async (req, res) => {
            console.log(req.user);
            res.sendSuccessWithPayload(req.user);
        })
        // EndPoints para autenticacion de terceros
        this.get('/github', passportCall('github'));   //Trigger de mi estartegia de passport
        this.get('/githubcallback', passportCall('github'), async (req, res) => {
            if (!req.user) {
                return res.status(403).sendError("No se pudo autenticar");
            } else {    
                const tokenizedUser = {
                    name: `${req.user.firstName} ${req.user.lastName}`,                    
                    id: req.user._id,
                    role: req.user.role
                }

                const token = jwt.sign(tokenizedUser, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.cookie('authCookie', token, { httpOnly: true });
                // return res.status(200).json({ status: 'success', token: token });

                console.log("Usuario autenticado:", token);
                return res.redirect('/api/products');
            }
            // // req.user = req.user;
            // console.log("Imprimiendo en el EndPoint",req.user);
        })
        // EndPoint para Finalizar la session
        this.get('/logout', async (req, res) => {
            res.clearCookie('authCookie'); // Elimina la cookie del token
            return res.redirect('/');

        });
    }
}

const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();