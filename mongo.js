const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// Conexion con mongodb
mongoose.connect(connectionString)
    .then(() => console.log('DB connection succed'))
    .catch(err => console.log(err));