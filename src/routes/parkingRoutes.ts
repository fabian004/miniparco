import { Router } from 'express';
import * as parkingController from '../controllers/parkingController';
import * as UserController from '../controllers/UserController';
import { authenticateJWT } from '../middlewares/authenticateToken';

const router: Router = Router();

router.post('/',authenticateJWT,  parkingController.createParking);
router.get('/',authenticateJWT,  parkingController.getAllParkings);
router.put('/:id',authenticateJWT, parkingController.updateParking);
router.post('/checkIn',authenticateJWT, parkingController.checkIn);
router.post('/login', UserController.login);

export default router;