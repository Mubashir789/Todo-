import express, { text } from 'express'
import cors from 'cors'
import mongoose from 'mongoose';


let todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    Id: String,
    createOn: { type: Date, default: Date.now },
});

const todoModel = mongoose.model('todos', todoSchema);



const app = express()
const port = process.env.PORT || 3000


app.use(express.json());
app.use(cors());


app.post('/todo', (req, res) => {
    todoModel.create({ text: req.body.text }, (err, saved) => {
        if (!err) {

            console.log(saved)

            res.send({
                message: "Your Todo Is Saved",
                data: text
            })
        } else {
            res.status(500).send({

                message: "Server Error!"

            })
        }
    })


})

app.get('/todos', (req, res) => {
    todoModel.find({}, (err, data) => {
        if (!err) {
            res.send({

                message: "Here is your todo list",
                data: data

            })

        } else {
            res.status(500), send({

                message: "Server Error!"

            })

        }


    });


})

app.put('/todo/:id', async (req, res) => {

    try {
        let data = await todoModel
            .findByIdAndUpdate(req.params.id, { text: req.body.text } , {new : true})
            .exec()

        res.send({

            message: "Your Todo Is Update",
            data: data

        })

    } catch (error) {
        res.status(500), send({

            message: "Server Error!"

        })
    }
})


app.delete('/delete', (req, res) => {
    todoModel.deleteMany({}, (err, data) => {
        if (!err) {
            res.send({
                message: "All Todo Is Deleted Successfully!!",
            })
        } else {
            res.status(500), send({
                message: "Server Error!"
            })
        }


    });


})


app.delete('/del/:id', (req, res) => {
    todoModel.deleteOne({ _id: req.params.id }, (err, data) => {
        if (!err) {
            res.send({
                message: "Your Todo Is Deleted Successfully!!",
            })
        } else {
            res.status(500), send({
                message: "Server Error!"
            })
        }


    });


})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})





/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://username:username@cluster0.640ylgv.mongodb.net/First-Database?retryWrites=true&w=majority';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});