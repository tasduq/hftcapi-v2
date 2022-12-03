const Style = require("../Models/Styles");
const Images = require("../Models/Images");

const addStyle = (req, res) => {
  const { name, description, images } = req.body;

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
        const createdStyle = new Style({
          name,
          description,
          coverImage: images[0],
          imagesId: data._id,
        });

        await createdStyle.save((err) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "Error Saving Style",
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

const editStyle = async (req, res) => {
  const { name, description, images, imagesId, _id } = req.body;

  try {
    let updatedStyle = Style.updateOne(
      { _id: _id },

      {
        $set: {
          name,
          description,
          coverImage: images[0],
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
                  message: "Style Updated",
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

const getStyles = async (req, res) => {
  console.log("getting");
  const styles = await Style.find({});
  // console.log(styles);

  if (styles) {
    res.json({
      success: true,
      styles,
      message: "styles Found",
    });
  } else {
    res.json({
      success: false,
      message: "Error Finding styles",
    });
  }
};

const getStyleImages = async (req, res) => {
  console.log("getting");
  const images = await Images.findOne({ _id: req.body.id });
  // console.log(Styles);
  if (images) {
    res.json({
      success: true,
      images: images,
      message: "style images Found",
    });
  } else {
    res.json({
      success: false,
      message: "Error Finding styles",
    });
  }
};

const deleteStyle = async (req, res) => {
  console.log(req.body);
  const { id, imagesId } = req.body;

  try {
    let ad = await Style.deleteOne({ _id: id });
    try {
      await Images.deleteOne({ _id: imagesId });
      res.json({ success: true, message: "Style deleted" });
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
  addStyle,
  getStyles,
  getStyleImages,
  editStyle,
  deleteStyle,
};
