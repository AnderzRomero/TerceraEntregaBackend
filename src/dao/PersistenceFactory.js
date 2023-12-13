import config from "../config/config.js";

export default class PersistenceFactory {

    static getPersistence = async () => {
        //Tengo una lista de las ENTIDADES que necesito modelar a nivel persistencia.
        let MessagesDao;
        let UsersDao;
        let CartsDao;
        let ProductsDao;

        switch (config.app.PERSISTENCE) {
            case "MEMORY": {
                ToysDao = (await import('./Memory/ToysDao.js')).default;
                break;
            }
            case "FS": {
                ToysDao = (await import('./FS/ToysDao.js')).default;
                break;
            }
            case "MONGO": {
                UsersDao = (await import('./mongo/managers/usersDao.js')).default;
                CartsDao = (await import('./mongo/managers/cartsDao.js')).default;
                ProductsDao = (await import('./mongo/managers/productsDao.js')).default;                
                break;
            }
        }
        return {
            MessagesDao,
            UsersDao,
            CartsDao,
            ProductsDao
        }
    }

}