var uniqueNames = new Array();
var manygraph = new Array();
var graphnumber = 0;
var g ;
var nodeMap = {};
var finalNodeMap = {};
var edgeMap = {};

function Graph(v) {
   //vertices는 숫자이다.
   this.vertices = v;
   this.vertexList = [];
   this.edges = 0;
   this.adj = [];
   for (var i = 0; i < this.vertices; ++i) {
      this.adj[i] = [];//그럼 adj[0] = []이 되고? 즉 배열이 되고 ? 배열 에 푸쉬 ""를?
      this.adj[i].push("");
   }
   this.addEdge = addEdge;
   this.showGraph = showGraph;
   this.showLastGraph = showLastGraph;
   this.dfs = dfs;
   this.marked = [];
   for (var i = 0; i < this.vertices; ++i) {
      this.marked[i] = false;
   }
   this.bfs = bfs;
   this.edgeTo = [];
   this.hasPathTo = hasPathTo;
   this.pathTo = pathTo;
   this.topSortHelper = topSortHelper;
   this.topSort = topSort;
   this.saveGraph = saveGraph;
   this.getList = getList;
   this.finaladdEdge = finaladdEdge;
   this.finalWeight = finalWeight;

}

function topSort() {
   var stack = [];
   var visited = [];
   for (var i = 0; i < this.vertices; i++) {
      visited[i] = false;
   }
   for (var i = 0; i < this.vertices; i++) {
      if (visited[i] == false) {
         this.topSortHelper(i, visited, stack);
      }
   }
   for (var i = 0; i < stack.length; i++) {
      if (stack[i] != undefined && stack[i] != false) {
         $('#orga_table').append(this.vertexList[stack[i]]);
      }
   }
}

function topSortHelper(v, visited, stack) {
   visited[v] = true;
   for  (var w in this.adj[v]) {
      if (!visited[w]) {
         this.topSortHelper(visited[w], visited, stack);
      }
   }
   stack.push(v);
}

function addEdge(v,w) {

   this.adj[v].push(w);
   this.adj[w].push(v);

   var node = v + "," + w;

   if(nodeMap[node] === undefined){
      nodeMap[node] = 1;
      this.edges++;
   }
   else{
      nodeMap[node] = nodeMap[node] + 1 ;
   }
}

function finaladdEdge(v,w) {
   var node = v + "," + w;
   var edge1 = v;
   var edge2 = w;

   if(edgeMap[edge1] === undefined && edgeMap[edge2] === undefined) {
      edgeMap[edge1] = 1;
      edgeMap[edge2] = 1;
   }
   else  if(edgeMap[edge1] !== undefined && edgeMap[edge2] === undefined){
      edgeMap[edge1] = edgeMap[edge1] + 1;
      edgeMap[edge2] = 1;
   }
   else if(edgeMap[edge1] === undefined && edgeMap[edge2] !== undefined){
      edgeMap[edge1] = 1;
      edgeMap[edge2] = edgeMap[edge2] + 1;
   }
   else{
      edgeMap[edge1] = edgeMap[edge1] + 1;
      edgeMap[edge2] = edgeMap[edge2] + 1;
   }

   if(finalNodeMap[node] === undefined){
      finalNodeMap[node] = 1;
      this.adj[v].push(w);
      this.adj[w].push(v);
      this.edges++;
   }
   else{
      finalNodeMap[node] = finalNodeMap[node] + 1 ;

   }
}

function finalWeight(){
   var nodes = Object.keys(finalNodeMap);
   var index = {};
   var j = 0;
   for(var i in nodes){
      index[i] = nodes[i].toString().split(',');
   }
   $('#orga_table').append('<br/><h3>개발자간 친밀도</h3>');
   for (var i = 0; i < nodes.length  - 1; i++) {
         $('#orga_table').append("<b>"+uniqueNames[index[i][j]] + "</b> 와 <b>" + uniqueNames[index[i][j+1]] + "</b> 의 친밀도는" + finalNodeMap[index[i][j] + "," + index[i][j+1]] + "이다<br/>" + "</br>");
   }
   $('#orga_table').append('<br/>');

}

/*function showGraph() {
 for (var i = 0; i < this.vertices; ++i) {
 putstr(i + " -> ");
 for (var j = 0; j < this.vertices; ++j) {
 if (this.adj[i][j] != undefined)
 putstr(this.adj[i][j] + ' ');
 }
 print();
 }
 }*/

// a new function to display symbolic names instead of numbers
function showGraph() {
   var visited = [];
   for (var i = 0; i < this.vertices; ++i) {
      $('#orga_table').append("[ <b>"+this.vertexList.sort()[i] + "</b> (Edge 개수 : "+(this.vertices-1) +") ] 와 동일한 프로젝트에 참여한 개발자  → ");
      visited.push(this.vertexList.sort()[i]);
      for (var j = 0; j < this.vertices; ++j) {
         if (this.adj[i][j] != undefined) {
            if (visited.indexOf(this.vertexList.sort()[j]) < 0) {
               $('#orga_table').append(this.vertexList.sort()[j] + ', ');
            }
         }
      }
      $('#orga_table').append("<br/>");
      visited.pop();
   }
}

