const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const usersRoutes = require("./Routes/User-routes");
const quizRoutes = require("./Routes/Quiz-routes");
const weekQuizRoutes = require("./Routes/Weekquiz-routes");
const monthQuizRoutes = require("./Routes/Monthquiz-routes");
const quoteRoutes = require("./Routes/Quotes-routes");
const productRoutes = require("./Routes/Product-routes");
const styleRoutes = require("./Routes/Style-routes");
const salonRoutes = require("./Routes/Salon-routes");
const appImagesRoutes = require("./Routes/Appimages-routes");
const hairJournalRoutes = require("./Routes/Hairjournal-routes");
const productUseRoutes = require("./Routes/Productuse-routes");
const protectiveStyleRoutes = require("./Routes/Protectivestyle-routes");
const salonVisitRoutes = require("./Routes/Salonvisit-routes");
const goalsRoutes = require("./Routes/Goals-routes");
const suggestionsRoutes = require("./Routes/Suggestions-routes");
const productScoreRecomRoutes = require("./Routes/Productscorerecom-routes");

const PORT = process.env.PORT || 3001;
const { db } = require("./Config/config");

const app = express();

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// let db;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    //   useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((client) => {
    // console.log(db);
    // console.log(client.connections[0].db);

    // db = client.connections[0].db;
    // app.set("db", db);
    console.log("db connected");
  })
  .catch((err) => {
    console.log("error", err.message);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requseted-With, Content-Type, Accept , Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");

  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/weekquiz", weekQuizRoutes);
app.use("/api/monthquiz", monthQuizRoutes);
app.use("/api/productscorerecom", productScoreRecomRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/product", productRoutes);
app.use("/api/style", styleRoutes);
app.use("/api/salon", salonRoutes);
app.use("/api/appimages", appImagesRoutes);
app.use("/api/hairjournal", hairJournalRoutes);
app.use("/api/productuse", productUseRoutes);
app.use("/api/protectivestyle", protectiveStyleRoutes);
app.use("/api/salonvisit", salonVisitRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/suggestions", suggestionsRoutes);

app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
