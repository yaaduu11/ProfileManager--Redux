import { Router } from 'express';
import { insertUser, signIn, getUserData, imageUpload, signOut, editUser  } from '../controller/UserController'; 
import { upload } from '../multer';


const router = Router();

router.post('/insertUser', insertUser); 
router.post('/signIn', signIn)
router.get('/getUserData', getUserData)
router.post('/uploadImage', upload.single('image'), imageUpload)
router.post('/signOut', signOut)
router.patch('/updateUserData', editUser)

export default router;