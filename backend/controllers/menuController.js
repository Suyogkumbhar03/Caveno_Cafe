import MenuItem from '../models/MenuItem.js';

export const getMenuItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find({}).sort({ category: 1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
