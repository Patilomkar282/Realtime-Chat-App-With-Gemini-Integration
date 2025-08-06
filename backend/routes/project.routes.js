import {Router } from 'express';
import { body } from 'express-validator';
import { createProjectController,getAllProjects,addUSerToProject,getProjectusingId } from '../controllers/project.controller.js';
import { authUser } from '../middleware/auth.middleware.js';
const router = Router();

router.post('/create',authUser,
  body('name').isString().notEmpty().withMessage('Project name is required'),

  createProjectController
);

router.get('/all',authUser, getAllProjects);

router.put(
  '/add-user',
  authUser,
  body('projectId')
    .isString()
    .withMessage('projectId is required'),

  body('users')
    .isArray({ min: 1 })
    .withMessage('Users must be a non-empty array of strings')
    .bail()
    .custom((users) => users.every(user => typeof user === 'string'))
    .withMessage('Each user must be a string'),

  addUSerToProject
);

router.get('/get-project/:projectId', authUser, getProjectusingId);

export default router;