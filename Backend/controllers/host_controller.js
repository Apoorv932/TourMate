const Guide = require('../models/guide');
const { serializeGuide } = require('../utility/serializers');

const hostController = {
  // Get all guides for host
  getGuides: async (req, res) => {
    const guides = await Guide.find().sort({ _id: -1 });
    return res.json({
      guides: guides.map(serializeGuide),
    });
  },

  // Create new guide
  createGuide: async (req, res) => {
    const { name, bio, location, pricePerHour, languages, specialties } = req.body;
    const photoFile = req.files?.photo ? req.files.photo[0] : null;

    if (!photoFile) {
      return res.status(422).json({
        message: 'Please Upload png, jpg or jpeg type file',
        errors: ['Please Upload png, jpg or jpeg type file'],
      });
    }

    const guide = new Guide({
      name,
      bio,
      location,
      pricePerHour,
      languages,
      specialties,
      photo: photoFile.path,
      isAvailable: true,
    });

    await guide.save();

    return res.status(201).json({
      message: 'Guide created successfully',
      guide: serializeGuide(guide),
    });
  },

  // Update guide
  updateGuide: async (req, res) => {
    const { name, bio, location, pricePerHour, languages, specialties } = req.body;
    const guide = await Guide.findById(req.params.guideId);

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found.' });
    }

    guide.name = name;
    guide.bio = bio;
    guide.location = location;
    guide.pricePerHour = pricePerHour;
    guide.languages = languages;
    guide.specialties = specialties;

    const photoFile = req.files?.photo ? req.files.photo[0] : null;

    if (photoFile) {
      guide.photo = photoFile.path;
    }

    await guide.save();

    return res.json({
      message: 'Guide updated successfully',
      guide: serializeGuide(guide),
    });
  },

  // Delete guide
  deleteGuide: async (req, res) => {
    await Guide.findByIdAndDelete(req.params.guideId);

    return res.json({
      message: 'Guide removed successfully',
    });
  }
};

module.exports = hostController;