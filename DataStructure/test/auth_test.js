if (typeof require !== 'undefined') {
    var Github = require("../")
      , chai = require("chai");
}
chai.should();
var expect = chai.expect
  , TEST_USERNAME = "NakOh"
  , TEST_PASSWORD = "alstn12";

// var util = require("util");

describe("Auth", function(){
  this.timeout(10000);
  it("should authenticate with basic auth", function(done){
    var github = new Github({
      token: "6a30e6b59c0f4b8f066346bcfc8dca274400cd78",
      auth: "oauth"
    });

    var user = github.getUser();

    user.repos(function(err, repos) {
      console.error(util.inspect(err));
      //console.log(repos); //user의 레포지터리를 가져온다.
      expect(err).to.be.null;
      repos.should.be.ok;
      repos.length.should.be.above(1);
      done();

    });

    $(document).on("getRepo",function(e, repo){
       $.get(repo.contributors_url, function(res){
          console.log(repo.name);//해당 orgrepo 의 repo 이름 출력

        //organization repository에 참여하고 있는 닉네임 추출
        var arr=[];
        for(var i in res){
          arr.push(res[i].login);
        }

          console.log(arr);
          console.log(res[0]);

        $.get(res[0].subscriptions_url, function(org){
          console.log(org);
        });

      });

    });


    user.orgRepos("CienProject2014", function(err, repos){

      for(var i in repos){ //repos에는
        $(document).trigger("getRepo",repos[i]); //CienProject2014라는 orgRepository에 접근 getrepo를 실행시켜라
      }
    });

/*
    g = new Graph(6);
    g.addEdge(1,2);
    g.addEdge(2,5);
    g.addEdge(1,3);
    g.addEdge(1,4);
    g.addEdge(0,1);
    g.vertexList = ["CS1", "CS2", "Data Structures",
      "Assembly Language", "Operating Systems",
      "Algorithms"];
    g.showGraph();
    g.topSort();
    */



  });
});