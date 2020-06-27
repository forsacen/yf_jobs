# jobs
nodejs 开发的工作流水线框架

const Jobs=require('./jobs')

jobs:constructor

    jobs=new Jobs(option)
        option:object 
        opiton.limiter:number 最多同时做多少个工作,0为不限
        option.callback:function(option,done) 做的工作,option就是queue放进去的数据,done是传过来的内置函数,工作完成后必须调用done函数
                        
jobs:method

    jobs.queue(option) reuturn null
        option:object 添加的数据,如果new jobs的option里包含callback,该option会作为参数传给callback

    jobs.queueSize() reuturn number
        工作队列长度,就是还未从队列中取出的工作的数量,read-only
        
        
jobs:event

    Event: 'drain',所有任务完成的时候触发
    jobs.on('drain',function(){
        console.log('all jobs done')
    }); 
