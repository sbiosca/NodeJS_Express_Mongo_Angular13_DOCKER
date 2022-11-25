const mongoose = require('mongoose');
//require('dotenv').config({path: 'config.env'});

const conectarDB = async () => {
    try {
        await mongoose.connect("mongodb://bioskin:12345@mongodb:27017/bd_projects?authMechanism=DEFAULT", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('BD conectada con éxito');
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = conectarDB;