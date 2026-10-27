import {Router} from "express"
import multer from "multer"
import verifyToken from "./verifyToken.js"
import prisma from "./db.js"

const postRouter=Router()


const storage = multer.diskStorage({
    destination: "upload",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

postRouter.post("/",verifyToken,upload.single("file"), async (req, res) => {
try{
const {title,post}=req.body
const file=req.file
if(!title||!post||!file){
    return res.json({
        error:"Could not retrieve you posts are you sure you sent Everything right"
    })

}
  const addPost=await prisma.posts.create({
        data:{
            title:title,
           content :post,
            imagePath:`/uploads/${file.filename}`
        }
    })
    res.json({
        succes:"Post added!"
    })
    console.log(addPost.imagePath)
    return
}catch(e){
    console.log(`Fix here: ${e}`)
return res.json({
    error:"Internal error! Failed to save post"
})
}
})

postRouter.get("/",verifyToken,async(req,res)=>{
    try{
        const data=await prisma.posts.findMany({
            orderBy:{
                id: "desc"
            }
        })
         res.json({
             succes:"Welcome To My Full Stack Journal",
            posts:data
        })
        return
       
    }catch(e){
           console.log(`Fix here: ${e}`)
return res.json({
    error:"Internal error! Failed to fetch post"
})

    }
})


postRouter.delete("/delete/:id",verifyToken,async(req,res)=>{
   const {id}=req.params
    try{
        await prisma.posts.delete({
            where:{
                id:Number(id)
            }
        })
        res.json({
            succes:"Post Deleted"
        })
        return
    }catch(e){
        console.log("error while deleting post. check",e)
        res.json({
            error:"Internal error.Failed to Delete post"
        })
    }
})



postRouter.put( "/update/:id",verifyToken,upload.single("file"),async (req, res) => {
        try {
            const id = Number(req.params.id);
            const { title, post } = req.body;

           
            if (!title?.trim() || !post?.trim()) {
                return res.status(400).json({
                    error: "Title and content are required"
                });
            }

            const existingPost = await prisma.posts.findUnique({
                where: { id }
            });

            if (!existingPost) {
                return res.status(404).json({
                    error: "Post not found"
                });
            }

            const updatedPost = await prisma.posts.update({
                where: { id },
                data: {
                    title: title,
                    content: post,
                    ...(req.file && {
                        imagePath: `/uploads/${req.file.filename}`
                    })
                }
            });

            return res.status(200).json({
                succes: "Post updated successfully",
                post: updatedPost
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Failed to update post"
            });
        }
    }
);

export default postRouter
