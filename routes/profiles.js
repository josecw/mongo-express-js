const express = require('express');

// profileRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const profileRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/connection');

// This section will help you get a list of all the records.
profileRoutes.route('/').get(async function (_req, res) {
    const dbConnect = dbo.getDb();

    await dbConnect
        .collection('profiles')
        .find({})
        .toArray(function (err, result) {
            if (err) {
                console.log(err)
                res.status(400).send('Error in listing profiles');
            } else {
                res.json(result);
            }
        });
});

// This section will help you create a new record.
profileRoutes.route('/').post(async function (req, res) {
    const dbConnect = dbo.getDb();
    const matchDocument = req.body

    matchDocument["last_updated_dt"] = new Date();
    await dbConnect
        .collection('profiles')
        .insertOne(matchDocument, function (err, result) {
            if (err) {
                res.status(400).send('Error inserting matches!');
            } else {
                console.log(`Added a new match with id ${result.insertedId}`);
                res.status(200).send({'org_id': req.body.org_id});
            }
        });
});

// This section will help you update a record by id.
profileRoutes.route('/:id').post(async function (req, res) {
    const dbConnect = dbo.getDb();
    const query = { org_id: req.params.id };
    const updates = req.body;

    updates["last_updated_dt"] = new Date();

    await dbConnect
        .collection('profiles')
        .replaceOne(query, updates, {upsert: true}, function (err, _result) {
            if (err) {
                res
                    .status(400)
                    .send(`Error updating likes on listing with id ${query.org_id}!`);
            } else {
                console.log('1 profile updated');
                res.status(200).send();
            }
        });
});

// This section will help you retrieve a record by id.
profileRoutes.route('/:id').get(async function (req, res) {
    const dbConnect = dbo.getDb();
    const query = { org_id: req.params.id };

    await dbConnect
        .collection('profiles')
        .findOne(query, function (err, result) {
            if (err) {
                console.log(err)
                res.status(400).send('Error in listing profiles');
            } else if (result) {
                res.json(result);
                console.log(`Profile ${query.org_id} retrieved successfully`);
            } else {
                res.status(204).send();
                console.log(`Profile ${query.org_id} not found`);
            }
        });
});

// This section will help you delete a record by id.
profileRoutes.route('/:id').delete(async function (req, res) {
    const dbConnect = dbo.getDb();
    const query = { org_id: req.params.id };

    await dbConnect
        .collection('profiles')
        .deleteOne(query, function (err, _result) {
            if (err) {
                console.log(err)
                res.status(400).send(`Error in delete profile with id ${query.org_id}!`);
            } else {
                console.log(`Profile ${query.org_id} deleted successfully`);
                res.status(200).send();
            }
        });
});

module.exports = profileRoutes;