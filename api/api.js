const mongodb=require('mongodb').MongoClient;
const router=require('express').Router();
const bcrypt=require('bcrypt');
module.exports=router;

// Connect to DB
const url='mongodb://127.0.0.1:27017';
mongodb.connect(url, {}, (err, client)=>{
    if(err) {
        return console.error('\x1b[31m','Database error:','\x1b[0m',err);
    }
    else {
        console.log('\x1b[32m','Server connected','\x1b[0m',`(on url ${url})...`);
    }
    const dbname='NodeAPI';
    const collection='users';
    const db=client.db(dbname);
    


    // Auth
    router.post('/login', async (req, res)=>{
        // Validate
        const schema=require('./model/user').login;
        const { error, value }=schema.validate({
            name: req.body.name,
            password: req.body.password
        });
        if(error) {return res.status(400).send(error.details[0].message);}
    
        // Is exist
        /* code */
    });

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
            const salt=await bcrypt.genSalt(16);
            const hashedpassword=await bcrypt.hash(value.password,salt);
            value.password=hashedpassword;

            // Save to database
            db.collection(collection).insertOne(value, (error)=>{
                if(error) {return res.status(400).send('Something is wrong while inserting date');}
            });
            res.send(value);
        }
    });
    

    
    // APIs
    router.get('/users', (req, res)=>{
        res.send('there will be users');
    });
});