const Appimages = require("../Models/Appimages");

const addAppImage = async (req, res) => {
  const { name, image } = req.body;

  const foundImage = await Appimages.findOne({ name: name });
  if (foundImage) {
    Appimages.updateOne(
      { name: name },
      {
        $set: { image: image },
      },
      async (err) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Error updating image",
          });
          return;
        } else {
          res.json({
            success: true,
            message: "Image Updated",
          });
          return;
        }
      }
    );
  } else {
    const createdAppImages = new Appimages({
      name,
      image,
    });

    try {
      createdAppImages.save(async (err, data) => {
        if (err) {
          //   console.log(err);
          res.json({
            success: false,
            message: "Error Saving Images",
            data: err,
          });
        } else {
          res.json({ success: true, message: "Image Saved Successfully" });
        }
      });
    } catch (err) {
      //   console.log(err);
      res.json({
        success: false,
        message: "Error Saving ImagesS",
        data: err,
      });
    }
  }
};

const getAppImages = async (req, res) => {
  let foundImages = await Appimages.find({});
  if (foundImages) {
    res.json({ success: true, appImages: foundImages });
  } else {
    res.json({ success: false, message: "images not found" });
  }
};

module.exports = {
  addAppImage,
  getAppImages,
};
