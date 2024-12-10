const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("./middlewares/authmiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const prisma = new PrismaClient();

app.use(express.json())

app.get("/users", async (req, res) =>{
    const users = await prisma.user.findMany();
    res.json(users);
});

app.post("/register", async (req, res)=>{
    const { name, email, password} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(1)

        const newUser = await prisma.user.create({
            data: {name, email, password: hashedPassword},

        })
        res.status(201).json({newUser, message: "Usuario registrado com sucesso"})

    }catch (err){
        res.status(400).json({ error: "Erro ao registrar o Usuário"})
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

// Rota protegida

app.get("/profile", authenticateToken, async (req, res) =>{
    try {
        const user = await prisma.user.findUnique({where: {id: req.user.id}});
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Erro ao carregar pagina"})
    }
})

//Rotas criaçao de novos cursos
app.post("/course" , async(req, res) => {
    const { title, description, category, creatorId} = req.body;
    
    try {
        const newCourse = await prisma.course.create({
            data: {title, description, category, creatorId},

        })
        res.json(newCourse)
    } catch (error) {
        res.status(500).json({error: "Error creating a new course" })
    }
})

app.listen(3000, () => console.log ("Server is Running on port 3000"))