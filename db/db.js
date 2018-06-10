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
    const key = `${key}.$id`
    return await model.find({key: id})
}

const findAll = async(model, attr) => {

}

const saveRecord = async (model, attrs) => {
    const record = new model(attrs);
    return await record.save()
}

const updateRecord = (model, attrs) => {

}

const createProject = async (attrs) => {
    const record = await saveRecord(Project, attrs)
    await User.update(
        { _id: { $in: record.owners } },
        { $push: { projects: mongoose.Types.ObjectId(record._id) } }
      )
    
      return record
}


module.exports =  { findRecord, findAll, saveRecord, updateRecord, createProject, findRecords, findRefs}
