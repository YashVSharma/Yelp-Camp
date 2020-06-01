var Campground=require("../models/campground");
var Comment=require("../models/comment");

var middlewareObj={}

middlewareObj.checkCommentOwner=function (req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.c_id,function(err,foundId){
            if(err){
                console.log(err);
                res.redirect("back");
            }
            else{
                console.log(foundId.author.id);
                console.log(req.user._id);

                if(foundId.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","Permission Denied!!");
                    res.redirect("back");
                }
        }
    
        });
    }
    else{
        res.redirect("back");
    }
    }

    middlewareObj.checkCampgroundOwner=function(req,res,next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id,function(err,foundId){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }
                else{
                    console.log(foundId.author.id);
                    console.log(req.user._id);
    
                    if(foundId.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error","Permission Denied!");
                        res.redirect("back");
                    }
            }
        
            });
        }
        else{
            res.redirect("back");
        }
        }

    middlewareObj.isLoggedIn=function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        else{
            req.flash("error","Please Log In to your account!");
            res.redirect("/login");
        }
    }    

    module.exports= middlewareObj;