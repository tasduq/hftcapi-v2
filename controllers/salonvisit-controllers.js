const Salonvisit = require("../Models/Salonvisit");
const Images = require("../Models/Images");
var dateTime = require("node-datetime");
const { v4: uuidv4 } = require("uuid");

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

const addSalonVisit = async (req, res) => {
  const { userId, image, description, name } = req.body;
  console.log(userId, description);

  if (userId && image && description && name) {
    const foundSalonVisit = await Salonvisit.findOne({
      user: userId,
    });
    // console.log(foundSalonvisit);

    if (foundSalonVisit) {
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
            Salonvisit.updateOne(
              { user: userId },
              {
                $set: {
                  list: [
                    ...foundSalonVisit.list,
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
                    message: "Error Adding Salon visit",
                  });
                  return;
                } else {
                  res.json({
                    success: true,
                    message: "Salon visit  Added ",
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
            const createdSalonvisit = new Salonvisit({
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
            createdSalonvisit.save((err) => {
              if (err) {
                console.log(err);
                res.json({
                  sucess: false,
                  message: "Salonvisit Creation failed",
                });
                return;
              } else {
                res.json({
                  success: true,
                  message: "Salon visit Added",
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

const getSalonVisit = async (req, res) => {
  console.log("getting");
  const { userId } = req.body;
  const foundSalonVisit = await Salonvisit.findOne({ user: userId });
  // console.log(salons);

  if (foundSalonVisit) {
    res.json({
      success: true,
      foundSalonVisit,
      message: "Salon visit Found",
    });
  } else {
    res.json({
      success: false,
      message: "No Salon visit Exist for this user",
    });
  }
};

const getSalonVisitImage = async (req, res) => {
  const { image } = req.body;

  const salonVisitImage = await Images.findOne({ _id: image });
  if (salonVisitImage) {
    res.json({
      success: true,
      message: "Image found",
      image: salonVisitImage,
    });
  } else {
    res.json({ success: false, message: "Not found" });
  }
};

module.exports = {
  addSalonVisit,
  getSalonVisit,
  getSalonVisitImage,
};
