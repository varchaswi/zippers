const
    connection = require('../db/connection'),
    Tags = require('../models/Tags');

module.exports = {
    update_rfid: function (client) {
        client.publish("log","called");
        connection
            .query('SELECT * FROM tags')
            .then(data => {
                data.forEach(element => {
                    if(element.Action === "ADD"){
                        let tag = new Tags();
                        tag.tagID = element.TagId;
                        tag.passType = element.Pass;
                        tag.assignedTo = element.EmployeeName;
                        Tags.findOneAndUpdate({tagID:element.TagId},tag,{upsert:true},function(data,err){
                            if(err){
                                client.publish("UIerrors","can save record with Id "+element.ID+" "+err.toString());
                            }
                        })
                    }

                    if(element.Action ==="DELETE"){
                        Tags.findOneAndDelete({tagID:element.TagId},function(data,err){
                            if(err){
                                client.publish("UIerrors",err.toString());
                            }
                        })
                    }
                    
                });
            })
            .catch(error => {
                client.publish("UIerror",error.toString());
            });
    }
}