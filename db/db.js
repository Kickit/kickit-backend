const User    = require('../models/user')
const Project = require('../models/project')
const Section = require('../models/section')
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

const createSection = async (attrs) => {
    // Todo: validate you are an owner of the project
    const projectRef = findRecord(Project, attrs.project)
    if (projectRef) {
        return await saveRecord(Section, attrs)
    }
    throw Error(`Section is referencing Project ${attrs.project} which doesn't exist.`)
}

const createTask = async (attrs) => {
    // Todo: validate you are an owner of the project
    attrs.created = Math.floor(new Date() / 1000)
    
    const sectionRef = findRecord(Section, attrs.section)
    if (sectionRef) {
        return await saveRecord(Task, attrs)
    }
    throw Error(`Task is referencing Section ${attrs.section} which doesn't exist.`)
}

const deleteProject = async (attrs, userId) => {
    const project = await findRecord(Project, attrs.id)
    if (project.owners.indexOf(userId) > -1) {
        await deleteRecord(Project, attrs)
        return project
    }

    throw Error(`Unauthorized action: Provided User doesnt have write permissions for project.`)
}

// userOwnsTask: checks user permissions to verify if theyre owner of that section
const userOwnsSection = async (sectionId, userId) => {
    const section = await findRecord(Section, sectionId)
    const project = await findRecord(Project, section.project)

    // check if userId is in project's owners array
    if (project.owners.indexOf(userId) > -1) {
        return true
    }
    else return false
}


module.exports =  { findRecord, findRecords, findAll, saveRecord, findRefs, updateRecord, deleteProject, createProject, createSection, createTask, userOwnsSection } 
