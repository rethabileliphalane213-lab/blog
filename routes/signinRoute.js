
import {Router} from "express"
import jsonwebtoken from "jsonwebtoken"


import bcrypt from "bcryptjs"

const signinRouter=Router()
import prisma from "./db.js"



signinRouter.post("/users", async (req, res) => {
    try {
        const {name, surname, email, password} = req.body;

          const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if(user){
            res.json({
                error:"Email alrady in use"
            })
            return
        }

        const hashPassword = await bcrypt.hash(password, 10);

       const newUser = await prisma.user.create({
    data: {
        name,
        surname,
        email,
        password: hashPassword,
        role:"admin"
    }
});

console.log(newUser);


         jsonwebtoken.sign(
            {
                id: newUser.id,
                role: newUser.role
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "1h"
            },
            (error, token) => {
                if (error) {
                    return next(error);
                }

                res.json({
                    success: "Account Created",
                    token,
                    user: {
                        name: newUser.name,
                        surname: newUser.surname
                    }
                });
            }
        );



    }catch(error) {
    console.log(error);
    res.status(500).json({
        error: error.message
    });
}
});


signinRouter.post("/not_admin", async (req, res) => {
    try {
        console.log("Your Request has been recieved")
        const {name, surname, email, password} = req.body;

          const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if(user){
            res.json({
                error:"Email alrady in use"
            })
            return
        }

        const hashPassword = await bcrypt.hash(password, 10);

       const newUser = await prisma.user.create({
    data: {
        name,
        surname,
        email,
        password: hashPassword,
        role:"user"
    }
});

console.log(newUser);


         jsonwebtoken.sign(
            {
                id: newUser.id,
                role: newUser.role
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "1h"
            },
            (error, token) => {
                if (error) {
                    return next(error);
                }

                res.json({
                    success: "Account Created",
                    token,
                    user: {
                        name: newUser.name,
                        surname: newUser.surname
                    }
                });
            }
        );



    }catch(error) {
    console.log(error);
    res.status(500).json({
        error: error.message
    });
}
});
export default signinRouter