'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {User, Bill} = require('./model');

app.use(express.static('public'));
app.use(express.json());

app.get('/user', (req,res) => {
    User.find()
    .then(user => res.status(200).json(user.map(user => user.serialize())));
});

app.post('/user', (req,res) => {
    const requiredFields = ["firstName", "lastName", "email"];

    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
          const message = `Missing \`${field}\` in request body`;
          console.error(message);
          return res.status(400).send(message);
        }
    }

    User.create(
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            friends: req.body.friends
        }
    )
    .then(user => res.status(201).json(user.serialize()));
});

app.put('/user/:id', (req,res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
          error: 'Request path id and request body id values must match'
        });
    }

    const updated = {};
    const updateableFields = ['firstName', 'lastName'];
    updateableFields.forEach(field => {
        if (field in req.body) {
        updated[field] = req.body[field];
        }
    });

    User
    .update({id:req.params.id}, { $set: updated })
    .then(user => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

app.get('/bill', (req,res) => {
    Bill
    .find()
    .then(bill => res.status(200).json(bill.serialize()));
});

app.post('/bill', (req,res) => {
    const requiredFields = ['lender_email', 'lender_name', 'borrower_name', 'borrower_email', 'description', 'amount', 'share_amount', 'date', 'added_by','shared_bill'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
          const message = `Missing \`${field}\` in request body`;
          console.error(message);
          return res.status(400).send(message);
        }
    }

    Bill.create(
        {
            lender_email: req.body.lender_email,
            lender_name: req.body.lender_name,
            borrower_name: req.body.borrower_name,
            borrower_email: req.body.borrower_email,
            description: req.body.description,
            amount: req.body.amount,
            share_amount: req.body.share_amount, 
            date: req.body.date, 
            paid: req.body.paid, 
            deleted: req.body.deleted,
            added_by: req.body.added_by,
            shared_bill: req.body.shared_bill
        }
    )
    .then(bill => res.status(201).json(bill.serialize()));
});

/*if(require.main === module) {
    app.listen(process.env.PORT || 8080, function(){
        console.info(`Your app is listening on the port ${this.address().port}`);
    });
}*/

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = app;