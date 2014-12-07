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
var nameArray = []; //전역으로 이름 저장하고 가지고 있는 배열 그래프 Node 만들때 필요
var nodeArray = [];
var repoArray = []; //들럿던 repo를 다시 들어가지 않기 위해 이름을 저장해둔다.

describe("Auth", function(){
    this.timeout(10000);
    it("should authenticate with basic auth", function(done){
        var github = new Github({
            token   : "6a30e6b59c0f4b8f066346bcfc8dca274400cd78",
            auth: "oauth"
        });

        var user = github.getUser();

        // repo 안에 해당 repo들의 정보들이 막 들어가있다. contributors_url로 접근하기 위한!
        $(document).on("getRepo",function(e, repo){
            $.get(repo.contributors_url, function(contributor) {//그 repo중에 필요한 contributors_url로 접근! 그 안에는 그 repo에 참여하고 있는 유저들의 정보가 있다. 그 정보를 contributor에 넣는다.
                console.log("repository name : " + repo.name); //지금 접근해있는 repo[i]의 이름을 출력
                repoArray.push(repo.name);//들어간 repo이름을 저장한다.
                var name = [];//repo.name을 이름으로 가지는 전역 배열을 선언
                //organization repository에 참여하고 있는 닉네임 추출
                var returnArray = function(){
                    return name;
                } // 중간 중간 repo 넘어 갈때마다 다른 곳에 저장해둘 필요가 있다.
                for (var i in contributor) {
                    name.push(contributor[i].login);//해당 repo의 이름을 담은 배열이다.
                    if (nameArray.indexOf(contributor[i].login) == -1)//모든 이름을 담는 배열에 이름이 없을 경우에만 추가한다.
                        nameArray.push(contributor[i].login); //전역 Name에 추가
                }
                /*
                 addEdge는 그래프 만드는 과정에서 해주는 것아닌가? 노드도 아닌 상태인데 어캐 addEdge를 합니까
                 for (var i = 0; i < contributor.length-1; i++) {
                 for (var j = i + 1; j < contributor.length; j++){
                 nodeArray[i] = {
                 node1: contributor[i].login,
                 node2: contributor[j].login
                 };
                 }
                 }
                 */
                console.log("--> "+ repo.name + "'s member : "+ name);
                for(var i in contributor) {//contributor는 한 repo에 참여하고 있는 사람의 정보이다.
                    if(i<5){//일단은 5명 이내만 가져와본다.
                        $(document).trigger("getSubscriptions", contributor[i]);
                    }
                }
                /*
                 console.log("nameArray : "+ nameArray);
                 for(var i in nodeArray)
                 console.log("edgeArray ["+i+"] = " + nodeArray[i].node1 + " : " +nodeArray[i].node2);
                 */

            });

        });


        $(document).on("getuserRepo", function(e, list){
            user.orgRepos(list, function(err, repos){
                console.log(list+"'s repository list");
                for(var i in repos){
                    $(document).trigger("getRepo",repos[i]); //repos안에는 배열로 repo목록이 들어가있다. 하나씩 들어간다.
                }
            })
        });

        $(document).on("getSubscriptions", function(e, contributor){
            $.get(contributor.subscriptions_url, function (sub) {//subscriptions으로 하면 꼬리 물기가 가능하다.
                //여기서 sub이란 해당 유저가 참여하고 있는 repo의 정보이다. 개인 repo나 orgrepo 관계없이 다 뜬다.
                console.log(contributor.login);//repo에 참여하고 있는 사람의 아이디
                for (var i in sub) {
                    console.log("--> contributor" + i + " : " + sub[i].name);//sub.name이란 그 repo의 이름이다. 그니까 orgRepo->User->User's subscription's repo의 이름이다.
                    if (i < 15) {
                        if(repoArray.indexOf(sub[i].owner.login) == -1 ) {
                            $(document).trigger("getuserRepo", sub[i].owner.login);
                        }
                    }
                }
            });
        });




        //이곳으로 시작된다.
        user.orgRepos("CienProject2014", function(err, repos){
            console.log("CienProject2014's repository list");
            for(var i in repos){
                $(document).trigger("getRepo",repos[i]); //repos안에는 배열로 repo목록이 들어가있다. 하나씩 들어간다.
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