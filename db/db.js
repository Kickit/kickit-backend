const User    = require('../models/user')
const Project = require('../models/project')
const Section = require('../models/section')
const Task    = require('../models/task')
const mongoose = require('mongoose')

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

const createProject = async (attrs) => {
    // Todo: validate you are an owner of the project
    const record = await saveRecord(Project, attrs)
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


module.exports =  { findRecord, findRecords, findAll, saveRecord, findRefs, updateRecord, createProject, createSection } 
