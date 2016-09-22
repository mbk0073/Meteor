/**
 * Created by Ambikeya on 06-09-2016.
 * Checks if we are running on the server and accordingly process the images
 *
 */
//Images=new Mongo.Collection("images");
//print out the values of collection
console.log(Images.find().count());

if(Meteor.isServer){
    Meteor.startup(function(){
        if(Images.find().count()==0){
            for(var i=1; i<23; ++i){
                Images.insert({
                    img_src:"img_"+i+".jpg",
                    img_alt:"img number"+i
                });

            }//end of for loop
            console.log(Images.find().count());
        }//end of if has images
    });
}