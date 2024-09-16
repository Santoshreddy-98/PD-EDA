const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./router/DA_router/userRouter');
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
const checklistRouter = require('./router/checklistRouter');
const port = process.env.PORT;
app.use(cors());

// Connect to MongoDB
const MongoUrl = process.env.MongoUri
const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(MongoUrl, {
            useNewUrlParser: true
        });
        console.log("connected to db")
    }
    catch (e) {
        console.log('Failed to connect to MongoDB', e)
        throw e
    }
}
// MongoDb connection  
InitiateMongoServer();

// Middleware to parse request bodies as JSON   

app.use(express.json());
app.use(bodyParser.json());

// Routes 

app.use('/api', userRouter);
app.use("/api", checklistRouter)


// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


const _dirname = path.dirname("")
const builPath = path.join(_dirname, "../ui_server/build");
// app.use(express.static(builPath))
app.use(express.static(path.join(builPath)));
app.get("/*", function (req, res) {
    res.sendFile('index.html',
        { root: path.join(_dirname, "../ui_server/build") },
        function (err) {
            if (err) {
                res.status(500).send(err)
            }
        }
    );
})
// Start the server

app.listen(port, () => {

    console.log(`Server is running on port ${port}`);

});
