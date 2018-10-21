
(function(){
"use strict";
var express = require('express'),
    // Instantiating express module
    unibrowseRouter = express.Router(),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    logger = require('js-logger'),
    less = require('less-middleware'),
    db,
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient;

unibrowseRouter.get("/professors", function(req,res){
    /*
    * storing the user passed string in a variable
    */
    var queryString = req.query['search'];

    /*
    * define the criteria to sort the results.
    */
    var mysort = { name: 1 };

    /*
    * Excluding the ID field while displaying results.
    */
    db.collection('professor').find({"name": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
        if(err) throw err;

        /*
        * If the string searched is a professor name, result will return an array.
        * check array contains information.
        */
        if (result.length!=0){
            console.log("Found name.");
            // console.log(result);
            res.send(result);
            db.close();
        }

        /*
        * If the string searched is not a professor name or no matching results in the name field, result will be null.
        */
        else{
            console.log("Could not find name.");

            /*
            * check if the string is a research area of a professor
            */
            db.collection('professor').find({"research": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
                if(err) throw err;

                /*
                * if the string looked for is a research area of a professor, return all the professors with the given research interest.
                */
                if (result.length!=0){
                    console.log("Found professors with similar research.");
                    res.send(result);
                    db.close();
                }

                else{
                    console.log("Could not find professors with similar research.");

                    /*
                    * check if the string is contact information for a professor
                    */
                    db.collection('professor').find({"contact": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
                        if(err) throw err;

                        if (result.length!=0){
                            console.log("found professors.");
                            res.send(result);
                            db.close();
                        }

                        else{
                            console.log("Could not find professors.");
                            res.send(404)
                        }
                    });
                }
            });
        }
    });
});

unibrowseRouter.get("/faqs", function(req,res){

  // data['link'] = link
  // data['tags'] = tagsList[i]
  // data['title'] = question
  // data['a'] = answer

    /*
    * storing the user passed string in a variable
    */
    var queryString = req.query['search'];

    /*
    * define the criteria to sort the results.
    */
    var mysort = { name: 1 };

    /*
    * Excluding the ID field while displaying results.
    */
    db.collection('faqs').find({"title": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
        if(err) throw err;

        /*
        * If the string searched is a professor name, result will return an array.
        * check array contains information.
        */
        if (result.length!=0){
            console.log("Found question.");
            // console.log(result);
            res.send(result);
            db.close();
        }

        /*
        * If the string searched is not a professor name or no matching results in the name field, result will be null.
        */
        else{
            console.log("Could not find question.");

            /*
            * check if the string is a research area of a professor
            */
            db.collection('faqs').find({"tags": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
                if(err) throw err;

                /*
                * if the string looked for is a research area of a professor, return all the professors with the given research interest.
                */
                if (result.length!=0){
                    console.log("Found questions with similar attributes.");
                    res.send(result);
                    db.close();
                }

                else{
                    console.log("Could not find similar questions.");

                    /*
                    * check if the string is contact information for a professor
                    */
                    db.collection('faqs').find({"a": {$regex:queryString}}, { _id: 0 }).sort(mysort).toArray(function(err,result){
                        if(err) throw err;

                        if (result.length!=0){
                            console.log("Answers matching your search.");
                            res.send(result);
                            db.close();
                        }

                        else{
                            console.log("Could not find any related question/answer to your query.");
                            res.send(404)
                        }
                    });
                }
            });
        }
    });
});

  module.exports = unibrowseRouter;

}());