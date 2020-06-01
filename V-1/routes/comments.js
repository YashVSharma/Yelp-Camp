var express=require("express");
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");
var router=express.Router();

//=====================================
//Comment Routes
//=====================================

// New
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(error,foundId){
        
        if(error){
            console.log(error);
        }
        else{
            res.render("comments/new.ejs",{foundId:foundId,currentUser:req.user});
        }
    });
    
});

//Comments
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
    var authorr=req.body.author;
    var textt=req.body.text;
    var newComment={"text":textt,"author":authorr}
    console.log(newComment);
    Comment.create(newComment,function(error,coment){
        if(error){
            console.log(error);
        }
        else{
            Campground.findById(req.params.id,function(err,foundId){
                if(err){
                    console.log(err);
                }
                else{
                    coment.author.id=req.user._id;
                    coment.author.username=req.user.username;
                    coment.save();
                    foundId.comments.push(coment);
                    foundId.save();
                    req.flash("success","Comment Added Successfully");
                    console.log("comment added");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
   
});
//Comment Edit
router.get("/campgrounds/:id/comments/:c_id/edit",middleware.checkCommentOwner,function(req,res){
    Comment.findById(req.params.c_id,function(err,foundComment){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/edit.ejs",{comment:foundComment,foundId:req.params.id});
        }
   
   
    });
});
//Comment Update

router.put("/campgrounds/:id/comments/:c_id",middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.c_id,req.body.comment,function(err,updated){
        if(err){
            console.log(err);
        }
        else{req.flash("success","Comment Updated Successfully");
            res.redirect("/campgrounds/"+req.params.id);
            
        }
    }
    );
});
//Comment delete

router.delete("/campgrounds/:id/comments/:c_id",middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndDelete(req.params.c_id,function(err){
        if(err){
            
        res.redirect("/campgrounds/"+req.params.id)}
        req.flash("success","Comment Deleted Successfully");
        res.redirect("/campgrounds/"+req.params.id);
    });
});


module.exports = router;