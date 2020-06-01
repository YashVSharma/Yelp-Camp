var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");




//INDEX- all Camopground routes
router.get("/campgrounds",function(req,res){
    Campground.find({},function(error,allCamps){
        if(error){
            console.log("Error Occoured in database find");
        }
        else{
           
            
        }
        res.render("campgrounds/index.ejs",{sites:allCamps});
        
    });
   
    
});
//CREATE Route
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    var namee=req.body.name;
    var imagee=req.body.image;
    var descr=req.body.desc;
    var authorr={
        id:req.user._id,
        username:req.user.username
    };
    var newCampground={name:namee,img:imagee,desc:descr,author:authorr};
    Campground.create(newCampground,function(error,campground){
        if(error){
            console.log("Error Occoured");
        }
        else{
            req.flash("success","Campground Added Successfully");
            
        }
    });
    res.redirect("/campgrounds");

});
//New Route
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/newCampground.ejs");
});
//Show
router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,IdCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show.ejs",{IdCampground:IdCampground});
        }
    });
    
    
});
//Edit route

router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwner,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/edit.ejs",{foundCampground:foundCampground});
        }
    });
    
});
//Update Route
router.put("/campgrounds/:id",middleware.checkCampgroundOwner,function(req,res){
    
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
            req.flash("success","Campground Updated Successfully");
        }
    }
    );
});

// Delete route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwner,function(req,res){
    Campground.findByIdAndDelete(req.params.id,function(err){
        if(err){console.log(err);
        res.redirect("/campgrounds")}
        req.flash("success","Campground Deleted Successfully");
        res.redirect("/campgrounds");
    });
});


 

module.exports = router;