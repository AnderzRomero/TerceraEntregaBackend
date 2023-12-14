import config from "../config/config.js";

export default class PersistenceFactory {

    static getPersistence = async () => {
        //Tengo una lista de las ENTIDADES que necesito modelar a nivel persistencia.
        let CartsDao, ProductsDao;

        switch (config.app.PERSISTENCE) {
            case "FS": {
                ProductsDao = (await import('./filesystem/managers/productsDao.js')).default;
                CartsDao = (await import('./filesystem/managers/cartsDao.js')).default;
                break;
            }
            case "MONGO": {
                ProductsDao = (await import('./mongo/managers/productsDao.js')).default;
                CartsDao = (await import('./mongo/managers/cartsDao.js')).default;
                break;
            }
        }
        return {
            CartsDao,
            ProductsDao
        }
    }
}