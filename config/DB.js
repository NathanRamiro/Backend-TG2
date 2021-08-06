const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI

const InicializaMongoServer = async() => {
    try{
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        console.log("Conectado ao MongoDB")
    } catch (e){
        console.error(e)
        throw e 
    }
}

module.exports = InicializaMongoServer