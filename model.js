'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    email: {type:String, unique: true, required:true},
    friends: {type: Array}
});

const billSchema = mongoose.Schema({
    lender_email: {type: String, required:true},
    lender_name: {type: String, required:true}, 
    borrower_name: {type: String},
    borrower_email: {type: String}, 
    description: {type: String}, 
    amount:{ type: Number, required:true},
    share_amount: {type:Number}, 
    date:{type: Date, default: Date.now}, 
    paid:{type: Boolean, default:false}, 
    deleted: {type:Boolean, default:false},
    added_by: {type: String, required:true},
    shared_bill:{type:Boolean, default:true}
});


userSchema.methods.serialize = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName:this.lastName,
    email: this.email,
    friends: this.friends
  };
};

billSchema.methods.serialize = function() {
  return {
    id: this._id,
    lender_email: this.lender_email,
    lender_name: this.lender_name,
    borrower_name: this.borrower_name,
    borrower_email: this.borrower_email,
    description: this.description,
    amount:this.amount,
    share_amount: this.share_amount, 
    date: this.date, 
    paid: this.paid, 
    deleted: this.deleted,
    added_by: this.added_by,
    shared_bill:this.shared_bill
  };
};

const User = mongoose.model('User', userSchema);
const Bill = mongoose.model('Bill', billSchema);

module.exports = {User, Bill};