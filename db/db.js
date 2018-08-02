const User    = require('../models/user')
const Project = require('../models/project')
const Task    = require('../models/task')
const mongoose = require('mongoose')

/* 
    This utility contains 2 pieces:
        1. Core Utils
        2. Model Utils
    
    - Core utils are generic db functions like save, delete, update, ect. 
    - Model utils are anything which implements a core util but still isnt generic enough to be a resolver,
      generally these are used to provide validation but should be used sparingly. May be removed.
*/

// Core DB Utils ------------------------------------------------------------------------------
const findRecord = async (model, id) => {
    return await model.findById(id)
}

const findRecords = async (model, ids) => {
    return await model.find(
        {
           _id: { $in: ids }
        }
     )
}

const findRefs = async (model, attr, id) => {
    return await model.where(attr).equals(id)
}

const findAll = async(model, attr) => {

}

const saveRecord = async (model, attrs) => {
    const record = new model(attrs);
    return await record.save()
}

const updateRecord = async (model, attrs) => {
    let record = await findRecord(model, attrs.id)
    record.set(attrs)
    return await record.save()
}

const deleteRecord = async (model, attrs) => {
    let record = await findRecord(model, attrs.id)
    record.set(attrs)
    return await record.remove()
}

// Model DB Utils ------------------------------------------------------------------------------

// TODO: See if there is a better way to do this. ie, make find refs accept an array of key/values
const findParentTasks = async (id) => {
    return await Task.where('project').equals(id).where('section').equals(null)
}

const createProject = async (attrs) => {
    // Todo: validate you are an owner of the project
    const record = await saveRecord(Project, attrs)

    // TODO: Create core util for this
    await User.update(
        { _id: { $in: record.owners } },
        { $push: { projects: mongoose.Types.ObjectId(record._id) } }
      )
    
      return record
}

const createTask = async (attrs) => {
    attrs.created = Math.floor(new Date() / 1000)
    return await saveRecord(Task, attrs)
}

const deleteProject = async (attrs, userId) => {
    const project = await findRecord(Project, attrs.id)
    if (project.owners.indexOf(userId) > -1) {
        await deleteRecord(Project, attrs)
        return project
    }

    throw Error(`Unauthorized action: Provided User doesn't have write permissions for project.`)
}

const deleteTask = async (attrs, userId) => {
    const task = await findRecord(Task, attrs.id)
    if (userOwnsTask(task.project, userId)) {
        await deleteRecord(Task, attrs)
        return task
    }

    throw Error(`Unauthorized action: Provided User doesn't have write permissions for task.`)
}

// userOwnsTask: checks user permissions to verify if theyre owner of that section
const userOwnsTask = async (parentId, userId) => {
    let project = await findRecord(Project, parentId)
    // check if userId is in project's owners array
    if (project.owners.indexOf(userId) > -1) {
        return true
    }
    else return false
}

// TODO: Might not be necessary going forward
const projectFor = async (task) => {
    while(!task.project) {
        task = await findRecord(Task, task.section)
    }
    return await task.project
    
}


module.exports =  { findRecord, findRecords, findAll, projectFor, saveRecord, findRefs, findParentTasks, updateRecord, deleteProject, deleteTask, createProject, createTask, userOwnsTask } 
