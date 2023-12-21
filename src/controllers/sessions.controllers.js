import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const createUser = async (req, res) => {
    res.clearCookie('cart');
    res.sendSuccess('Usuario registrado correctamente');
}

const Login = async (req, res) => {
    const tokenizedUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        nombres: req.user.firstName,
        apellidos: req.user.lastName,
        email: req.user.email,
        id: req.user._id,
        role: req.user.role,
        cart: req.user.cart
    }
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
    res.cookie(config.jwt.COOKIE, token);
    res.clearCookie('cart');
    res.sendSuccess('logeado correctamente');
}

const infoUser = async (req, res) => {
    if (!req.user) {
        return res.status(403).sendError("Usuario no autenticado");
    } else {
        res.render('profile', {
            css: 'products',
            user: req.user,
        });
    }
}

const loginTercerosGitHub = async (req, res) => {
    if (!req.user) {
        return res.status(403).sendError("No se pudo autenticar");
    } else {
        const tokenizedUser = {
            name: `${req.user.firstName}`,
            id: req.user._id,
            role: req.user.role,
            cart: req.user.cart,
            email: req.user.email,
        }

        const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
        res.cookie(config.jwt.COOKIE, token);
        res.clearCookie('cart');
        return res.redirect('/api/products');
    }
}

const loginTercerosGoogle = async (req, res) => {
    if (!req.user) {
        return res.status(403).sendError("No se pudo autenticar");
    } else {
        // Guardamos el usuario en la base de datos si no existe
        const tokenizedUser = {
            name: `${req.user.firstName} ${req.user.lastName}`,
            id: req.user._id,
            role: req.user.role,
            cart: req.user.cart,
            email: req.user.email,
        }

        const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
        res.cookie(config.jwt.COOKIE, token);
        res.clearCookie('cart');
        return res.redirect('/api/products');
    }
}

const logout = async (req, res) => {
    res.clearCookie('authCookie'); // Elimina la cookie del token
    return res.redirect('/');
}

export default {
    createUser,
    Login,
    infoUser,
    loginTercerosGitHub,
    loginTercerosGoogle,
    logout
}

