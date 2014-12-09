var uniqueNames = new Array();
var manygraph = new Array();
var graphnumber = 0;
var g ;
var nodeMap = {};

var nodeMap1 = {};
var edgeMap = {};

function Graph(v) {
   //vertices는 숫자이다.

   this.weight = 0;
   this.vertices = v;
   this.vertexList = [];
   this.edges = 0;
   this.adj = [];
   for (var i = 0; i < this.vertices; ++i) {
      this.adj[i] = [];
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

   this.adj[v].push(w);
   this.adj[w].push(v);

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
   if(nodeMap1[node] === undefined){
      nodeMap1[node] = 1;
      this.edges++;
   }
   else{
      nodeMap1[node] = nodeMap[node] + 1 ;
   }
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
      $('#orga_table').append("["+this.vertexList[i] + "]'와 함께하는 개발자들 (Size : "+this.vertices+") → ");
      console.log(this.vertexList);
      console.log(edgeMap);
      visited.push(this.vertexList[i]);
      for (var j = 0; j < this.vertices; ++j) {
         if (this.adj[i][j] != undefined) {
            if (visited.indexOf(this.vertexList[j]) < 0) {
               $('#orga_table').append(this.vertexList[j] + ', ');
            }
         }
      }
      $('#orga_table').append("<br/>");
      visited.pop();
   }
}

function showLastGraph() {
   var visited = [];
   for (var i = 0; i < this.vertices; ++i) {
      $('#orga_table').append("["+this.vertexList[i] + "]'와 함께하는 개발자들 (Size : "+edgeMap[i]+") → ");
      visited.push(this.vertexList[i]);
      for (var j = 0; j < this.vertices; ++j) {
         if (this.adj[i][j] != undefined) {
            if (visited.indexOf(this.vertexList[j]) < 0) {
               $('#orga_table').append(this.vertexList[j] + ', ');
            }
         }
      }
      $('#orga_table').append("<br/>");
      visited.pop();
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
      for (var m = 0; m < manygraph[k].vertexList.length - 1; m++) {
         for (var j = m + 1; j < manygraph[k].vertexList.length; j++) {
            for (var i in uniqueNames) {
               var sortManyList = manygraph[k].vertexList.sort();
               var first_index = uniqueNames.indexOf(sortManyList[m]);
               if (first_index != -1) {
                  break;
               }
            }
            for (var l in uniqueNames) {
               var sortManyList = manygraph[k].vertexList.sort();
               var second_index = uniqueNames.indexOf(sortManyList[j]);
               if (second_index != -1) {
                  break;
               }
            }

            if(first_index != -1 && second_index != -1) {
               g.finaladdEdge(first_index, second_index);
            }

         }
      }
   }

   $('#orga_table').append("<hr color='black' size='2'/>");
   //노드를 전체 참여자 list로 만든다.
   g.showLastGraph();

});
