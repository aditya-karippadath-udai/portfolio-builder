import { Router } from 'express';
import {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '../controllers/portfolio.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.post('/', createPortfolio);
router.get('/:id', getPortfolio);
router.put('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);

export default router;