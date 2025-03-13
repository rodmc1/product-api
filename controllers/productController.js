import Product from '../models/product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'username email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'username email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Requires user authentication)
export const createProduct = async (req, res) => {
  const { name, description, price, inStock } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const product = new Product({
      name,
      description,
      price,
      inStock,
      createdBy: req.user.id
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private (Requires product owner)
export const updateProduct = async (req, res) => {
  const { name, description, price, inStock } = req.body;
  try {
    console.log(req.params);
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You are not the product owner' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.inStock = inStock ?? product.inStock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Requires product owner)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You are not the product owner' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
