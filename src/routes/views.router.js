import BaseRouter from "./BaseRouter.js";

class ViewsRouter extends BaseRouter {
  init() {
    // rutas para el sistema de login 
    this.get('/', ['PUBLIC'], async (req, res) => {
      res.redirect('/login');
    })
    this.get('/login', async (req, res) => {
      res.render('login')
    })
    this.get('/register', async (req, res) => {
      res.render('register')
    })
  }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();