import { Router } from "express";
import jwt from "jsonwebtoken";

import UserManager from "../dao/mongo/managers/usersManager.js";
import auth from "../services/auth.js";
import { validateJWT } from "../middlewares/jwtExtractor.js";
import dotenv from "dotenv";
import passportCall from "../middlewares/passportCall.js";
import authorization from "../middlewares/authorization.js";


dotenv.config();

const router = Router();
const usersServices = new UserManager();


// EndPoint para crear un usuario y almacenarlo en la Base de Datos
router.post('/register', passportCall('register'), async (req, res) => {
    res.status(200).send({ status: "success", message: "Usuario registrado correctamente", payload: req.user._id });
})

// EndPoint para logearse con el usuario
router.post('/login', passportCall('login'), async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" });

    const user = await usersServices.getBy({ email });
    if (!user) return res.status(400).send({ status: "error", error: "Credenciales Incorrectas" });
    const isValidPassword = await auth.validatePassword(password, user.password);
    if (!isValidPassword) return res.status(400).send({ status: "error", error: "Credenciales Incorrectas" });

    const tokenizedUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        nombres: req.user.firstName,
        apellidos: req.user.lastName,
        id: req.user._id,
        role: req.user.role
    }
    const token = jwt.sign(tokenizedUser,
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.cookie('authCookie', token, { httpOnly: true }).send({ status: "success", message: "logeado correctamente", token });
})

// EndPoints para autenticacion de terceros
router.get('/github', passportCall('github'), (req, res) => { })   //Trigger de mi estartegia de passport
router.get('/githubcallback', passportCall('github'), (req, res) => {
    req.user = req.user;
    res.redirect('/api/products');
})

// EndPoint para la session
router.get('/current', passportCall('jwt'), authorization('user'), (req, res) => {
    const user = req.user;
    res.send({ status: "success", payload: user })
});


//EndPoint para redirigis cualquier error del proceso de autenticacion
router.get('/authFail', (req, res) => {
    res.status(401).send({ status: "error", error: "Error de autenticacion" })
})

// EndPoint para Finalizar la session
router.get('/logout', async (req, res) => {
    res.clearCookie('authCookie'); // Elimina la cookie del token
    return res.redirect('/');
});

// router.get('/eliminarProductos',(req,res)=>{
//     //Número uno, ¿Ya tiene credenciales (ya puedo identificarlo)?
//     if(!req.session.user) return res.status(401).send({status:"error",error:"Not logged in"});
//     //Si llega a esta línea, entonces ya sé quién es
//     //Ahora necesito corroborar si tiene el permiso suficiente
//     if(req.session.user.role!=="admin") return res.status(403).send({status:'error',error:'No permitido'});
//     //Si llegué hasta acá, sí te conozco, y SÍ tienes permisos
//     res.send({status:"success",message:"Productos eliminados"})
// })

router.get('/profileInfo', validateJWT, async (req, res) => {
    //Éste debe devolver la información a partir del token
    console.log(req.user);
    res.send({ status: "success", payload: req.user })
})


export default router;