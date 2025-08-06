import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true, // ⚠️ This might be the reason for your 500 error
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // ⚠️ Check your model name (case-sensitive)
        }
    ]
});


const Project = mongoose.model('project', projectSchema);

export default Project;