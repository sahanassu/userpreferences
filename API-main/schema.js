const mongoose = require('mongoose');

const preferenceKeyValueSchema = new mongoose.Schema({
  
    key: {
        type: String,
        required: true,
        
    },

    value: {
        type: Number,
        required: true
    }
    

});

const userPreference = new mongoose.Schema(
    //{
    //userId: {
        //type: mongoose.Schema.Types.ObjectId,
        //required: true,
        //default: mongoose.Types.ObjectId
    //},
    {
    name: {
        type: String,
        //required: true
    },
    
    preferences: {
        keyValues: [preferenceKeyValueSchema],
        default: []
    }
},{timestamps:{}});

const UserPref= mongoose.model('UserPref', userPreference);

module.exports = UserPref;