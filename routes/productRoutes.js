import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts); // 📝 Get all products.
router.get('/:id', getProductById); // 🔍 Get product by ID.
router.post('/', protect, createProduct); // ➕ Create product.
router.put('/:id', protect, updateProduct); // ✏️ Update product.
router.delete('/:id', protect, deleteProduct); // 🗑️ Delete product.

export default router;
