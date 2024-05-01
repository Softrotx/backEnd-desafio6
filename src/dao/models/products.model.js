const { mongoose } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const productsSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: Number, min:10000000},
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: Array }


});

productsSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Products', productsSchema,'products');
