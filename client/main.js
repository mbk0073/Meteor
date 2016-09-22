import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

//routing
Router.route('/', function (){
  this.render('welcome',{
    to:"main"
  });
});

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});



Router.route('/images', function () {
  this.render('navbar',{
    to:"navbar"
      }
  );
  this.render('images',{
    to:"main"
  });
});

Router.route('/image/:_id',function(){
  this.render('navbar',{
    to:'navbar'
  });
  this.render('image',{
    to:"main",
    data:function(){
      return Images.findOne({_id:this.params._id})
    }
  });
});






//infiniscroll
if(Meteor.isClient){
  Session.set("imageLimit", 8);
  lastScrollTop=0;

  $(window).scroll(function(event){


    if($(window).scrollTop()+$(window).height()> $(document).height()-100){
      var scrollTop=$(this).scrollTop();
      console.log(new Date());
    }
    if(scrollTop>lastScrollTop){
      console.log("going down");
      Session.set("imageLimit", Session.get("imageLimit")+4);
    }
    lastScrollTop=scrollTop;
   // console.log(new Date());
  });



  //accounts management
  Accounts.ui.config({
    passwordSignupFields:"USERNAME_AND_EMAIL"
  });

  //Template.images.helpers({images:img_data});
  Template.images.helpers({images:
      function() {
        if(Session.get("userFilter")){
          return Images.find({createdBy:Session.get("userFilter")},{sort:{createdOn:-1, rating: -1}});
        }
        else return Images.find({}, {sort: {createdOn:-1, rating: -1}, limit:Session.get("imageLimit")});
      },
    filtering_images:function(){
        if(Session.get("userFilter"))return true;
        else return false;
    },
    getFilterUser:function(){
      if(Session.get("userFilter")){

        var user=Meteor.users.findOne({_id:Session.get("userFilter")});
        return user.username;
      }
      else return "Anonymous";
    },
    getUser:function(user_id){
    var user=Meteor.users.findOne({_id:user_id});
    if(user)return user.username;
    else return "Anonymous";
  }
  });
  Template.images.events({
    'click .js-image':function(event){
      $(event.target).css('width','50px');
    },
    'click .js-del-image':function(event){
      var image_id=this._id;
      console.log(image_id);
      $("#"+image_id).hide('slow',function(){
        //delete after hiding it
        Images.remove({"_id":image_id});//mongo filter
      });

      },
    'click .js-rate-image':function(event){
      var rating=$(event.currentTarget).data("userrating");
      console.log(rating);
      var image_id=this._id;
      console.log(image_id);

      Images.update({_id:image_id},{$set:{rating:rating}});
    },
    'click .js-show-image-form':function(event){
      $("#image_add_form").modal('show');
    },
    'click .js-set-image-filter':function(event){

      Session.set("userFilter", this.createdBy);

    },
    'click .js-unset-image-filter':function(event){
      Session.set("userFilter",undefined);
    }
  });
  //


  Template.body.helpers({username:function(){
    if(Meteor.user()!=null){
      //console.log(Meteor.user().emails[0].address);
      return Meteor.user().username;
    }
    else return 'old user'
  }});


  //


  Template.image_add_form.events({
    'submit .js-add-image':function(event){
      var img_src, img_alt;
      img_src=event.target.img_src.value;
      img_alt=event.target.img_src.value;

      console.log("src:"+img_src+" alt:"+ img_alt);
      if(Meteor.user()) {
        Images.insert({
          img_src: img_src,
          img_alt: img_alt,
          createdOn: new Date(),
          createdBy:Meteor.user()._id
        });
      }
      return false;
    }


  });
  console.log("I am the client");
}

if(Meteor.isServer){
  console.log("I am the server");
}