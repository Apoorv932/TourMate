import express from 'express';
import guideController from '../controllers/guide_controller.js';

// Import separate sub-routers
import authRouter from './auth_router.js';
import hostRouter from './host_router.js';
import storeRouter from './store_router.js';

const apiRouter = express.Router();

// Public guide/tour routes
apiRouter.get(['/guides', '/homes'], guideController.getGuides);
apiRouter.get(['/guides/:guideId', '/homes/:guideId'], guideController.getGuideById);

// Session check route
apiRouter.get('/session', guideController.getSession);

// Mount sub-routers
apiRouter.use('/auth', authRouter);
apiRouter.use('/host', hostRouter);
apiRouter.use('/', storeRouter);

export default apiRouter;
