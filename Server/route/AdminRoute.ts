import { Router } from 'express';
import { adminSignIn, deleteUsers, editUsers, getUsers, getUserById } from '../controller/AdminController';

const router = Router();

router.post('/adminSignIn', adminSignIn)
router.get('/getUsers', getUsers)
router.delete('/deleteUser/:userId', deleteUsers)
router.get('/getUser/:userId', getUserById)
router.patch('/edit/:userId', editUsers);

export default router