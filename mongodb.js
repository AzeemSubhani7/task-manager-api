// CRUD 

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager'

MongoClient.connect(connectionURL,  {useUnifiedTopology: true }, (error, client) =>{
    if(error){
        return console.log("Unable to connect!");
    }
    console.log("Connected To Database");
    // it gives you back database refence
    const db = client.db(databaseName);
    
    db.collection('user').deleteMany({
        name: "Shasha",
        age: 19
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    })
})

// Lecture Ends