import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) =>{
    // Bearer ASDPOAKSÑLDKZÑXLCKASDO
    
    //Extraer el header
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({status:"error",error:"Not logged"});
    //Si ya me lo envió, tengo de DESCIFRAR EL TOKEN
    const token = authHeader.split(' ')[1];
    //Pero el token será válido?
    try{
        const userInfo = jwt.verify(token,'secretjwt');
        req.user = userInfo; //¡ESTAMOS RECREANDO LA FUNCIONALIDAD DE PASSPORT CON SESSION!
        next();
    }catch(error){
        console.log(error);
        res.status(401).send({status:"error",error:"TOKEN error"})
    }
}