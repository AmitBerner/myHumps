const request = require("request")
const EventEmitter = require("events").EventEmitter
let rekt = new EventEmitter()
const clientId = "e3fhxm0g716hawavezr6fj27r06chg"
function _RequestCreator(reqUrl,parameters){
  return{
    method: 'GET',
    url: reqUrl,
    qs: parameters,
    headers: {
      'Accept': 'Accept: application/vnd.twitchtv.v5+json',
      'Client-ID': clientId
    },
    json: true
  };
}
function reqGame(gameName,curser,container)
{
    let reqPar = {game: gameName, limit: 100, offset: curser}
    request(_RequestCreator("https://api.twitch.tv/kraken/streams/",reqPar),(error,response,data)=>{
       if(error){
          return console.log(error);
        }
        if(curser===0){ container.totalStreams = data._total}
        
        if(curser<=container.totalStreams)
        {
            for (i in data.streams)
            {
                let channel = data.streams[i].channel
                container.streams[curser++] = {displayName: channel.display_name, url: channel.url, views: channel.views}
            }
            rekt.emit('update',gameName,curser,container)
        }
        else{
            rekt.emit('done',container)
        }

    })
}

rekt.on('new',(gameName)=>{
    let container = {totalStreams: 0, streams: []}
    reqGame(gameName,0,container)
    //console.log(0)
})
rekt.on('update',(gameName,curser,container)=> {
    reqGame(gameName,curser,container)
    //console.log(curser)
})
rekt.on('done',(container)=>{
    console.log(container.streams.length)
})


exports.requestGame = (gameName)=>{
    rekt.emit('new',gameName)
}

