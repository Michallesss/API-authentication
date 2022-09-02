const mongodb=require('mongodb').MongoClient;
const router=require('express').Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const verify=require('./verifytoken');
module.exports=router;

// Connect to DB
const url='mongodb://127.0.0.1:27017'; // ! DB url
mongodb.connect(url, {}, (err, client)=>{
    if(err) {
        return console.error('\x1b[31m','Database error:','\x1b[0m',err);
    }
    else {
        console.log('\x1b[32m','Server connected','\x1b[0m',`(on url ${url})...`);
    }
    const dbname='NodeAPI'; // ! DB name
    const collection='users'; // ! DB collection
    const db=client.db(dbname);
    


    // Login
    router.post('/login', async (req, res)=>{
        // Validate
        const schema=require('./model/user').login;
        const { error, value }=schema.validate({
            name: req.body.name,
            password: req.body.password
        });
        if(error) {return res.status(400).send(error.details[0].message);}
    
        // If exist
        const user=await db.collection(collection).findOne({name: value.name});
        if(!user) {return res.status(400).send('Name or password is wrong 1');}

        // Hash password
        const validPass=bcrypt.compareSync(req.body.password, user.password);
        if(!validPass) {return res.status(400).send('Name or password is wrong 2');}

        // Auth token
        const token=jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.status(200).header('auth-token', token).send(token);
    });

    // Register
    router.post('/register', async (req, res)=>{
        // Validate
        const schema=require('./model/user').register;
        const { error, value }=schema.validate({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        if(error) {return res.status(400).send(error.details[0].message);}
        // Is alrealy exists
        if(await db.collection(collection).findOne({email: value.email, name: value.name})) {
            res.status(400).send('User with this email or name already exist');
        }
        else {
            // Hash password
            const hashedpassword=bcrypt.hashSync(value.password, 16);
            value.password=hashedpassword;

            // Save to database
            await db.collection(collection).insertOne(value, (error)=>{
                if(error) {return res.status(400).send('Something is wrong while inserting date');}
            });
            res.send(value);
        }
    });
    
    // Select all
    router.get('/users', verify, async (req, res)=>{
        const users=await db.collection(collection).find({}).toArray();
        res.send(users);
    });

    // Select one
    router.get('/users/:email', verify, async (req, res)=>{
        const user=await db.collection(collection).findOne({name: req.params.email});
        res.send(user);
    });
});