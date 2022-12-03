const Product = require("../Models/Product");
const Images = require("../Models/Images");
const Productrecom = require("../Models/Productsrecom");

const addProduct = (req, res) => {
  const { name, price, quantity, description, ingredients, images } = req.body;

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
        const createdProduct = new Product({
          name,
          price,
          quantity,
          description,
          ingredients,
          coverImage: images[0],
          imagesId: data._id,
        });

        await createdProduct.save((err) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "Error Saving Product",
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

const editProduct = async (req, res) => {
  const {
    name,
    price,
    quantity,
    description,
    ingredients,
    images,
    imagesId,
    _id,
  } = req.body;

  try {
    let updatedProduct = await Product.updateOne(
      { _id: _id },

      {
        $set: {
          name,
          price,
          quantity,
          description,
          ingredients,
          coverImage: images[0],
        },
      },
      async function (err) {
        console.log(err);
        if (err) {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        } else {
          await Images.updateOne(
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
                  message: "Product Updated",
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

const deleteProduct = async (req, res) => {
  console.log(req.body);
  const { id, imagesId } = req.body;

  try {
    let ad = await Product.deleteOne({ _id: id });
    try {
      await Images.deleteOne({ _id: imagesId });
      res.json({ success: true, message: "Product deleted" });
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

const getProduct = async (req, res) => {
  console.log("getting");
  const product = await Product.findOne({ _id: req.body.id });
  // console.log(products);
  if (product) {
    res.json({
      success: true,
      product: product,
      message: "product product Found",
    });
  } else {
    res.json({
      success: false,
      message: "Error Finding Products",
    });
  }
};

const getProductImages = async (req, res) => {
  console.log("getting");
  const images = await Images.findOne({ _id: req.body.id });
  // console.log(products);
  if (images) {
    res.json({
      success: true,
      images: images,
      message: "product images Found",
    });
  } else {
    res.json({
      success: false,
      message: "Error Finding Products",
    });
  }
};
const getProducts = async (req, res) => {
  console.log("getting");
  const products = await Product.find({});
  // console.log(products);

  res.json({
    success: true,
    products,
    message: "products Found",
  });
  // } else {
  //   res.json({
  //     success: false,
  //     message: "Error Finding Products",
  //   });
  // }
};

const getProductRecom = async (req, res) => {
  const productsList = await Productrecom.find();
  if (productsList) {
    let products = await Product.find({ _id: productsList });
    if (products) {
      res.json({
        success: true,
        products: products,
        message: " products Found",
      });
    } else {
      res.json({
        success: false,
        message: "Error Finding Products",
      });
    }
  }
  // console.log(products);
};

const getProductRecomIds = async (req, res) => {
  const productsList = await Productrecom.find({});
  console.log(productsList);
  if (productsList) {
    res.json({
      success: true,
      products: productsList[0],
      message: " products iDs Found",
    });
  } else {
    res.json({
      success: false,
      message: "Error Finding Products",
    });
  }
  // console.log(products);
};

const addProductRecom = async (req, res) => {
  const { id, productsList } = req.body;
  console.log(productsList);

  const foundList = await Productrecom.findOne({ _id: id });
  console.log(foundList);
  if (foundList) {
    try {
      let updatedQuestion = Productrecom.updateOne(
        { _id: id },

        {
          $set: { productsIds: productsList },
        }
      )
        .then((response) => {
          console.log(response);
          res.json({ success: true, message: "List Updated" });
        })
        .catch((err) => {
          console.log(err);
          res.json({ success: false, message: "List  Updating Error" });
        });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Failed updating",
      });
    }
  } else {
    const createdList = new Productrecom({
      productIds: productsList,
    });

    try {
      createdList.save((err) => {
        if (err) {
          res.json({
            success: false,
            data: err,
            message: "Creating List failed",
          });
          return;
        } else {
          console.log({ message: "List created", createdList });

          res.status(200).send({
            message: "List created",
            success: true,
          });
        }
      });
    } catch (err) {
      res.json({
        success: false,
        data: err,
        message: "Creating List failed",
      });
    }
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductImages,
  editProduct,
  deleteProduct,
  getProduct,
  addProductRecom,
  getProductRecom,
  getProductRecomIds,
};
