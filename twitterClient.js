function twitterClient(client,wordOne, wordTwo){
    if(client === null || client === undefined) throw new Error('client not passed');
    if(!wordOne||!wordTwo) throw new Error('words supplied are empty');
    this.words = [wordOne,wordTwo]; 
    let stream = client.stream('statuses/filter', { track: this.words, language: 'en' });
    return stream;
}

module.exports = twitterClient;