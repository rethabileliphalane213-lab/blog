import {Router} from "express"
import multer from "multer"
import verifyToken from "./verifyToken.js"
const postRouter=Router()


const storage = multer.diskStorage({
    destination: "upload",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

postRouter.post("/",verifyToken,upload.single("file"), async (req, res) => {
res.json({
    succes:"We recievd your request and we'll get back to you shortly"
})
})

export default postRouter
