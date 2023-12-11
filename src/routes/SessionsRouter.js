
import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import sessionsControllers from '../controllers/sessions.controllers.js';


class SessionsRouter extends BaseRouter {
    init() {
        // EndPoint para crear un usuario y almacenarlo en la Base de Datos
        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'LOCALS' }), sessionsControllers.createUser);
        // EndPoint para logearse con el usuario
        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'JWT' }), sessionsControllers.Login);
        // EndPoint para obtener la informacion del usuario
        this.get('/current', ['AUTH'], sessionsControllers.infoUser);
        // EndPoints para autenticacion de terceros
        this.get('/github', ['NO_AUTH'], passportCall('github', { strategyType: 'LOCALS' }));   //Trigger de mi estartegia de passport
        this.get('/githubcallback', ['NO_AUTH'], passportCall('github', { strategyType: 'LOCALS' }), sessionsControllers.loginTerceros);
        // EndPoint para Finalizar la session
        this.get('/logout', ['USER'], sessionsControllers.logout);
    }
}

const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();