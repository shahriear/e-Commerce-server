const productSchema = require('../models/productSchema');
const cloudinary = require('../helpers/cloudinary');
const fs = require('fs');
const generateSlug = require('../helpers/slugGenerator');
const SearchRegx = require('../helpers/searchRegx');
const categorySchema = require('../models/categorySchema');

const createProduct = async (req, res) => {
  const { title, description, price, stock, category, varients } = req.body;
  try {
    if (!title)
      return res.status(400).send({ message: 'Product name is required!' });
    if (!description)
      return res
        .status(400)
        .send({ message: 'Description Product is required!' });
    if (!price)
      return res.status(400).send({ message: 'Price name is required!' });
    if (!stock)
      return res.status(400).send({ message: 'Stock name is required!' });
    if (!category)
      return res.status(400).send({ message: 'Category is required!' });
    // if (varients.length < 1)
    //   return res.status(400).send({ message: 'add mimimum one varients!' });
    // console.log(req.file);
    if (!req.files.mainImg)
      return res.status(400).send({ message: 'mainImg is required!' });

    const slug = generateSlug(title);
    const existingProduct = await productSchema.findOne({ slug: slug });
    if (existingProduct)
      return res.status(400).send({ message: 'Product title already used!' });

    //varients enum validation=====

    varients.map(items => {
      if (!['color', 'size'].includes(items.name)) {
        return res
          .status(400)
          .send({ message: 'Invalid varients name, only allow color & size!' });
      }
      if (items.name === 'color') {
        items.options.forEach(colorOption => {
          if (!colorOption.hasOwnProperty('colorname'))
            return res.status(400).send({
              message: "In Color varient the 'color name' is required!",
            });
        });
      }
      if (items.name === 'size') {
        items.options.forEach(sizeOption => {
          if (!sizeOption.hasOwnProperty('size'))
            return res.status(400).send({
              message: "In size varient the 'size' is required!",
            });
        });
      }
    });

    //upload Main Image====

    let mainImg;
    for (item of req.files.mainImg) {
      const result = await cloudinary.uploader.upload(item.path, {
        folder: 'products',
      });
      fs.unlinkSync(item.path);
      mainImg = result.url;
    }

    //upload sub Images====

    let productImages = [];
    if (req.files.images.length > 0) {
      for (item of req.files.images) {
        const result = await cloudinary.uploader.upload(item.path, {
          folder: 'products',
        });
        fs.unlinkSync(item.path);
        productImages.push(result.url);
      }
    }

    const product = new productSchema({
      title,
      description,
      slug,
      price,
      stock,
      category,
      varients,
      mainImg,
      images: productImages,
    });
    product.save();
    res.status(201).send({ message: 'product created successfully!', product });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  const { title, description, price, stock, category, varients, status } =
    req.body;
  const { slug } = req.params;
  try {
    const existingProduct = await productSchema.findOne({ slug: slug });
    if (!existingProduct)
      return res
        .status(400)
        .send({ message: 'Invalid request,no product found !' });

    if (title) existingProduct.title = title;
    if (description) existingProduct.description = description;
    if (price) existingProduct.price = price;
    if (stock) existingProduct.stock = stock;
    if (category) existingProduct.category = category;
    if (varients && varients.length > 0) existingProduct.varients = varients;
    if (
      status &&
      ['active', 'pending', 'reject'].includes(status.ToLowerCase())
    ) {
      if (req.user.role === 'admin') {
        existingProduct.status = status;
      }
    }
    if (req?.files?.mainImg?.length > 0) {
      let mainImg;
      for (item of req.files.mainImg) {
        //delete existing Main Image
        await cloudinary.uploader.destroy(
          existingProduct.mainImg.split('/').pop().split('.')[0],
        );
        const result = await cloudinary.uploader.upload(item.path, {
          folder: 'products',
        });
        fs.unlinkSync(item.path);
        mainImg = result.url;
      }
      existingProduct.mainImg = mainImg;
    }

    existingProduct.save();
    res
      .status(200)
      .send({ message: 'Product Updated !', product: existingProduct });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || '';
    const categoryName = req.query.category || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalProducts = await productSchema.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.title = { $regex: SearchRegx(search), $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    if (categoryName) {
      // console.log(categoryName);
      const categoryData = await categorySchema.findOne({
        name: { $regex: SearchRegx(categoryName), $options: 'i' },
      });
      // console.log(categoryID);

      if (categoryData) query.category = categoryData._id;
    }

    const products = await productSchema
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate('category');

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    res.send({
      products,
      totalProducts,
      limit,
      page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await productSchema.findByIdAndDelete(productId);
    if (!product) return res.status(400).send({ message: 'No Product found!' });
    res.status(201).send({ message: 'Product Deleted!  ' });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
};
