const cartSchema = require('../models/cartSchema');

const addtocart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId)
    return res.status(400).send({ message: 'Product Data required!' });

  try {
    //Find or create cart
    let cart = await cartSchema.findOne({ user: req.user.id });

    if (!cart) {
      const newCart = new cartSchema({
        user: req.user.id,
        items: [],
      });
    }

    const index = cart.items.findIndex(
      item => item.product.toString() === productId,
    );

    if (index > -1) {
      //Product already in cart -> update quantity
      cart.items[index].quantity += quantity;
    } else {
      // New product -> add to cart
      cart.items.push({ product: productId, quantity });
    }
    cart.save();
    res.status(200).send({ message: 'Product add to cart', cart });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error!' });
  }
};

//PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined || quantity < 0) {
      return res
        .status(400)
        .json({ message: 'Invalide product id or quantity.' });
    }
    let cart = await cartSchema.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }
    const index = cart.items.findIndex(
      item => item.product.toString() === productId,
    );
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }
    // Update quantity
    cart.items[index].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error!' });
  }
};

// DELETE /api/cart/item/:productId
const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    let cart = await cartSchema.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId,
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    await cart.save();

    res.status(200).json({
      message: 'Item removed from cart.',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartSchema
      .findOne({ user: userId })
      .populate('items.product');

    res.status(200).json({
      message: 'Cart fetched successfully.',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addtocart, updateCartItem, deleteCartItem, getCart };
