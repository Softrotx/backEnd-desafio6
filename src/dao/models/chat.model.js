const { mongoose } = require("mongoose");



const chatSchema = mongoose.Schema({
    fecha: {
        type: Date,
        default: () => {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            return date;
        }
    },
    Messages: [ {
        clientId: {type:String, require:true},
        message: {type:String, require:true},
        date: {type:Date, default: Date.now}

    }]
});

module.exports= mongoose.model('messages', chatSchema);
