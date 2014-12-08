var uniqueNames = new Array();
var lastGraph;
var manygraph = {};
var graphnumber = 0;

function Graph(v) {
   //vertices는 숫자이다.
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
   this.makeLastGraph = makeLastGraph;

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
   this.edges++;
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

      $('#orga_table').append("["+this.vertexList[i] + "]'s project team (Size : "+this.vertices+") → ");
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
   console.log(manygraph);//만들어진 그래프가 저장됩니다.
   // var newList = g1.vertexList.concat(g2.vertexList);
   //return newList;
}

function makeLastGraph(){

   var g = new Graph(uniqueNames.length);
   g.vertexList = uniqueNames;

   for(var i in uniqueNames) {
      var first_index = uniqueNames[i].indexOf(manygraph[1].vertexList[0]);
      if(first_index != -1) {
         break;
      }
   }
   for(var i in uniqueNames){
      var second_index = uniqueNames[i].indexOf(manygraph[1].vertexList[0]);
      if(second_index != -1){
         break;
      }
   }
   g.addEdge(first_index, second_index);
   //노드를 전체 참여자 list로 만든다.
   
   g.showGraph();

}
