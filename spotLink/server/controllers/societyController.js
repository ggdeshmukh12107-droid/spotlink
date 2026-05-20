import Society from '../models/Society.js';
import User from '../models/User.js';

// @desc    Create society
// @route   POST /api/societies
export const createSociety = async (req, res, next) => {
  try {
    req.body.adminId = req.user.id;
    const society = await Society.create(req.body);

    // Add admin as resident
    society.residents.push(req.user.id);
    await society.save();

    // Update user's societyId
    await User.findByIdAndUpdate(req.user.id, { societyId: society._id });

    res.status(201).json({ success: true, data: society });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all societies
// @route   GET /api/societies
export const getSocieties = async (req, res, next) => {
  try {
    const societies = await Society.find({ isActive: true })
      .populate('adminId', 'name email');
    res.status(200).json({ success: true, count: societies.length, data: societies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get society by ID
// @route   GET /api/societies/:id
export const getSociety = async (req, res, next) => {
  try {
    const society = await Society.findById(req.params.id)
      .populate('adminId', 'name email')
      .populate('residents', 'name email vehicleNumber');

    if (!society) {
      return res.status(404).json({ success: false, message: 'Society not found' });
    }

    res.status(200).json({ success: true, data: society });
  } catch (error) {
    next(error);
  }
};

// @desc    Join society
// @route   POST /api/societies/:id/join
export const joinSociety = async (req, res, next) => {
  try {
    const society = await Society.findById(req.params.id);

    if (!society) {
      return res.status(404).json({ success: false, message: 'Society not found' });
    }

    if (society.residents.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    society.residents.push(req.user.id);
    await society.save();

    await User.findByIdAndUpdate(req.user.id, { societyId: society._id });

    res.status(200).json({ success: true, message: 'Joined society', data: society });
  } catch (error) {
    next(error);
  }
};

// @desc    Update society
// @route   PUT /api/societies/:id
export const updateSociety = async (req, res, next) => {
  try {
    const society = await Society.findById(req.params.id);

    if (!society) {
      return res.status(404).json({ success: false, message: 'Society not found' });
    }

    if (society.adminId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Society.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
