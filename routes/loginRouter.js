import { Router } from "express";
import passport from "passport";

const loginRouter = Router();

loginRouter.post("/users", (req, res, next) => {

    console.log("LOGIN ROUTE REACHED");
    console.log("BODY:", req.body);

    passport.authenticate("local", (error, user, info) => {

        console.log("PASSPORT CALLBACK");
        console.log("ERROR:", error);
        console.log("USER:", user);
        console.log("INFO:", info);

        if (error) {
            return next(error);
        }

        if (!user) {
            return res.status(401).json({
                error: info?.error || "Login failed"
            });
        }

        return res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email
            }
        });

    })(req, res, next);

});

export default loginRouter;