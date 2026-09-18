import express from 'express'
import cors from 'cors'
import postModel from './schema/post.model.js';
import uploadToCloudinary from './services/storage.service.js'
import multer from "multer";
// import { upload } from './config/cloudinaryConfig.js';

const app = express();

app.use(cors())
app.use(express.json())
const storage = multer.memoryStorage();
const upload = multer({ storage })

app.post('/create-post', upload.single("imageUrl"), async (req, res) => {
    try {
        const data = req.body;
        console.log(req.file, req.file.buffer)
        const result = await uploadToCloudinary(req.file.buffer)

        await postModel.create({
            imageUrl: result.secure_url,
            caption: data.caption
        })
        res.status(200).json({
            message: 'post created successfully',
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'server upload error' })
    }
})

app.get('/feed', async (req, res) => {
    const data = await postModel.find();
    res.status(201).json({
        _id: data._id,
        message: 'data fetch successfully',
        data: data
    })
})

export default app;