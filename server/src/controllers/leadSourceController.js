/**
 * Lead Source Controller
 * Handles lead source CRUD operations
 */

import LeadSource from '../models/LeadSource.js';
import Lead from '../models/Lead.js';

/**
 * Create a new lead source
 */
export const createLeadSourceHandler = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const leadSource = await LeadSource.create({
      name,
      description: description || '',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Lead source created successfully',
      data: leadSource
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Lead source with this name already exists'
      });
    }
    next(error);
  }
};

/**
 * Get all lead sources with pagination and filters
 */
export const getAllLeadSourcesHandler = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [leadSources, total] = await Promise.all([
      LeadSource.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      LeadSource.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      message: 'Lead sources retrieved successfully',
      data: {
        data: leadSources,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all active lead sources (for dropdowns)
 */
export const getActiveLeadSourcesHandler = async (req, res, next) => {
  try {
    const leadSources = await LeadSource.find({ status: 'active' })
      .sort({ name: 1 })
      .select('_id name');

    res.status(200).json({
      success: true,
      message: 'Active lead sources retrieved successfully',
      data: leadSources
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get lead source by ID
 */
export const getLeadSourceByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const leadSource = await LeadSource.findById(id);

    if (!leadSource) {
      return res.status(404).json({
        success: false,
        message: 'Lead source not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead source retrieved successfully',
      data: leadSource
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update lead source by ID
 */
export const updateLeadSourceHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const leadSource = await LeadSource.findById(id);

    if (!leadSource) {
      return res.status(404).json({
        success: false,
        message: 'Lead source not found'
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== leadSource.name) {
      const existingSource = await LeadSource.findOne({ name });
      if (existingSource) {
        return res.status(400).json({
          success: false,
          message: 'Lead source with this name already exists'
        });
      }
    }

    const updateData = { name, description };
    if (status !== undefined) {
      updateData.status = status;
    }

    const updatedLeadSource = await LeadSource.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Lead source updated successfully',
      data: updatedLeadSource
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update lead source status
 */
export const updateLeadSourceStatusHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or inactive'
      });
    }

    const leadSource = await LeadSource.findById(id);

    if (!leadSource) {
      return res.status(404).json({
        success: false,
        message: 'Lead source not found'
      });
    }

    leadSource.status = status;
    await leadSource.save();

    res.status(200).json({
      success: true,
      message: 'Lead source status updated successfully',
      data: leadSource
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete lead source by ID (permanent delete with reference check)
 */
export const deleteLeadSourceHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const leadSource = await LeadSource.findById(id);

    if (!leadSource) {
      return res.status(404).json({
        success: false,
        message: 'Lead source not found'
      });
    }

    // Check if any leads reference this lead source
    const leadsUsingSource = await Lead.countDocuments({ source: leadSource.name });

    if (leadsUsingSource > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete lead source "${leadSource.name}" because it is referenced by ${leadsUsingSource} lead(s). Please deactivate it instead.`
      });
    }

    // Perform permanent delete
    await LeadSource.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Lead source deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
