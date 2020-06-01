var express=require("express");
var app=express();
var request=require("request");
var passport=require("passport");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var seedDB=require("./seeds");
var commentRoutes=require("./routes/comments");
var indexRoutes=require("./routes/index");
var campgroundsRoutes=require("./routes/campgrounds");
var methodOverride=require("method-override");
var flash=require("connect-flash");


mongoose.connect('mongodb://localhost:27017/Yelp_Campv8', { useNewUrlParser: true , useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport Config

app.use(require("express-session")({
    secret:"Chandler Bing",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(campgroundsRoutes);
app.use(commentRoutes);

//seedDB();

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});