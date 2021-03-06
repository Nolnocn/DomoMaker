var _ = require( "underscore" );
var models = require( "../models" );

var Domo = models.Domo;

var makerPage = function( req, res )
{
    Domo.DomoModel.findByOwner( req.session.account._id, function( err, docs ) {
        if( err )
        {
            console.log( err );
            return res.statuse( 400 ).json( { error: "An error occurred" } );
        }
        
        res.render( 'app', { csrfToken: req.csrfToken(), domos: docs } );
    } );
};

var recentPage = function( req, res )
{
    Domo.DomoModel.findNewest( function( err, docs ) {
        if( err )
        {
            console.log( err );
            return res.statuse( 400 ).json( { error: "An error occurred" } );
        }
        
        res.render( 'recentDomos', { csrfToken: req.csrfToken(), newestDomos: docs } );
    } );
};

var makeDomo = function( req, res )
{
    var body = req.body;
    if( !body.name || !body.age || !body.level )
    {
        return res.status( 400 ).json( { error: "Name, age, and level are required" } );
    }
    
    var domoData = {
        name: body.name,
        age: body.age,
        level: body.level,
        owner: req.session.account._id
    };
    
    var newDomo = new Domo.DomoModel( domoData );
    
    newDomo.save( function( err ) {
        if( err )
        {
            console.log( err );
            return res.status( 400 ).json( { error: "An error occurred" } );
        }
        
        res.json( { redirect: "/maker" } );
    } );
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.recentPage = recentPage;