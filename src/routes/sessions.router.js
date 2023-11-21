import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import UserManager from "../dao/mongo/managers/usersManager.js";
import auth from "../services/auth.js";
import { validateJWT } from "../middlewares/jwtExtractor.js";

const router = Router();
const usersServices = new UserManager();


// EndPoint para crear un usuario y almacenarlo en la Base de Datos
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res) => {
    res.status(200).send({ status: "success", message: "Usuario registrado correctamente", payload: req.user._id });
})

// EndPoint para logearse con el usuario
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res) => {
    req.session.user = req.user;
    res.send({ status: "success", message: "logeado correctamente" });
})

router.post('/loginJWT', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" });

    const user = await usersServices.getBy({ email });
    if (!user) return res.status(400).send({ status: "error", error: "Credenciales Incorrectas" });
    const isValidPassword = await auth.validatePassword(password, user.password);
    if (!isValidPassword) return res.status(400).send({ status: "error", error: "Credenciales Incorrectas" });
    //si se logueo bien, AHORA LE CREO UN TOKEN
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.firstName },
        'secretjwt',
        { expiresIn: '1h' });
    //Si la idea es delegar el token al usuario, tengo que enviarselo de alguna manera
    /**
        * Desde el body, *** HOY ***
        * Desde una Cookie ***** PRÓXIMA VEZ *****
    */
    console.log(token);
    res.send({ status: "success", token })
})


// EndPoints para autenticacion de terceros
router.get('/github', passport.authenticate('github'), (req, res) => { })   //Trigger de mi estartegia de passport
router.get('/githubcallback', passport.authenticate('github'), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
})

//EndPoint para redirigis cualquier error del proceso de autenticacion
router.get('/authFail', (req, res) => {
    res.status(401).send({ status: "error", error: "Error de autenticacion" })
})

// EndPoint para Finalizar la session
router.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
        }
        return res.redirect('/');
    });
})

// router.get('/eliminarProductos',(req,res)=>{
//     //Número uno, ¿Ya tiene credenciales (ya puedo identificarlo)?
//     if(!req.session.user) return res.status(401).send({status:"error",error:"Not logged in"});
//     //Si llega a esta línea, entonces ya sé quién es
//     //Ahora necesito corroborar si tiene el permiso suficiente
//     if(req.session.user.role!=="admin") return res.status(403).send({status:'error',error:'No permitido'});
//     //Si llegué hasta acá, sí te conozco, y SÍ tienes permisos
//     res.send({status:"success",message:"Productos eliminados"})
// })

router.get('/profileInfo',validateJWT,async(req,res)=>{
    //Éste debe devolver la información a partir del token
    console.log(req.user);
    res.send({status:"success",payload:req.user})
})


export default router;