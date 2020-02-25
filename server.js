//CONFIGURANDO SERVIDOR
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//configurar a conexão com bancos de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '010318',
    host: 'localhost',
    port: 5432,
    database:'doe'
})

//habilidar body do formulário
server.use(express.urlencoded({ extended: true}))

//configurando o template da engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express:server,
    noCache: true,
})
 
//LISTA DE DOADORES: VETOR OU ARRAY



//CONFIGURAR APRESENTAÇÃO DA PÁGINA
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html",{ donors })
    })
    
})

server.post("/", function(req,res){
    //PEGAR DADOS DO FORMULÁRIO 
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == ""|| email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios!")
    }

    //colocar valores dentro do banco de dados  
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`  


    const values = [name, email, blood]
    db.query(query, values, function(err){
        
        //fluxo de erro
        if(err) return res.send("erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })

   
})

//LIGAR SERVIDOR E PERMITIR ACESSO A PORTA 3000
server.listen(3000, function(){
    console.log("iniciei o servidor")
})