import cors from "cors"
import "dotenv/config";


const corsOptions={
    origin:[ process.env.FRONTEND_URL,process.env.FRONTEND_2 ],
    optionsSuccessStatus:200
}



export default cors(corsOptions)
