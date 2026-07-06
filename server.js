var h=require('http'),fs=require('fs'),p=require('path');
var root=__dirname;
var m={'html':'text/html','css':'text/css','js':'application/javascript','png':'image/png','svg':'image/svg+xml','ico':'image/x-icon','json':'application/json'};
h.createServer(function(q,r){
  var url=q.url.split('?')[0].replace(/#.*/,'');
  if(url==='/')url='/index.html';
  var fp=p.join(root,url);
  try{
    var s=fs.statSync(fp);
    if(s.isDirectory())fp=p.join(fp,'index.html');
    var ext=p.extname(fp).slice(1);
    var c=fs.readFileSync(fp);
    r.writeHead(200,{'Content-Type':(m[ext]||'text/plain')+';charset=utf-8'});
    r.end(c);
  }catch(e){
    try{
      var fp2=p.join(root,url+'.html');
      var c=fs.readFileSync(fp2);
      r.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
      r.end(c);
    }catch(e2){
      r.writeHead(404,{'Content-Type':'text/plain'});
      r.end('Not Found: '+url);
    }
  }
}).listen(3000,'127.0.0.1',function(){console.log('Server running at http://127.0.0.1:3000/')});
