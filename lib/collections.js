/**
 * Created by asus on 19-09-2016.
 */
Images=new Mongo.Collection("images");


//Security

Images.allow({
    insert:function(userId, doc){
        console.log("Testing security on Image insert");
        if(Meteor.user()){
            console.log(doc);
            //force the image to owned by the user
            doc.createdBy=userId;
            if(userId!=doc.createdBy){
                //user is messing about
                return false;
            }
            else{
                //the user is logged in and has the correc user id
                return true;
            }
            return false;
        }
        else{
            //user not  logged in
            return false;
        }
    },

    remove:function (userId, doc){
        return userId==doc.createdBy;
    }



})