
var nameArray = []; //전역으로 이름 저장하고 가지고 있는 배열 그래프 Node 만들때 필요
var repoArray = []; //들럿던 repo를 다시 들어가지 않기 위해 이름을 저장해둔다.
var count = 0 ;

var github = new Github({
    token   : "6a30e6b59c0f4b8f066346bcfc8dca274400cd78",
    auth: "oauth"
});

var user = github.getUser();

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}
// repo 안에 해당 repo들의 정보들이 막 들어가있다. contributors_url로 접근하기 위한!
$(document).on("getRepo",function(e, repo){
    if(count > 30){
        console.log("stop");
        sleep(10000000000000);
    }
    $.get(repo.contributors_url, function(contributor) {//그 repo중에 필요한 contributors_url로 접근! 그 안에는 그 repo에 참여하고 있는 유저들의 정보가 있다. 그 정보를 contributor에 넣는다.
        console.log("repository name : " + repo.name); //지금 접근해있는 repo[i]의 이름을 출력
        repoArray.push(repo.name);//들어간 repo이름을 저장한다.
        //repo.name을 이름으로 가지는 전역 배열을 선언
        var name = {};
        name[repo.name]=[];
        //organization repository에 참여하고 있는 닉네임 추출
        for (var i in contributor) {
            name[repo.name].push(contributor[i].login);//해당 repo의 이름을 담은 배열이다.
            if (nameArray.indexOf(contributor[i].login) == -1)//모든 이름을 담는 배열에 이름이 없을 경우에만 추가한다.
                nameArray.push(contributor[i].login); //전역 Name에 추가
        }
        console.log("--> "+ repo.name +
        "'s member : "+ name[repo.name]);
        for(var i in contributor) {//contributor는 한 repo에 참여하고 있는 사람의 정보이다.
            if(i<5){//일단은 5명 이내만 가져와본다.
                //$(document).trigger("getSubscriptions", contributor[i]);
            }
        }
        /*
         console.log("nameArray : "+ nameArray);
         for(var i in nodeArray)
         console.log("edgeArray ["+i+"] = " + nodeArray[i].node1 + " : " +nodeArray[i].node2);
         */
        console.log(name[repo.name]);
        var graph = {};
        if(name[repo.name].length !== 1) {
            graph[repo.name] = new Graph(name[repo.name].length);
            for (var i = 0; i < name[repo.name].length - 1; i++) {
                for (var j = i + 1; j < name[repo.name].length; j++) {
                    graph[repo.name].addEdge(i, j);
                }
            }
            graph[repo.name].vertexList = name[repo.name];
            document.write(repo.name+"</br>");
            graph[repo.name].getList(graph[repo.name]);
            graph[repo.name].showGraph();
            document.write("</br>");
        }

    });

});

$(document).on("getuserRepo", function(e, list){
    user.orgRepos(list, function(err, repos){
        console.log(list+"'s repository list");
        for(var i in repos){
            count++;
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
                    count++;
                    $(document).trigger("getuserRepo", sub[i].owner.login);
                }
            }
        }
    });
});

