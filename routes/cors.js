import cors from "cors"
import "dotenv/config";


const corsOptions={
    origin: FRONTEND_URL ,
    optionsSuccessStatus:200
}



export default cors(corsOptions)
