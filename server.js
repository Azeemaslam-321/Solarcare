const express = require("express");
const app = express();
const sqlite = require("sqlite3").verbose();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// DB
const db = new sqlite.Database("bookings.db");
db.run("CREATE TABLE IF NOT EXISTS bookings(id INTEGER PRIMARY KEY, name TEXT, phone TEXT, service TEXT, date TEXT, address TEXT)");

app.post("/book", (req,res)=>{
  const {name,phone,service,date,address} = req.body;
  db.run("INSERT INTO bookings(name,phone,service,date,address) VALUES(?,?,?,?,?)",
  [name,phone,service,date,address]);

  res.send("Booking Submitted Successfully!");
});

app.listen(5000, ()=> console.log("Server running on port 5000"));
