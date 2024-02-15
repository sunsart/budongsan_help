//로그인창 열기
function showLogin() {
  document.querySelector(".background_login").className = "background_login show_login";
  //창 오픈시 이전 기입내용 삭제
  document.getElementById('log_id').value = "";
  document.getElementById('log_pw').value = "";
}

//로그인창 닫기
function closeLogin() { 
  document.querySelector(".background_login").className = "background_login";
}

//[로그인] 버튼 클릭시
function Login() {
  let id = document.getElementById('log_id').value;
  let pw = document.getElementById('log_pw').value;
  if (id == "") 
    alert("아이디를 입력해주세요")
  else if (pw == "") 
    alert("비밀번호를 입력해주세요")
  else {
    $.ajax({
      url : "/login",
      type : "POST",
      data : {id:id, pw:pw},
      success : function(data) {
        if(data == "로그인성공") {
          alert("로그인 되었습니다")
          window.location.href = '/';
        }
        else if(data == "로그인실패") {
          alert("아이디 또는 비밀번호를 잘못 입력했습니다");
        }
      }
    })
  }
}
