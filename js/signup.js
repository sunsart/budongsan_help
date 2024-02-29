//회원가입창 열기
function showSignup() {
  document.querySelector(".background_signup").className = "background_signup show_signup";
  //창 오픈시 이전 기입내용 삭제
  document.getElementById('mem_id').value = "";
  document.getElementById('mem_pw1').value = "";
  document.getElementById('mem_pw2').value = "";
  document.getElementById('mem_email').value = "";
  document.getElementById('terms_check').checked = false;
}

//회원가입창 닫기
function closeSignup() { 
  document.querySelector(".background_signup").className = "background_signup";
}

//회원가입버튼 클릭시 >> 휴효성검사 >> mysql저장
function checkSignup(){
  let id = $('#mem_id').val();
  let pw1 = $('#mem_pw1').val();
  let pw2 = $('#mem_pw2').val();
  let email = $('#mem_email').val();
  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

  if (id.length < 4 || id.length >= 20) 
    alert("아이디는 4글자 이상 입력해주세요");
  else if (pw1.length < 4)
    alert("비밀번호는 4글자 이상 입력해주세요");
  else if (pw1 != pw2)
    alert("비밀번호가 서로 일치하지 않습니다");
  else if (email == "")
    alert("이메일주소를 입력해주세요");
  else if (pattern.test(email) === false) 
    alert("이메일주소 형식이 올바르지 않습니다");
  else if ($('#terms_check').is(":checked") == false) 
    alert("약관에 동의해 주세요");
  else {
    $.ajax({
      url : "/signup",
      type : "POST",
      data : {id:id, pw:pw1, email:email},
      success : function(data) {
        if(data == "아이디중복") 
          alert("이미 존재하는 아이디 입니다");
        else if(data[0] == "가입성공") {
          alert("정상적으로 회원가입 되었습니다.");
          copyBasicsTable(data[1]);
          closeSignup();
        }
      }
    })
  }
}

function copyBasicsTable(num) {
  let types = ["apt_trade", "apt_jeonse", "apt_monthly", "officetel_trade", "officetel_jeonse", "officetel_monthly", "dasedae_trade", "dasedae_jeonse", "dasedae_monthly", "dagagu_trade", "dagagu_jeonse", "dagagu_monthly", "oneroom_jeonse", "oneroom_monthly", "shop_trade", "shop_monthly", "factory_trade", "factory_monthly", "land_trade", "land_monthly", "etc"];
  for(let i=0; i<types.length; i++) {
    $.ajax({
      url : "/copyTable",
      type : "POST",
      data : {memberNum:num, type:types[i]},
      success : function(data) {
        //if(data == "테이블복사성공") 
        //console.log(types[i] + " 테이블 coyp완료!");
      }
    })
  }
}

//로컬에서 약관(policy.txt) 텍스트파일 읽어오기
$(document).ready(function() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('terms').value = this.responseText;
        }
    };
    xmlhttp.open("GET", "/policy.txt", true);
    xmlhttp.send();
});

function unregister() {
  let answer = confirm("탈퇴 후 회원정보 및 서비스 이용기록은 모두 삭제됩니다. \n\n정말로 탈퇴하시겠습니까?")
  if(answer == true) {
    location.href='/unregister'
  }
}