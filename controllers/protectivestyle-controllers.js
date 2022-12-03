const Protectivestyle = require("../Models/Protectivestyle");
const Images = require("../Models/Images");
var dateTime = require("node-datetime");
const { v4: uuidv4 } = require("uuid");

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

const addProtectiveStyle = async (req, res) => {
  const { userId, image, description, name } = req.body;
  console.log(userId, description);

  if (userId && image && description && name) {
    const foundProtectiveStyle = await Protectivestyle.findOne({
      user: userId,
    });
    // console.log(foundProtectiveStyle);

    if (foundProtectiveStyle) {
      const createdImages = new Images({
        images: [image],
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
            Protectivestyle.updateOne(
              { user: userId },
              {
                $set: {
                  list: [
                    ...foundProtectiveStyle.list,
                    {
                      id: uuidv4(),
                      name,
                      description,
                      image: data._id,
                      date: formatted,
                    },
                  ],
                },
              },
              async (err) => {
                if (err) {
                  console.log(err);
                  res.json({
                    success: false,
                    message: "Error Adding Protective Style",
                  });
                  return;
                } else {
                  res.json({
                    success: true,
                    message: "Protective style  Added ",
                  });
                  return;
                }
              }
            );
          }
        });
      } catch (err) {
        console.log(err);
        res.json({
          success: false,
          message: "Error Saving ImagesS",
        });
        return;
      }
    } else {
      const createdImages = new Images({
        images: [image],
      });
      try {
        createdImages.save(async (err, data) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "Error Saving Images",
            });
            return;
          } else {
            const createdProtectivestyle = new Protectivestyle({
              user: userId,
              list: [
                {
                  id: uuidv4(),
                  name,
                  description,
                  image: data._id,
                  date: formatted,
                },
              ],
            });
            createdProtectivestyle.save((err) => {
              if (err) {
                console.log(err);
                res.json({
                  sucess: false,
                  message: "Protective style Creation failed",
                });
                return;
              } else {
                res.json({
                  success: true,
                  message: "Protective style Added",
                });
                return;
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
        return;
      }
    }
  }
};

const getProtectiveStyle = async (req, res) => {
  console.log("getting");
  const { userId } = req.body;
  const foundProtectiveStyle = await Protectivestyle.findOne({ user: userId });
  // console.log(salons);

  if (foundProtectiveStyle) {
    res.json({
      success: true,
      foundProtectiveStyle,
      message: "Protective style Found",
    });
  } else {
    res.json({
      success: false,
      message: "No Protective style Exist for this user",
    });
  }
};

const getProtectiveStyleImage = async (req, res) => {
  const { image } = req.body;

  const protectivestyleImage = await Images.findOne({ _id: image });
  if (protectivestyleImage) {
    res.json({
      success: true,
      message: "Image found",
      image: protectivestyleImage,
    });
  } else {
    res.json({ success: false, message: "Not found" });
  }
};

module.exports = {
  addProtectiveStyle,
  getProtectiveStyle,
  getProtectiveStyleImage,
};
