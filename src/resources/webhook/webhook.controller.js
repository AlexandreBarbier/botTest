'use strict';
var token = 'EAAPWjr85VUcBABl6FnI0Ebdp16EwxZADj8uBNZBU7277QgJMzmGGZBNiWrAZAKZBJ8HnFX462esP8ZBSnkUgYmJ3KXoQt8pxqusY6bmKEzU2J7mE9COXIRpPTOGoguTYbmNRYf6XHoilGZBL0OnVjZAiHI7ZCJnsD0t7WZCXP4Lfq6lQZDZD';
var request = require('koa-request');

exports.index = function*(next) {
  var hub = this.query;
  
  this.status = 400;
  this.body = {result:'no validation token'};
  
  if (hub['hub.verify_token'] != undefined) {
     this.status = 200;
    if (hub['hub.verify_token'] === 'alpha') {
      this.body = hub['hub.challenge'];
    }
    else {
      this.body = 'Error, wrong validation token ';    
    }      
  } 
};

exports.post = function *(next) {
  this.status = 200;
  var rBody = this.request.body;
  var messaging_events = rBody.entry[0].messaging;
  var i = 0;
  
  for (i = 0; i < messaging_events.length; i++) {
    var event = rBody.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      
      var userResponse = yield request({
        url:"https://graph.facebook.com/v2.6/" + sender + "?fields=first_name&access_token=" + token,
        method:'GET'
      });
      var user = JSON.parse(userResponse.body);           
      var textToSend = "Hi " + user.first_name; 
      if (text.toUpperCase() === 'TEST') {
        textToSend = textToSend + " thank you for testing";
      }
      var salutation = {
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token:token},
          method: 'POST',
          json: {
              recipient: {'id':sender},
              message: {text:  textToSend}
          }  
      };
      var resp = yield request(salutation);
    }
  }
};