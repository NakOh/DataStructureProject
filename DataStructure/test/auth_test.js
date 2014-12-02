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
      username: TEST_USERNAME,
      password: TEST_PASSWORD,
      auth: "basic"
    });

    var user = github.getUser();

    user.repos(function(err, repos) {
      // console.error(util.inspect(err));
      console.log(repos); //user의 레포지터리를 가져온다.
      expect(err).to.be.null;
      repos.should.be.ok;
      repos.length.should.be.above(1);
      done();

    });

    $(document).on("getRepo",function(e, repo){
      $.get(repo.contributors_url, function(res){
        console.log(repo.name);
        console.log(res);
        //organization repository에 참여하고 있는 닉네임 추출
        var arr=[];
        for(var i in res){
          arr.push(res[i].login);
        }

        console.log(arr);

        $.get(res[0].organizations_url, function(org){
          console.log(org);
        });

      });
    });


    user.orgRepos("CienProject2014", function(err, repos){
      for(var i in repos){ //repos에는
        $(document).trigger("getRepo",repos[i]); //CienProject2014라는 orgRepository에 접근 getrepo를 실행시켜라
      }
    });



  });
});