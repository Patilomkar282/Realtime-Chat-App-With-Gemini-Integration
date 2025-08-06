import Project from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({
    name,
    userId
}) => {
    if(!name){
        throw new Error("Project name is required");
    }
    if(!userId){
        throw new Error("User ID is required");
    }

    const project= await Project.create({
        name,
        users: [userId]
    });
    return project;
}

export const getAllProjectByUserId = async (userId) => {
    if(!userId){
        throw new Error("User ID is required");
    }

    const alluserProjects = await Project.find({ users: userId });
    return alluserProjects;
}




export const addUsersToProjets = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("Project Id is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project Id");
  }
  if (!users || !Array.isArray(users) || users.some(id => !mongoose.Types.ObjectId.isValid(id))) {
    throw new Error("Invalid users array");
  }
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User Id");
  }

  // ✅ Use Project instead of undefined `project`
  const project = await Project.findOne({
    _id: projectId,
    users: userId // Ensures the requester is part of the project
  });
  console.log("Project found:", project);

  if (!project) {
    throw new Error("Project not found or you are not authorized to add users");
  }

  const updatedProject = await Project.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } }, // Avoid duplicates
    { new: true }
  ).populate('users');

  return updatedProject;
};

export const getProjectById = async ({projectId}) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  const project = await Project.findById(projectId).populate('users');
  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}
