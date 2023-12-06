import BaseRouter from "./BaseRouter.js";

class ViewsRouter extends BaseRouter {
  init() {
    // rutas para el sistema de login 
    this.get('/', ['NO_AUTH'], async (req, res) => {
      res.redirect('/login');
    })
    this.get('/login', ['NO_AUTH'], async (req, res) => {
      res.render('login')
    })
    this.get('/register', ['NO_AUTH'], async (req, res) => {
      res.render('register')
    })
    this.get('/profile', ['AUTH'], async (req, res) => {
      res.render('Profile');
    })
  }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();