function showLastGraph() {
   var visited = [];
   var edgeSizeMap = new Map();
   for (var i = 0; i < this.vertices; ++i) {
      $('#orga_table').append("[ <b>"+this.vertexList.sort()[i] + "</b> (Edge : "+(this.adj[i].length - 1)+")] 와 동일한 프로젝트에 참여한 개발자  → ");
      edgeSizeMap.set(this.vertexList.sort()[i], this.adj[i].length - 1);
      visited.push(this.vertexList.sort()[i]);//전체 그래프의 노드의 리스트를 하나씩 집어 넣음
       for (var j = 0; j < this.vertices; ++j) {
         if (this.adj[i][j] != undefined) {//adj[6][3]이 RANYO가 존재한다는 뜻!! why? (3,6)이 들어갔다.
            if(i == this.adj.length-1) {
               if(j != this.adj[i].length-1){
                  if (visited.indexOf(this.vertexList.sort()[j]) < 0) {
                     $('#orga_table').append(this.vertexList.sort()[j] + ', ');
                  }
               }
            }
            else {
               if (visited.indexOf(this.vertexList.sort()[j]) < 0) {
                  $('#orga_table').append(this.vertexList.sort()[j] + ', ');
               }
            }
         }
      }
      $('#orga_table').append("<br/>");



      visited.pop();
   }
   $('#orga_table').append("<br/><h2>분석결과</h2>");
   $('#orga_table').append("<br/><h3>개발자 활동량 TOP5</h3>");
   var keyArray =[];
   var valueArray=[];

   console.dir(edgeSizeMap);
    edgeSizeMap.foreach(function (key, value) {
    keyArray.push(key);
    valueArray.push(value);
    });
   for(var i=0; i<5; i++){
      $('#orga_table').append("<br/><b>"+keyArray[i]+"</b> / Edge Size : "+valueArray[i]+"<br/>");
   }


}

function dfs(v) {
   this.marked[v] = true;
   if (this.adj[v] != undefined) {
      $('#orga_table').append("Visited vertex: " + v);
   }
   for (var w in this.adj[v]) {
      if (!this.marked[w]) {
         this.dfs(w);
      }
   }
}

function bfs(s) {
   var queue = [];
   this.marked[s] = true;
   queue.unshift(s);
   while (queue.length > 0) {
      var v = queue.shift();
      if (typeof(v) != "string") {
         $('#orga_table').append("Visited vertex: " + v);
      }
      for (var w in this.adj[v]) {
         if (!this.marked[w]) {
            this.edgeTo[w] = v;
            this.marked[w] = true;
            queue.unshift(w);
         }
      }
   }
}

function hasPathTo(v) {
   return this.marked[v];
}

function pathTo(v) {
   var source = 0;
   if (!this.hasPathTo(v)) {
      return undefined;
   }
   var path = [];
   for (var i = v; i != source; i = this.edgeTo[i]) {
      path.push(i);
   }
   path.push(s);
   return path;
}

function getList(g){
   var namespace = new Array();

   for (var i in g.vertexList) {
      namespace.push(g.vertexList[i]);
   }

   $.each(namespace, function(i, el){
      if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
   });

}
function saveGraph(graph){
   graphnumber++;
   manygraph[graphnumber]=graph;
   //console.log(manygraph);//만들어진 그래프가 저장됩니다.
   // var newList = g1.vertexList.concat(g2.vertexList);
   //return newList;
}

var makeLastGraph = (function(){
   g = new Graph(uniqueNames.length);
   g.vertexList = uniqueNames.sort();

   for(var k = 1; k < manygraph.length; k++) {
      var sortManyList = manygraph[k].vertexList.sort();
      for (var m = 0; m < manygraph[k].vertexList.length - 1; m++) {
         for (var j = m + 1; j < manygraph[k].vertexList.length; j++) {
            for (var i in uniqueNames) {
               var first_index = uniqueNames.indexOf(sortManyList[m]);
               if (first_index != -1) {
                  break;
               }
            }
            for (var l in uniqueNames) {
               var second_index = uniqueNames.indexOf(sortManyList[j]);
               if (second_index != -1) {
                  break;
               }
            }

            if(first_index != -1 && second_index != -1) {
               console.log(first_index + "," + second_index);
               g.finaladdEdge(first_index, second_index);
            }

         }
      }
   }

   $('#orga_table').append("<hr color='black' size='2'/><h1 class='h1'>만들어진 그래프</h1>");
   //노드를 전체 참여자 list로 만든다.
   g.showLastGraph();
   g.finalWeight();
});
