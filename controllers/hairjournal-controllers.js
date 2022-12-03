const Hairjournal = require("../Models/Hairjournal");
const Images = require("../Models/Images");
var dateTime = require("node-datetime");
const { v4: uuidv4 } = require("uuid");

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

const addJournal = async (req, res) => {
  const { userId, image, description } = req.body;
  console.log(userId, description);

  if (userId && image && description) {
    const foundUserJournal = await Hairjournal.findOne({ user: userId });
    // console.log(foundUserJournal);

    if (foundUserJournal) {
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
            Hairjournal.updateOne(
              { user: userId },
              {
                $set: {
                  list: [
                    ...foundUserJournal.list,
                    {
                      journalId: uuidv4(),
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
                    message: "Journal Added ",
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
            const createdJournal = new Hairjournal({
              user: userId,
              list: [
                {
                  journalId: uuidv4(),
                  description,
                  image: data._id,
                  date: formatted,
                },
              ],
            });
            createdJournal.save((err) => {
              if (err) {
                console.log(err);
                res.json({
                  sucess: false,
                  message: "Journal Creation failed",
                });
                return;
              } else {
                res.json({
                  success: true,
                  message: "Journal Added",
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

const getUserJournal = async (req, res) => {
  console.log("getting");
  const { userId } = req.body;
  const foundUserJournal = await Hairjournal.findOne({ user: userId });
  // console.log(salons);

  if (foundUserJournal) {
    res.json({
      success: true,
      foundUserJournal,
      message: "User Journal Found",
    });
  } else {
    res.json({
      success: false,
      message: "No journal Exist for this user",
    });
  }
};

const getJournalImage = async (req, res) => {
  const { image } = req.body;

  const journalImage = await Images.findOne({ _id: image });
  if (journalImage) {
    res.json({ success: true, message: "Image found", image: journalImage });
  } else {
    res.json({ success: false, message: "Not found" });
  }
};

module.exports = {
  addJournal,
  getUserJournal,
  getJournalImage,
};
