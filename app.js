const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const app=express();
const port=process.env.PORT || 3000;
app.set('view engine','hbs');
app.use('/public', express.static('public'));
app.use(express.json());

// Host
app.listen(port, (err)=>{
    if(err) {
        return console.error('\x1b[31m','Can not start the host:','\x1b[0m',err);
    }
    else {
        return console.log('\x1b[32m','Host listening','\x1b[0m',`(on port ${port})...`,'\x1b[0m');
    }
});

// Middleware
app.use(express.json());

// Import API
const api=require('./api/api');
app.use('/api', api);