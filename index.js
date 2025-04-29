const express = require("express");
const path = require("path");
const fs = require("fs");
const { title } = require("process");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
