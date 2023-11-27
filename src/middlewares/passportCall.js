import passport from "passport"

const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, async (error, user, info) => {
            if (error) return next(error);
            if (!user) {
                res.redirect('/login');
                // return res.status(401).send({ status: "error", error: info.message ? info.message : info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

export default passportCall;