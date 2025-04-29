const express = require("express");
const path = require("path");
const fs = require("fs");
const { title } = require("process");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      console.error("Error loading directory:", err);
      return;
    }
    res.render("index",{files: files});
  });
});

app.post("/create", (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.description, (err) => {
        if (err) {
            console.error("Error creating file:", err);
            return res.status(500).send("Error creating file");
        }
        res.redirect("/");
    });
});

app.get("/file/:file", (req, res) => {
    fs.readFile(`./files/${req.params.file}`,'utf-8',(err,data)=>{
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }
        res.render('file',{title: req.params.file, content: data});
    })
});

app.get("/edit/:file", (req, res) => {
    res.render('edit',{title: req.params.file.split('.')[0]});
});

app.post("/edit", (req, res) => {
    fs.rename(`./files/${req.body.previous}.txt`, `./files/${req.body.new.split(' ').join('')}.txt`, (err) => {
      if(err){
        console.error("Error renaming file:", err);
        return res.status(500).send("Error renaming file");
      }
      res.redirect("/");
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
