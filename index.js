const express = require("express");
const URL = require("./model/url")
const {connectToMongoDb} = require("./connect");
const cookieParser = require("cookie-parser")
const {checkForAutentication, restrictTo} = require('./middlewares/auth')
const app = express();
const PORT = 8001;
const path = require("path")

const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter")
const userRoute = require('./routes/user')

connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(() => console.log("MongoDb connected"));

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAutentication);

app.use(express.static('public'));

app.use("/url",restrictTo(["NORMAL", "ADMIN"]) , urlRoute);
app.use("/user", userRoute);
app.use("/", staticRouter);


app.get('/url/:shortId', async(req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
    {
        shortId,
    }, {$push: {
        visitHistory:{
            timestamps: Date.now(),
        }, 
    },
});
    res.redirect(entry.redirectURL);
});

app.get('/signup', (req, res) => {
    res.render("signup")
});

app.listen(PORT, () => console.log(`server started at port:, ${PORT} `));
