const Productscorerecom = require("../Models/Productscorerecom");

const addList = async (req, res) => {
  const { name, products } = req.body;

  const foundList = await Productscorerecom.findOne({ name: name });
  if (foundList) {
    try {
      let updatedQuestion = Productscorerecom.updateOne(
        { name: name },

        {
          $set: { products: products },
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
    const createdList = new Productscorerecom({
      name,
      products,
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

const getLists = async (req, res) => {
  const lists = await Productscorerecom.find({});
  if (lists) {
    res.json({
      success: true,
      lists,
      message: "Lists Found",
    });
  } else {
    res.json({
      success: false,
      message: "Lists Not Found",
    });
  }
};

const getSingleList = async (req, res) => {
  const { name } = req.body;
  console.log(req.body);
  if (name === 1) {
    products = await Productscorerecom.findOne({ name: "1" });
    res.status(200).send({
      message: "List found",
      success: true,
      products,
    });
    return;
  } else if (name === 2) {
    products = await Productscorerecom.findOne({ name: "2" });
    res.status(200).send({
      message: "List found",
      success: true,
      products,
    });
    return;
  } else if (name === 3) {
    products = await Productscorerecom.findOne({ name: "3" });
    res.status(200).send({
      message: "List found",
      success: true,
      products,
    });
    return;
  }
};

module.exports = {
  addList,
  getLists,
  getSingleList,
};
