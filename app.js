const express = require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://Muhammed-Zain:DishonoureD17@cluster0.yi3zo.mongodb.net/todoListDB",
  {
    useNewUrlParser: true,
  }
);

const itemsSchema = { name: String };

const listSchema = { name: String, items: [itemsSchema] };

const List = mongoose.model("list", listSchema);

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to this To Do List!",
});

const item2 = new Item({
  name: "Hit the + Button to add new items to this list.",
});

const item3 = new Item({
  name: "Hit the - Button to delete items from the list",
});

const defaultItems = [item1, item2, item3];

app.get("/", async (req, res) => {
  const data = await Item.find({});
  if (data) {
    if (data.length === 0) {
      Item.insertMany(defaultItems, (error, docs) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Successfully saved default items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: data });
    }
  }
});

app.get("/:customListName", async (req, res) => {
  const listName = _.capitalize(req.params.customListName);

  const data = await List.findOne({ name: listName });
  if (!data) {
    const list = new List({
      name: listName,
      items: defaultItems,
    });
    list.save();
    res.redirect("/" + listName);
  } else {
    res.render("list", {
      listTitle: data.name,
      newListItems: data.items,
    });
  }
});
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workListItems });
});

app.post("/", async (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  if (itemName === "") return;
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    const data = await List.findOne({ name: listName });
    if (data) {
      data.items.push(item);
      data.save();
      res.redirect("/" + listName);
    }
  }
});

app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    const data = await Item.findByIdAndRemove(checkedItemId);
    if (!data) console.log(data);
    else {
      console.log("Successfully deleted the item");
      res.redirect("/");
    }
  } else {
    const data = await List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    );
    if (data) {
      res.redirect("/" + listName);
    }
  }
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`This is running successfully on port ${port}`);
});
