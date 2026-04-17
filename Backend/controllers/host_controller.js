const Home = require('../models/home');
const { serializeHome } = require('../utility/serializers');

const hostController = {
  // Get all homes for host
  getHomes: async (req, res) => {
    const homes = await Home.find().sort({ _id: -1 });
    return res.json({
      homes: homes.map(serializeHome),
    });
  },

  // Create new home
  createHome: async (req, res) => {
    const { houseName, price, location } = req.body;
    const photoFile = req.files?.photo ? req.files.photo[0] : null;
    const rulesPdfFile = req.files?.rulesPdf ? req.files.rulesPdf[0] : null;

    if (!photoFile) {
      return res.status(422).json({
        message: 'Please Upload png, jpg or jpeg type file',
        errors: ['Please Upload png, jpg or jpeg type file'],
      });
    }

    const home = new Home({
      houseName,
      price,
      location,
      photo: photoFile.path,
      rulesPdf: rulesPdfFile ? rulesPdfFile.path : '',
    });

    await home.save();

    return res.status(201).json({
      message: 'Home created successfully',
      home: serializeHome(home),
    });
  },

  // Update home
  updateHome: async (req, res) => {
    const { houseName, price, location } = req.body;
    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.status(404).json({ message: 'Home not found.' });
    }

    home.houseName = houseName;
    home.price = price;
    home.location = location;

    const photoFile = req.files?.photo ? req.files.photo[0] : null;
    const rulesPdfFile = req.files?.rulesPdf ? req.files.rulesPdf[0] : null;

    if (photoFile) {
      home.photo = photoFile.path;
    }

    if (rulesPdfFile) {
      home.rulesPdf = rulesPdfFile.path;
    }

    await home.save();

    return res.json({
      message: 'Home updated successfully',
      home: serializeHome(home),
    });
  },

  // Delete home
  deleteHome: async (req, res) => {
    await Home.findByIdAndDelete(req.params.homeId);

    return res.json({
      message: 'Home removed successfully',
    });
  }
};

module.exports = hostController;