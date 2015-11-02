var mongoose = require( "mongoose" );
var _ = require( "underscore" );

var DomoModel;

var setName = function( name )
{
    return _.escape( name ).trim();
};

var DomoSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName
    },
    
    age: {
        type: Number,
        min: 0,
        required: true
    },
    
    level: {
        type: Number,
        min: 0,
        required: true,
        default: 0
    },
    
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Account"
    },
    
    createdData: {
        type: Date,
        default: Date.now
    }
} );

DomoSchema.statics.findByOwner = function( ownerId, callback )
{
    var search = {
        owner: mongoose.Types.ObjectId( ownerId )
    };
    
    return DomoModel.find( search ).select( "name age level" ).exec( callback );
};

DomoSchema.statics.findNewest = function( callback )
{
    return DomoModel.find().sort( { createdData: -1 } ).select( "name age level" ).limit( 5 ).exec( callback );
};

DomoModel = mongoose.model( "Domo", DomoSchema );

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
