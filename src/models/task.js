var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
   description:{
       type: String,
       required: true,
       trim: true
   },
   completed: {
       type: Boolean,
       default: false
   },
   owner: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'User'
   }
}, {
    timestamps: true
});
// await task.populate('owner').execPopulate()
const Task = mongoose.model('task', taskSchema); 
module.exports = Task; 
