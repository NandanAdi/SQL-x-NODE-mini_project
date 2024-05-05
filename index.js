const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express= require('express');
const app = express();
const path= require("path")
const methodOverride= require("method-override")
const { v4: uuidv4 } = require("uuid");


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"))
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true})); // for data parsing


const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  database:'delta_app',
  password:'1793'
});

let getRandomUser =()=>  {
    return [
       faker.datatype.uuid(),
       faker.internet.userName(),
       faker.internet.email(),
       faker.internet.password(),
    ];
  }

// HOME ROUTE
app.get("/",(req,res)=>{
  let q= "select count(*) from user";
    try{
    connection.query(q, (err,result)=>{
      if (err) throw err;
      let count = (result[0]["count(*)"]);
      res.render("home",{count})
    });
      }
  catch (err)
      {
      console.log(err)
      res.send("some error is db")
      }
      
})

// USER ROUTE

app.get("/user",(req,res)=>{
  let q = "select * from user";

  try{
    connection.query(q, (err,users)=>{
      if (err) throw err;
      res.render("showUsers",{users})
    });
      }
  catch (err)
      {
      console.log(err)
      res.send("some error is db")
      }})

// EDIT ROUTE

app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id ='${id}'`;

  try{
    connection.query(q, (err,result)=>{
      if (err) throw err;
      let user=(result[0])
      res.render("edit.ejs",{user});
    });
      } catch (err){
      console.log(err)
      res.send("some error is db")
      }
    
})

// UPDATE ROUTE 

app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let { password: formPass,username:newUsername}=req.body;
  let q = `SELECT * FROM user WHERE id ='${id}'`;

  try{
    connection.query(q, (err,result)=>{
      if (err) throw err;
      let user=(result[0])

      if(formPass!=user.password){
        res.send("wrong password")
      }else{
        let q2=`UPDATE user SET username='${newUsername}' Where id='${id}'`
        connection.query(q2,(err,result)=>{
          if(err)throw err;
          res.redirect("/user")
        })
      }
      
    });
      } catch (err){
      console.log(err)
      res.send("some error is db")
      }

})


// DELETE USER 

app.get("/user/:id/delete",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id ='${id}'`;
  try{
    connection.query(q, (err,result)=>{
      if (err) throw err;
      let user=(result[0])

      res.render("delete",{user});
    });
      } catch (err){
      console.log(err)
      res.send("some error is db")
      }
 
})


// DELETE UPDATED ROUTE 

app.delete("/user/:id",(req,res)=>{
  let {id} = req.params;
  let { password: formPass,username:newUsername}=req.body;
  let q = `SELECT * FROM user WHERE id ='${id}'`;

  try{
    connection.query(q, (err,result)=>{
      if (err) throw err;
      let user=(result[0])

      if(formPass!=user.password){
        res.send("wrong password")
      }else{
        let q2=`DELETE FROM user Where id='${id}'`
        connection.query(q2,(err,result)=>{
          if(err)throw err;
          res.redirect("/user")
        })
      }
      
    });
      } catch (err){
      console.log(err)
      res.send("some error is db")
      }

})


// ADD USER

app.get("/user/add",(req,res)=>{
  res.render("add")
})


app.post("/user/add", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();

  //Query to Insert New User
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});


app.listen("8080",()=>{
  console.log('listening to port 8080')
})
























  // let q ="INSERT INTO user (id,username,email,password) VALUES ?";
  // let data = [];
  // for (i=1;i<=100;i++){
  //   data.push(getRandomUser())
  // };


  // try{
  //   connection.query(q,[data], (err,result)=>{
  //     if (err) throw err;
  //     console.log(result);
  //   });
  //     }
  // catch (err)
  //     {
  //     console.log(err)
  //     }
  //     connection.end();