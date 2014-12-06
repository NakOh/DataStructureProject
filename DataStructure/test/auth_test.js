if (typeof require !== 'undefined') {
    var Github = require("../")
        , chai = require("chai");
}
chai.should();

/* not used
 var expect = chai.expect
 , TEST_USERNAME = "NakOh"
 , TEST_PASSWORD = "alstn12";

 // var util = require("util");
 */

describe("Auth", function(){
    this.timeout(10000);
    it("should authenticate with basic auth", function(done){
        var github = new Github({
            token   : "6a30e6b59c0f4b8f066346bcfc8dca274400cd78",
            auth: "oauth"
        });

        var user = github.getUser();


        $(document).on("getRepo",function(e, repo){
            $.get(repo.contributors_url, function(contributor){
                console.log("repository name : "+repo.name);//해당 orgrepo 의 repo 이름 출력

                //organization repository에 참여하고 있는 닉네임 추출
                var arr=[];
                for(var i in contributor){
                    arr.push(contributor[i].login);
                }

                console.log("--> "+repo.name + "'s member : "+ arr);
                for(var i in contributor) {
                    if(i<5){
                        $(document).trigger("getContributor", contributor[i]);
                    }
                }

            });

        });

        $(document).on("getContributor", function(e, contributor){
            $.get(contributor.subscriptions_url, function (org) {
                console.log(contributor.login);
                for (var i in org) {

                    console.log("--> " + i + " : " + org[i].name);
                }
                for (var i in org.repos) {
                    if (i < 15)
                        $(document).trigger("getRepo", org.repos[i]);
                }
            });
        });


        user.orgRepos("CienProject2014", function(err, repos){
            console.log("CienProject2014's repository list");

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