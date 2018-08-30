const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const Config = require('../database-config/database');

router.post('/get', (req, response) => {
  const page_number = req.body.data.page_number ? Number(req.body.data.page_number) : 0;
  const limit = req.body.data.limit ? Number(req.body.data.limit) : 0;
  const skip = (page_number-1) * limit;

  try{
    MongoClient.connect(Config.MONGODB.url, { useNewUrlParser: true }, function(err, db) {
      if (err) {
        response.json({
          success: false,
          error_msg: err.toString()
        })
      }else{
        var dbo = db.db("user_interaction");

        dbo.collection("activity_log").countDocuments(function(err, count){
          if(!err){
            dbo = db.db("user_interaction");
            dbo.collection("activity_log").find({}, { sort: {activity_log_id: -1}, skip, limit }).toArray(function(error, res) {
              if (error) {
                db.close();
                response.json({
                  success: false,
                  error_msg: error.toString()
                })
              }else{
                db.close();
                response.json({
                  success: true,
                  couter: res.length,
                  data: res,
                  total: count
                })
              }
            });
          }
        })
      }
    });
  }catch(e){
    response.json({
      success: false,
      error_msg: e.toString()
    })
  }
});

router.post('/getOne', (req, response) => {
  const activity_log_id = req.body.activity_log_id;

  try{
    MongoClient.connect(Config.MONGODB.url, { useNewUrlParser: true }, function(err, db) {
      if (err) {
        response.json({
          success: false,
          error_msg: err.toString()
        })
      }else{
        var dbo = db.db("user_interaction");
        dbo.collection("activity_log").findOne({ activity_log_id }, function(err, result) {
          if (err) {
            response.json({
              success: false,
              error_msg: err.toString()
            })
          }else{
            response.json({
              success: true,
              data: result
            })
          }
        });
      }
      db.close();
    });
  }catch(e){
    response.json({
      success: false,
      error_msg: e.toString()
    })
  }
});


router.post('/save', (req, response) => {
  const activity_log = req.body.data.activity_log;

  try{
    MongoClient.connect(Config.MONGODB.url, { useNewUrlParser: true }, function(err, db) {
      if (err) {
        response.json({
          success: false,
          error_msg: err.toString()
        })
      }else{
        var dbo = db.db("user_interaction");

        dbo.collection("activity_log").insertOne(activity_log, function(err, res) {
          if (err) {
            response.json({
              success: false,
              error_msg: err.toString()
            })
          }else{
            response.json({
              success: true,
              message: 'New activity log has been added'
            })
          }
        });
      }
      db.close();
    });
  }catch(e){
    response.json({
      success: false,
      error_msg: e.toString()
    })
  }
});

router.post('/update', (req, response) => {
  const activity_log = req.body.data.activity_log;

  try{
    MongoClient.connect(Config.MONGODB.url, { useNewUrlParser: true }, function(err, db) {
      if (err) {
        response.json({
          success: false,
          error_msg: err.toString()
        })
      }else{
        var dbo = db.db("user_interaction");

        dbo.collection("activity_log").updateOne({activity_log_id: activity_log.activity_log_id}, {$set: activity_log}, function(err, res) {
          if (err) {
            response.json({
              success: false,
              error_msg: err.toString()
            })
          }else{
            response.json({
              success: true,
              message: 'The activity has been updated'
            })
          }
        });
      }
      db.close();
    });
  }catch(e){
    response.json({
      success: false,
      error_msg: e.toString()
    })
  }
});

router.post('/remove', (req, response) => {
  const activity_log_id = req.body.data.activity_log_id;

  try{
    MongoClient.connect(Config.MONGODB.url, { useNewUrlParser: true }, function(err, db) {
      if (err) {
        response.json({
          success: false,
          error_msg: err.toString()
        })
      }else{
        var dbo = db.db("user_interaction");

        dbo.collection("activity_log").remove({ activity_log_id }, function(err, res) {
          if (err) {
            response.json({
              success: false,
              error_msg: err.toString()
            })
          }else{
            response.json({
              success: true,
              message: 'The activity has been removed'
            })
          }
        });
      }
      db.close();
    });
  }catch(e){
    response.json({
      success: false,
      error_msg: e.toString()
    })
  }
});

module.exports = router;
