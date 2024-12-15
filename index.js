const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("./middlewares/authmiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const momentjs = require("moment");
const verifyEnrollment = require("./verifymiddleware");
const verifyModuleAccess = require("./middlewares/verifymodulemiddleware");

const app = express();
const prisma = new PrismaClient();

app.use(express.json())


//users routes
app.get("/users", async (req, res) =>{
    const users = await prisma.user.findMany();
    res.json(users);
});

app.post("/users", async (req, res)=>{
    const { name, email, password, birthday, role } = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const birthdayDate = momentjs(birthday, "DD/MM/YYYY").toISOString()
       

        const newUser = await prisma.user.create({
            data: {name, email, password: hashedPassword, birthday: birthdayDate, role},

        })
        res.status(201).json({newUser, message: "Usuario registrado com sucesso"})

    }catch (err){
        res.status(400).json({ error: "Erro ao registrar o Usuário"})
    }
});

app.put("/users/", authenticateToken, async (req, res)=>{
    const { name, email, password, birthday, role} = req.body;
    const id = Number(req.user.id)
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const birthdayDate = momentjs(birthday, "DD/MM/YYYY").toISOString()

        const user = await prisma.user.update({
            where:{
                id:id
            },
            data: {
                name, email, password: hashedPassword, birthday: birthdayDate, role
            },

        })
        res.status(201).json({user, message: "Usuario atualizado com sucesso com sucesso"})

    }catch (err){
        res.status(400).json({ error: "Erro ao atualizar o Usuário"})
    }
});

//Login route

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await prisma.user.findUnique({ where: {email}});

        if (!user) return res.status (404).json({ error: "User didn't found"})
        
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) return res.status(401).json({ error: "Senha incorreta"})
            
            const token = jwt.sign(
                {id: user.id, name: user.name, email: user.email},
                process.env.JWT_SECRET,

            )
            res.json({ token, message :"Sucessful Login"})
    }catch(err){
        res.status(500).json({ error: "Server Error"})
    }
})

app.get("/profile", authenticateToken, async (req, res) =>{
    try {
        const user = await prisma.user.findUnique({ 
            include: {
                courses: true
            },
            where:{
            id: req.user.id
        }})
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: "Erro finding profile"})
    }
})


//Courses routes
app.get("/course", async(req, res) =>{
    try {
        const course = await prisma.course.findMany()
        res.json(course)
    } catch (error) {
        res.status(500).json({ error: "Erro ao carregar os cursos"})
    }
});

app.get("/courses/:courseId/modules", authenticateToken, verifyEnrollment, async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);
  
    try {
      // Busca os módulos do curso
      const modules = await prisma.module.findMany({
        where: { courseId },
      });
  
      res.json(modules);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar os módulos do curso." });
    }
  });


app.post("/course" , authenticateToken, async(req, res) => {
    const { title, description, category} = req.body;
    
    if (req.user.role !== "TEACHER" && req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Apenas professores ou administradores podem criar novos cursos"})
    }


    try {
        const newCourse = await prisma.course.create({
            data: {
                title, 
                description, 
                category,
                creatorId: req.user.id
            },

        })
        res.json(newCourse)
    } catch (error) {
        res.status(500).json({error: "Error creating a new course" })
    }
})

app.delete("/course/:id", async(req,res) =>{
    const id = Number(req.params.id)
    console.log(req.params.id)
    try {
        const courseDelete = await prisma.course.delete({
            where:{
            id:id
            }
        })
        res.json(courseDelete)
    } catch (error) {
        
    }
})

app.put("/course/:id" , async(req, res) => {
    const id = Number(req.params.id)
    
    const { title, description, category, creatorId} = req.body;
    
    try {
        const updateCourse = await prisma.course.update({
            where:{
                id:id
            },
            data: {title, description, category, creatorId}

        })
        res.json(updateCourse)
    } catch (error) {
        res.status(500).json({error: "Error updating a new course" })
    }
})

//modules routes

app.post("/module", async(req, res)=>{
    const {title, content, courseId} = req.body

    try {
        const newModule = await prisma.module.create({
           data:
           { title : title,
            courseId :courseId,
            content : content
           }

        })
        
        res.json(newModule)

    } catch (error) {
        res.status(404).json({err: "Can't create a new module"})
    }
})

app.get("/module", async(req, res)=>{
    const modules = await prisma.module.findMany()
    try {
        res.json(modules)
    } catch (error) {
        
    }
})

app.get("/module/:id" ,authenticateToken, verifyModuleAccess, async(req,res) =>{
    const moduleId = parseInt(req.params.id, 10);

    try {
        
        const moduleFind = await prisma.module.findUnique({
            where :{
            id : moduleId
            
        }})    
        res.json(moduleFind)
    } catch (error) {
        res.status(404).json( {error : "Erro ao encontrar o modulo"})
        
    }
})

app.delete("/module/:id", async(req,res) =>{
    const id = Number(req.params.id)
    console.log(req.params.id)
    try {
        const moduleDelete = await prisma.module.delete({
            where:{
            id:id
            }
        })
        res.json(moduleDelete)
    } catch (error) {
        
    }
})

// enroll course

app.post("/course/:courseId/enroll" ,authenticateToken, async(req, res) => {

    const courseId = parseInt(req.params.courseId, 10);
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    })
    console.log(user.role)

    if (user.role !== "USER") {
    return res.status(403).json({error: "Only students can subscribe"});
    }

    try {
        const course = await prisma.course.findUnique({where: {id: courseId} })
        if(!course){
            return res.status(404).json({error: "Error finding the course"})
        }
    

    const enrollment = await prisma.enrolledCourse.create({
        data:{
            userId: req.user.id,
            courseId,
        }
    });

    res.status(200).json({message: "Sucess!!", enrollment})
    }catch (err){
        res.status(500).json({error: "Can't make the enrollment"})
    }
})

// find enrolled courses
app.get("/mycourses", authenticateToken, async (req, res) => {

    const user = await prisma.user.findUnique({
        where:{
            id: req.user.id
            }
        
    })

    if (user.role !== "USER") {
      return res.status(403).json({ error: "Somente alunos podem acessar seus cursos." });
    }
  
    try {
      const enrolledCourses = await prisma.enrolledCourse.findMany({
        where: { userId: req.user.id },
        include: { course: true }, // Inclui os detalhes do curso
      });
  
      res.json(enrolledCourses.map((enrollment) => enrollment.course));
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar cursos." });
    }
  });



app.listen(3000, () => console.log ("Server is Running on port 3000"))