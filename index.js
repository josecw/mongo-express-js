const express = require('express');
const cors = require('cors');

// get MongoDB driver connection
const dbo = require('./db/connection');

const PORT = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.disable("x-powered-by");
app.use(express.json());
app.use('/api/profiles', require('./routes/profiles'));

// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get('/', (_req, res) => {
    console.info("Health Check Successful")
    res.send("Applcation Up!");
});


// perform a database connection when the server starts
dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        process.exit();
    }

    // start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
});


module.exports = { app }; 