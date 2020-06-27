const EventEmitter = require('events').EventEmitter
const util=require('util')
const https=require('https')
function jobs(opt){
    EventEmitter.call(this)
    this.pool=[]
    this.count=0
    this.opt=opt
    this.done=this._done.bind(this)
}

util.inherits(jobs,EventEmitter)

jobs.prototype.queue=function(data){
    this.pool.push(data)
    this._schedule()
}

jobs.prototype.queueSize=function(){
    return this.pool.length
}

jobs.prototype._schedule=function(){
    if(this.pool.length>0 && ((this.opt.limit>0 && this.count<this.opt.limit)||!this.opt.limit)){
        this.count++
        let data=this.pool.shift()
        if(this.opt.callback&&typeof this.opt.callback=='function'){
            this.opt.callback(data,this.done)
        }else{
            this.done()
        }
    }
}

jobs.prototype._done=function(){
    this.count--
    if(this.count===0 && this.pool.length===0){
        this.emit('drain')
    }else{
        this._schedule()
    }
}

module.exports=jobs
const url=require('url')
let r=new jobs({limit:2,callback:(option,done)=>{
        var options = url.parse(option.url)
        const req = https.request(options, (res) => {
            console.log(`状态码: ${res.statusCode}`)
            let body=''
            res.on('data', (chunk) => {
                body+=chunk
            })
            res.on('end', () => {
                //console.log(body)
                console.log(option.url)
                done()
            })
        })
        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`)
            done()
        })
        req.end();
}})
r.on('drain',()=>{
    console.log('drain')
})
r.queue({url:'https://www.sina.com'})
r.queue({url:'https://www.baidu.com'})
r.queue({url:'https://www.qq.com'})
r.queue({url:'https://www.163.com'})