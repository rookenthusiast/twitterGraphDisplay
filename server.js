const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(server);
const router = express.Router();
const Twit = require('twit');
const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
const client = require('./twitterClient');

function filterTweets(tweet, sockInst, data) {
   console.log(tweet.text.search(new RegExp(data.first, "i")) >= 0);
    if (tweet.text.search(new RegExp(data.first, "i")) >= 0 ) {
        tweet.tagged = 'first';
        return sockInst.emit('tweet', tweet);
    } else if (tweet.text.search(new RegExp(data.second, "i")) >= 0) {
        tweet.tagged = 'second';
        return sockInst.emit('tweet', tweet);
    }
}
// socket handler
io.on('connection', function (socket) {
    console.log('user has connected');
    let stream = null;
    socket.on('set', function (data) {
        try {
            console.log('set', data);
            stream = new client(T, data.first, data.second);
            console.log(stream);
            stream.on('tweet', function (tweet) {
                filterTweets(tweet,socket,data);
            })
            stream.on('disconnect', function (disconnectMessage) {
                console.log('disconnected from stream: ', disconnectMessage);
            })
        } catch (err) {
            console.error(err);
            socket.emit('closeStream');
        }
    });
    socket.on('closeStream', function () {
        if (stream != null) {
            stream.stop();
            socket.emit('streamClosed');
            console.log('stream stopped');
        } else {
            console.log('no stream init');
        }
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
        if (stream != null) {
            stream.stop();
        }
    })
});
app.use(express.static(path.join(__dirname, '/app')));
app.use(express.static(path.join(__dirname, '/bower_components')));

router.get('/api/heartbeat', (req, res) => {
    res.status(200).send({
        message: 'API RESPONDING'
    })
})

router.get('/api/user', (req, res) => {
    T.get('account/verify_credentials').then(user => {
        const data = {
            name: user.data.name,
            screenName: user.data.screen_name
        }
        res.status(200).send(data)
    }).catch(error => {
        res.status(400).send(error);
    });
})

// const stream = client.stream('statuses/filter', { track: ['Trump'] })
// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })

app.use(router);
server.listen(3000, () => console.log('Example app listening on port 3000!'));