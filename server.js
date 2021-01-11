//jshint esversion:6
const express = require ("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("assets"))

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://admin-serene:dejavu@cluster0.38fij.mongodb.net/postDB2?retryWrites=true&w=majority", {useNewUrlParser: true});

//let posts = [];
const postSchema = {
    blogTitle: String, 
    blogContent: String,
    blogFile: String,
    publishedDate: Date
}
const Post = mongoose.model("Post", postSchema);

const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]




app.get("/", function(req, res) {
    Post.find( function(err, posts) {
        if (err) {
            console.log(err);
        } else {
            console.log(posts);
            res.render('index', {posts:posts, month: Months});
        }
    })
    // res.sendFile(__dirname + "/index.html");
})


app.get("/compose", function(req, res) {
    res.render('compose', {});
    // res.sendFile(__dirname + "/index.html");
})

app.post("/compose", function(req, res) {
    const post = new Post ({
        blogTitle: req.body.blogTitle, 
        blogContent: req.body.blogContent, 
        blogFile: req.body.blogFile,
        publishedDate: Date.now()
    });
    post.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Insertion successful");
        }
    })
    res.redirect("/");
})


// app.get("/posts/:postName", function(req, res) {
//     const requestedTitle = _.lowerCase(req.params.postName);
//     console.log("Requested: " + requestedTitle);
//     Post.find(function(err, posts) {
//         if (err) {
//             console.log(err);
//         } else {
//             posts.forEach(function(post) {
//                 const storedTitle = _.lowerCase(post.blogTitle);
//                 if (storedTitle === requestedTitle) {
//                     console.log("Yooo match here!");
//                     res.render("post", {
//                         blogTitle: post.blogTitle, 
//                         blogContent: post.blogContent
//                     });
//                 }
//             });
//         }
//     }); 
// })


app.get("/posts/:postName", function(req, res) {
    const requestedTitle = _.lowerCase(req.params.postName);
    console.log("Requested: " + requestedTitle);
    Post.find(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
            posts.forEach(function(post) {
                const storedTitle = _.lowerCase(post.blogTitle);
                if (storedTitle === requestedTitle) {
                    console.log("Yooo match here!");
                    var blogfilePath = "blogcontents/" + post.blogFile;
                    console.log(blogfilePath);
                    res.render(blogfilePath, {
                        blogTitle: post.blogTitle
                    });
                }
            });
        }
    }); 
})



app.get("/buffer", function(req,res) {
    res.render("blogcontents/buffer_multiline", {});
})


app.listen(3000, () => console.log("Node Server started on port 3000")) ;

