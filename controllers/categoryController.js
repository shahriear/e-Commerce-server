const cloudinary = require('../helpers/cloudinary');
const fs = require('fs');
const categorySchema = require('../models/categorySchema');
const { log } = require('console');

const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.status(400).send({ message: 'Category name is required!' });
  if (!req?.file?.path)
    return res.status(400).send({ message: 'Category image is required!' });

  const existingCategory =await categorySchema.findOne({ name: {$regex: `${name}`, $options: 'i'} })
  if(existingCategory) return res.status(400).send({ message: 'Category  is already exist !' });
  
  
  //upload category Image
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'categories',
  });

  fs.unlinkSync(req.file.path);

  const category = new categorySchema({
    name,
    image: result.url,
  });
  category.save();
  res.status(201).send({ message: 'Category Created!', category });
};

const getCategories = async (req, res) => {
  const categories = await categorySchema.find();
  res.status(200).send(categories);
};
module.exports = { createCategory,getCategories };
