const express = require("express");
const conectarDB = require("./rest/config/db.js");
const cors = require("cors");
const dotenv = require('dotenv');
const app = express();
const session = require('express-session')

// var corsOptions = {
//   origin: "http://localhost:4200"
// };
dotenv.config()
app.use(cors());
conectarDB();
console.log(process.env.DB_MONGO)

const port = process.env.PORT || 3000;
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
//cargar models
require('./');
require('./rest/models/product.model');
require('./rest/models/category.model');
require('./rest/models/User.model');
require('./rest/models/comment.model');
require('./rest/config/passport')

app.use(express.json());
// app.use(cors());
app.use(require("./rest/routes"));

app.get('/', function(req, res) {
  res.send("{Message: THE APPLICATION IS RUNNING}");
})

//  app.use(function (req, res, next) {
//      var err = new Error("Not Found");
//      err.status = 404;
//      next(err);
//    });
    
app.listen(port, "0.0.0.0", () => {
console.log(`El servidor está corriendo perfectamente en el puerto ${port}`);
});