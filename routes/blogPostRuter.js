import {Router} from "express"
import multer from "multer"
import uploadRouter from "../../file-uploader/routes/uploadRouter"
const postRouter=Router()


const storage = multer.diskStorage({
    destination: "upload",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

postRouter.post("/", upload.single("file"), async (req, res) => {

})

export default uploadRouter
