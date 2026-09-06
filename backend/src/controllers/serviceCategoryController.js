const ServiceCategory = require('../models/ServiceCategory');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await ServiceCategory.create({ name });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createCategory, getCategories };