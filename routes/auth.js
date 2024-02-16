//라우터 객체
let router = require('express').Router();

//nodejs 와 mysql 접속
const mysql = require('mysql');
const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
conn.connect();

//비밀번호 암호화
const sha = require('sha256');

//-----------------------------------------//

//회원가입 라우터
router.post('/signup', async function(req, res, next) {
    let id = req.body.id;
    let pw = sha(req.body.pw);
    let email = req.body.email;
    let sql = "SELECT name FROM account WHERE name=?";
    conn.query(sql, [id], function(err, rows) {
      if (rows.length == 0) { //아이디 중복 없음
        let sql = "INSERT INTO account (name, pw, email) VALUES (?, ?, ?)";
        let params = [id, pw, email];
        conn.query(sql, params, function(err, result) {
          if(err) {
            throw err;
          } else {
            let bags = [];
            bags[0] = "가입성공";
            bags[1] = result.insertId;
            res.send(bags);
          }
        })
      } 
      else {
        res.send("아이디중복");
      }
    })
  });

//테이블 복사 라우터
router.post('/copyTable', async function(req, res, next) {
  let table = req.body.type;
  let num = req.body.memberNum;
  let sql = "INSERT INTO " + table + " (title, content, account_id) SELECT title, content, " + num + " FROM basics WHERE type=?";
  conn.query(sql, [table], function(err, rows) {
    if(err) throw err;
    res.send("테이블복사성공");
  })
});

//-----로그인 라우터
router.post('/login', function(req, res){
  let username = req.body.id;
  let userpw = sha(req.body.pw);
  const sql = "SELECT * FROM account WHERE name = ? AND pw = ?";
  conn.query(sql, [username, userpw], function(err, result, fields) {
    if(err) throw err;
    if(result.length > 0) {
      req.session.user = req.body;
      req.session.user.id = result[0].id;     //회원 고유 id 번호
      req.session.user.name = result[0].name; //회원 아이디
      req.session.save(function(){
        res.send("로그인성공"); 
      })
    } else {
      res.send("로그인실패");    
    }
  })
});

//-----로그아웃 라우터
router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  })
})

//아이디 찾기 라우터
router.post('/findID', function(req, res){
  let email = req.body.email;
  const sql = "SELECT * FROM account WHERE email = ?";
  conn.query(sql, [email], function(err, result, fields) {
    if(err) throw err;
    if(result.length > 0) {
      res.send(result[0].name);
    } else {
      res.send("아이디찾기실패");
    }
  })
});

//비빌번호 찾기 라우터
router.post('/findpw', function(req, res){
  let name = req.body.name;
  let email = req.body.email;
  const sql = "SELECT * FROM account WHERE name = ? AND email = ?";
  conn.query(sql, [name, email], function(err, result, fields) {
    if(err) throw err;
    if(result.length > 0) {
      //메일로 코드번호 발송
      let codeNum = makeCodenum();
      let address = email;
      const mailOption = mailOpt(address, codeNum);
      sendMail(mailOption)
      //결과값 전송
      let res_data = {};
      res_data['codeNum'] = codeNum;
      res_data['address'] = address;
      res_data['memberNum'] = result[0].id;  //회원 고유넘버
      res.send(res_data)
    } else {
      res.send("비밀번호찾기실패");
    }
  })
});

//비밀번호 재설정 라우터
router.post('/changePw', function(req, res){
  let toPassword = sha(req.body.pw);
  let toMember = req.body.memberId;
  let sql = "UPDATE account SET pw=? WHERE id=?";
  let params = [toPassword, toMember];
  conn.query(sql, params, function(err, result) {
    if(err) throw err;
    res.send("비밀번호변경성공"); 
    })
});

//비밀번호 확인용 여섯자리 코드번호 생성
function makeCodenum() {
  let number = "";
  let random = 0;
  for(let i=0; i<6; i++) {
    random = Math.trunc(Math.random() * (9 - 0) + 0);
    number += random;
  }
  return number;
}

//메일발송 서비스 환경설정
const nodeMailer = require('nodemailer');
const mailPoster = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sunsartapp1@gmail.com',
    pass: 'dytf pbhb afpi xdsb'
  }
});

// 메일수신 유저설정
const mailOpt = (address, num) => {
  const mailOptions = {
    from: 'sunsartapp1@gmail.com',
    to: address,
    subject: '<부동산 도우미> 비밀번호 변경을 위한 6자리 코드번호 입니다',
    text: "인증칸에 아래의 숫자를 입력해주세요. \n\n" + num
  };
  return mailOptions;
}

// mailPoster, mailOpt 이용하여 메일전송
const sendMail = (mailOption) => {
  mailPoster.sendMail(mailOption, function(error, info){
    if (error) 
      console.log('메일발송 에러 ' + error);
    else 
      console.log('메일발송 완료 ' + info.response);
  });
}

//router 변수를 외부 노출
module.exports = router;