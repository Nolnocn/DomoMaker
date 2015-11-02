var models = require( "../models" );

var Account = models.Account;

var loginPage = function( req, res )
{
    res.render( "login", { csrfToken: req.csrfToken() } );
};

var signupPage = function( req, res )
{
    res.render( "signup", { csrfToken: req.csrfToken() } );
};

var logout = function( req, res )
{
    req.session.destroy();
    res.redirect( "/" );
};

var login = function( req, res )
{
    var body = req.body;
    if( !body.username || !body.pass )
    {
        return res.status( 400 ).json( { error: "all fields required" } );
    }
    
    Account.AccountModel.authenticate( body.username, body.pass, function( err, account ) {
        if( err || !account )
        {
            return res.status( 400 ).json( { error: "wrong username or passwaord" } );
        }
        
        req.session.account = account.toAPI();
        
        res.json( { redirect: "/maker" } );
    } );
};

var signup = function( req, res )
{
    var body = req.body;
    if( !body.username || !body.pass || !body.pass2 )
    {
        return res.status( 400 ).json( { error: "all fields required" } );
    }
    
    if( body.pass !== body.pass2 )
    {
        return res.status( 400 ).json( { error: "passwords don't match" } );
    }
    
    Account.AccountModel.generateHash( body.pass, function( salt, hash) {
        var accountData = {
            username: body.username,
            salt: salt,
            password: hash
        };
        
        var newAccount = new Account.AccountModel( accountData );
        
        newAccount.save( function( err ) {
            if( err )
            {
                console.log( err );
                return res.status( 400 ).json( { error: "an error occured" } );
            }
            
            req.session.account = newAccount.toAPI();
            
            res.json( { redirect: "/maker" } );
        } );
    } );
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
