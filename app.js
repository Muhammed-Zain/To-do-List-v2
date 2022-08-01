const express = require("express");
const app = express();

let items = ["Buy Food", "Prepare for gym", "Solve Coding Questions"];
let workListItems = [];
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleString("en-US", options);
  res.render("list", { listTitle: day, newListItems: items });
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workListItems });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  if (item === "") 
    return;
  if(req.body.list === "Work") {
    workListItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
  
});



app.listen(3000, () => {
  console.log("This is running successfully on port 3000");
});
