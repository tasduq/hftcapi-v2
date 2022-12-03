const Salon = require("../Models/Salon");
const Images = require("../Models/Images");

const addSalon = (req, res) => {
  const { name, description, images, location } = req.body;

  const createdImages = new Images({
    images,
  });

  try {
    createdImages.save(async (err, data) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          message: "Error Saving Images",
        });
      } else {
        const createdSalon = new Salon({
          name,
          description,
          coverImage: images[0],
          imagesId: data._id,
          location,
        });

        await createdSalon.save((err) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "Error Saving Salon",
            });
          } else {
            res.json({
              success: true,
              message: "Procuct Saved",
            });
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error Saving ImagesS",
    });
  }
};

const editSalon = async (req, res) => {
  const { name, description, images, imagesId, _id, location } = req.body;

  try {
    let updatedStyle = Salon.updateOne(
      { _id: _id },

      {
        $set: {
          name,
          description,
          coverImage: images[0],
          location,
        },
      },
      function (err) {
        console.log(err);
        if (err) {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        } else {
          Images.updateOne(
            { _id: imagesId },
            {
              $set: { images: images },
            },
            async (err) => {
              if (err) {
                console.log(err);
                res.json({
                  success: false,
                  message: "Error updating images",
                });
                return;
              } else {
                res.json({
                  success: true,
                  message: "Salon Updated",
                });
                return;
              }
            }
          );
        }
      }
    )
      .clone()
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error Saving ImagesS",
    });
  }
};

const getSalons = async (req, res) => {
  console.log("getting");
  const salons = await Salon.find({});
  // console.log(salons);

  if (salons) {
    res.json({
      success: true,
      salons,
      message: "salons Found",
    });
  } else {
    res.json({
      success: false,
      message: "Error Finding salons",
    });
  }
};

const getSalonImages = async (req, res) => {
  console.log("getting");
  const images = await Images.findOne({ _id: req.body.id });
  // console.log(Styles);
  if (images) {
    res.json({
      success: true,
      images: images,
      message: "salon images Found",
    });
  } else {
    res.json({
      success: false,
      message: "Error Finding salons",
    });
  }
};

const deleteSalon = async (req, res) => {
  console.log(req.body);
  const { id, imagesId } = req.body;

  try {
    let ad = await Salon.deleteOne({ _id: id });
    try {
      await Images.deleteOne({ _id: imagesId });
      res.json({ success: true, message: "Salon deleted" });
      return;
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: "Deleteing Images Failed" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
    return;
  }
};

module.exports = {
  addSalon,
  getSalons,
  getSalonImages,
  editSalon,
  deleteSalon,
};
