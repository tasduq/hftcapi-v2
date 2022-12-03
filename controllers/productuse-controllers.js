const Productuse = require("../Models/Productuse");
const Images = require("../Models/Images");
var dateTime = require("node-datetime");
const { v4: uuidv4 } = require("uuid");

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

const addProductUse = async (req, res) => {
  const { userId, image, description, name } = req.body;
  console.log(userId, description);

  if (userId && image && description && name) {
    const foundProductUse = await Productuse.findOne({ user: userId });
    // console.log(foundProductUse);

    if (foundProductUse) {
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
            Productuse.updateOne(
              { user: userId },
              {
                $set: {
                  list: [
                    ...foundProductUse.list,
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
                    message: "Error Adding Journal",
                  });
                  return;
                } else {
                  res.json({
                    success: true,
                    message: "Product Use Added ",
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
            const createdProductUse = new Productuse({
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
            createdProductUse.save((err) => {
              if (err) {
                console.log(err);
                res.json({
                  sucess: false,
                  message: "ProductUse Creation failed",
                });
                return;
              } else {
                res.json({
                  success: true,
                  message: "Product Use Added",
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

const getProductUse = async (req, res) => {
  console.log("getting");
  const { userId } = req.body;
  const foundProductUse = await Productuse.findOne({ user: userId });
  // console.log(salons);

  if (foundProductUse) {
    res.json({
      success: true,
      foundProductUse,
      message: "User Journal Found",
    });
  } else {
    res.json({
      success: false,
      message: "No journal Exist for this user",
    });
  }
};

const getProductUseImage = async (req, res) => {
  const { image } = req.body;

  const productUseImage = await Images.findOne({ _id: image });
  if (productUseImage) {
    res.json({ success: true, message: "Image found", image: productUseImage });
  } else {
    res.json({ success: false, message: "Not found" });
  }
};

module.exports = {
  addProductUse,
  getProductUse,
  getProductUseImage,
};
