
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

         await prisma.user.create({
            data:{
                name,
                surname,
                email,
                password: hashPassword
            }
        });

        console.log(user);

        res.json({
            message:"user received",
            user:{
                id:user.id,
                name:user.name,
                surname:user.surname,
                email:user.email
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