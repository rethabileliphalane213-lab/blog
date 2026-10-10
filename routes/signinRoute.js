
import {Router} from "express"

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
        password: hashPassword
    }
});

console.log(newUser);

res.json({
    succes: "Account Created",
    user: {
        id: newUser.id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email
    }
});

    }catch(error) {
    console.log(error);
    res.status(500).json({
        error: error.message
    });
}
});
export default signinRouter