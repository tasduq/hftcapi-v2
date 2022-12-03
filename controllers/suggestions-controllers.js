const Suggestions = require("../Models/Suggestions");

const addList = async (req, res) => {
  const { name, suggestion } = req.body;
  console.log(name, "i am name");

  const foundList = await Suggestions.findOne({ name: name });
  console.log(foundList);
  if (foundList) {
    let updatedSuggestionsList = [...foundList.suggestions, suggestion];
    console.log(updatedSuggestionsList);
    try {
      let updatedQuestion = Suggestions.updateOne(
        { name: name },

        {
          $set: { suggestions: updatedSuggestionsList },
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
    const createdList = new Suggestions({
      name,
      suggestions: [suggestion],
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

const deleteSuggestion = async (req, res) => {
  console.log(req.body);
  const { name, suggestion } = req.body;

  const foundList = await Suggestions.findOne({ name: name });
  if (foundList) {
    let updatedSuggestionsList = foundList.suggestions.filter(
      (suggestionFromList) => {
        return suggestionFromList !== suggestion;
      }
    );
    console.log(updatedSuggestionsList);
    try {
      let updatedQuestion = Suggestions.updateOne(
        { name: name },

        {
          $set: { suggestions: updatedSuggestionsList },
        }
      )
        .then((response) => {
          console.log(response);
          res.json({ success: true, message: "Suggestion Deleted Updated" });
        })
        .catch((err) => {
          console.log(err);
          res.json({ success: false, message: "Suggestion Deleted Error" });
        });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Failed Deleting",
      });
    }
  }
};

const getAllLists = async (req, res) => {
  const lists = await Suggestions.find({});
  if (lists) {
    res.json({
      success: true,
      suggestions: lists,
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
  let foundList = await Suggestions.findOne({ name: name });
  if (foundList) {
    res.json({
      success: true,
      suggestions: foundList,
      message: "Found list of suggestions",
    });
    return;
  } else {
    res.json({
      success: true,
      message: " list of suggestions not found",
    });
  }
};

module.exports = {
  addList,
  getAllLists,
  getSingleList,
  deleteSuggestion,
};
