const Quote = require("../Models/Quotes");

const addQuote = async (req, res) => {
  const { quote, number } = req.body;
  console.log(req.body);

  const createdQuote = new Quote({
    quote,
    number,
  });

  try {
    let existingQuote = await Quote.findOne({ number: Number(number) });
    console.log(existingQuote);

    if (existingQuote) {
      res.json({
        success: false,
        message: "A quote already exist for that Day or Number",
      });
      return;
    } else {
      try {
        createdQuote.save(async (err) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "Error Saving Quote",
              data: err,
            });
          } else {
            res.json({
              success: true,
              message: "Quote Got Saved",
            });
          }
        });
      } catch (err) {
        console.log(err);
        res.json({
          success: false,
          message: "Error Saving Quote",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const editquote = async (req, res) => {
  const { quote, number, _id } = req.body;

  try {
    let existingQuote = await Quote.findOne({ number: Number(number) });
    console.log(existingQuote);

    if (existingQuote) {
      res.json({
        success: false,
        message: "A quote already exist for that Day or Number",
      });
      return;
    } else {
      let updatedquote = await Quote.updateOne(
        { _id: _id },

        {
          $set: { quote, number },
        }
      )
        .then((response) => {
          console.log(response);
          res.json({ success: true, message: "quote Updated" });
        })
        .catch((err) => {
          console.log(err);
          res.json({ success: false, message: "quote  Updating Error" });
        });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error Saving Quote",
    });
  }
};

const deleteQuote = async (req, res) => {
  console.log(req.body);

  const { id } = req.body;

  console.log(id);

  try {
    let quote = await Quote.deleteOne({ _id: id });
    res.json({ success: true, message: "Quote deleted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
    return;
  }
};

const getQuote = async (req, res) => {
  const { number } = req.body;
  const quote = await Quote.findOne({ number: number });

  if (quote) {
    res.json({ success: true, message: "Quote Found", quote });
  } else {
    res.json({ success: false, message: "Quote Founding Error" });
  }
};

const getQuotes = async (req, res) => {
  const quotes = await Quote.find({});

  if (quotes) {
    res.json({ success: true, message: "Quote Found", quotes });
  } else {
    res.json({ success: false, message: "Quote Founding Error" });
  }
};

module.exports = {
  addQuote,
  getQuote,
  getQuotes,
  editquote,
  deleteQuote,
};
