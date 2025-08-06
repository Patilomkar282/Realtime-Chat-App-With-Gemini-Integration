import Project from "../models/project.model.js";
import { createProject, addUsersToProjets,getProjectById } from "../services/project.service.js";
import { validationResult } from "express-validator";
import User from "../models/user.models.js";
import {authUser} from "../middleware/auth.middleware.js";

export const createProjectController = async (req, res) => {
    console.log("Incoming body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;

        // ✅ Get user from req.user (assuming you use auth middleware)
        const loggedInUser = await User.findOne({ email: req.user.email });

        if (!loggedInUser) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = loggedInUser._id;

        const newProject = await createProject({ name, userId });

        return res.status(201).json({
            message: "Project created successfully",
            project: newProject
        });
    } catch (error) {
        console.error("Error in createProjectController:", error);
        return res.status(500).json({ error: error.message });
    }
};


export const getAllProjects = async (req, res) => {
    try {
        const loggedInUser = await User.findOne({ email: req.user.email });

        console.log("All fkklsj projects:");
        console.log(loggedInUser._id)
        // const allUserProjects =await getAllProjectByUserId({
        //     userId: loggedInUser._id

        // })

const allUserProjects = await Project.find({ users: loggedInUser._id }).populate('users');

        return res.status(200).json({
            message: "Projects fetched successfully",
            projects: allUserProjects
        })

    } catch (error) {
        console.error("Error in getAllProjects:", error);
        return res.status(500).json({ error: error.message });
    }
}

export const addUSerToProject = async (req,res)=>{
       const errors = validationResult(req);
       if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
       }
       try{
        const {projectId,users}=req.body
        const loggedInUser = await User.findOne({ email: req.user.email });
        const project = await addUsersToProjets({
            projectId,
            users,
            userId: loggedInUser._id
        })
        console.log("Project after adding users:", project);

        return res.status(200).json({
            message: "Users added to project successfully",
            project
        })
       }catch(error){
        console.log(error);
        return res.status(400).json({error:error.message})

       }
}

export const getProjectusingId=async (req,res)=>{
    const { projectId } = req.params;

   

    try {
        const project = await getProjectById({projectId});

        return res.status(200).json({
            message: "Project fetched successfully",
            project
        });
    } catch (error) {
        console.error("Error in getProjectById:", error);
        return res.status(500).json({ error: error.message });
    }
}





