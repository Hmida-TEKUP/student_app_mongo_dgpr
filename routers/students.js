const router = require('express').Router();
const _ = require('lodash');
const { Student, student_validation, student_validation_update , id_validation } = require('../models/student');


router.get('/welcome', (req,res)=>{
    res.send('Welcome to Student API');
});

router.get('/', async (req,res)=>{

    const students = await Student.find().sort('name');
    if(students.length === 0)
        return res.status(204).send();
    res.send(students)
    
})

router.get('/id/:id', async (req,res)=>{
    const validation = id_validation(req.params);
    if(validation)
        return res.status(400).send(validation.details[0].message)
    const student = await Student.findById(req.params.id);
    if(!student)
        return res.status(404).send(`Student not found`);
    res.send(student)
    
})

router.post('/', async (req,res)=>{

    const validation_error = student_validation(req.body);
    if(validation_error)
        return res.status(400).send(validation_error.details[0].message);

    const student = new Student({
        name : req.body.name,
        email : req.body.email,
        class : {name : req.body.class.name},
    });

    try{
        const savedStudent = await student.save();
        return res.status(201).send(savedStudent);
    }catch(err){
        res.status(400).send('Something wrong in saving to DB. Data already exists');
    }
    
})

router.delete('/id/:id', async (req,res)=>{
    const validation = id_validation(req.params);
    if(validation)
        return res.status(400).send(validation.details[0].message)
    const student = await Student.findByIdAndRemove(req.params.id);
    if(!student)
        return res.status(404).send(`Student not found`);
    res.send(student)
    
})

router.put('/id/:id', async (req,res)=>{
    const validation = id_validation(req.params);
    if(validation)
        return res.status(400).send(validation.details[0].message)
    let student = await Student.findById(req.params.id);
    if(!student)
        return res.status(404).send(`Student not found`);

    const validation_error = student_validation_update(req.body);
    if(validation_error)
        return res.status(400).send(validation_error.details[0].message);
    student = _.merge(student,req.body);
    student = await student.save()
    
    res.send(student)
    
})



module.exports = router;