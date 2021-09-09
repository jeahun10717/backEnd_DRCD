const express = require('express');
const Joi = require('joi');

const tweet = express.Router();
const tweetsCtrl = require('./tweets.ctrl');

const tweets = [{
    id: 1,
    text: '드림코딩에서 강의 들으면 너무 좋으다AAA',
    createdAt: '2021-05-09T04:20:57.000Z',
    name: 'Bob',
    username: 'bob',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
}, ];

tweet
.get('/', (req, res, next) => {
    const queryData = Joi.object({
        username: Joi.string()
    }).validate(req.query);

    if(queryData.error) throw new Error('잘못된 전송 형태 입니다.')

    const username = queryData.value.username;

    const data = tweets.filter((record) => record.username === username)
    if(username){ // * url : /tweets
        res.status(200).send(data);
        // console.log("query exist");
    }else{  // * url : /tweets?username={username}
        res.status(200).send(tweets)
        // console.log("query none exist");
    }
    next();
})
.get('/:id', (req, res, next)=>{
    const params = Joi.object({
        id: Joi.number().required()
    }).validate(req.params);
    const post = tweets.filter((record)=>record.id === params.value.id);
    
    if(params.error) {
        throw new Error(400, "잘못된 id 형식입니다")
    }
    if(!post.length){
        res.status(400).send('Bad Request : 없는 계시물 입니다');
    }else{
        res.status(200).send(post);
    }
    next();
})
.post('/', (req, res, next) => {
    const reqBody = req.body;
    req.body.createdAt = new Date(); // 날짜 설정
    req.body.id = tweets[tweets.length-1].id + 1;
    // console.log(reqBody.createAt);
    const inpTweet = Joi.object({
        id: Joi.number(),
        text: Joi.string().required(),
        createdAt: Joi.date(),
        name: Joi.string().required(),
        username: Joi.string().required(),
        url: Joi.string().required()
    }).validate(req.body);
    if(inpTweet.error) throw new Error('잘못된 형식의 전송입나다.')
    // console.log(inpTweet.error);
    if(inpTweet.error) res.status(400).send('Bad Request'); // 잘못된 요청일 시 400 에러
    else {
        tweets.push(inpTweet.value);
        res.status(200).send('등록성공');    
    }    
    // console.log(inpTweet.value);
    // console.log(tweets);
    next();
})
.put('/:id', (req, res, next)=>{
    const params = Joi.object({
        id: Joi.number().required()
    }).validate(req.params);
    const text = Joi.object({
        text: Joi.string()
    }).validate(req.body);
    const post = tweets.filter((record)=>record.id === params.value.id);
    // console.log(id, post);
    console.log(text.error);
    console.log(params.error);
    if(params.error || text.error) throw new Error('잘못된 정송 형태 입니다.')

    if(!post.length){
        res.status(400).send('Bad Request : 없는 계시물 입니다');
    }else{
        tweets[tweets.findIndex((record)=>record.id === params.value.id)]
        .text = text.value.text;
        res.status(200).send('text update 완료')
    }
    next();
})
.delete('/:id', (req, res, next)=>{
    const params = Joi.object({
        id: Joi.number().required()
    }).validate(req.params);
    const post = tweets.filter((record)=>record.id === params.value.id);
    
    if(params.error) {
        throw new Error(400, "잘못된 id 형식입니다")
    }
    if(!post.length){
        res.status(400).send('Bad Request : 없는 계시물 입니다');
    }else{
        tweets.splice(tweets.findIndex((record)=>record.id === params.value.id), 1);
        res.status(200).send("delete complete");
    }
    next();
})


module.exports = tweet;