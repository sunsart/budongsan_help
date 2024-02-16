//라우터 객체
let router = require('express').Router();

//nodejs 와 mysql 접속
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
conn.connect();

//선택된 테이블명 저장 전역변수, 접속초기값은 '아파트매매'
let clauseType = "apt_trade";

//
router.get('/', function(req, res){
  if (req.session.user){
    console.log("로그인 ㅇ /");
    let sql = "SELECT * FROM " + clauseType + " WHERE account_id=?";
    let params = req.session.user.id;
    conn.query(sql, params, function(err, rows, fields){
      if(err) throw err;
      res.render('index.ejs', {data:rows, user:req.session.user, type:setContentName(clauseType)});
    })
  } else {
    console.log("로그인 X /");
    let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
    let params = [clauseType];
    conn.query(sql, params, function(err, rows){
      if(err) throw err;
      res.render('index.ejs', {data:rows, user:req.session.user, type:setContentName(clauseType)});
    })
  }
})

//시멘틱 url, 네비게이션바에서 메뉴 선택시 테이블 내용 변경
router.get('/type/:id', function(req, res){
  clauseType = req.params.id; //선택된 테이블값 전역변수에 저장
  if (req.session.user){
    console.log("로그인 ㅇ /tpye/:" + clauseType);
    let sql = "SELECT * FROM " + clauseType + " WHERE account_id=?";
    let params = req.session.user.id;
    conn.query(sql, params, function(err, rows, fields){
      if(err) throw err;
      res.render('index.ejs', {data:rows, user:req.session.user, type:setContentName(clauseType)});
    })
  } else {
    console.log("로그인 X /type/:"+ clauseType);
    let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
    let params = [clauseType];
    conn.query(sql, params, function(err, rows){
      if(err) throw err;
      res.render('index.ejs', {data:rows, user:req.session.user, type:setContentName(clauseType)});
    })
  }
})

//에디트 라우터(모달에서 수정)
router.post('/edit', function(req, res){
  let sql = "UPDATE " + clauseType + " SET title=?, content=? WHERE id=?";
  let params = [req.body.title, req.body.content, req.body.num];
  conn.query(sql, params, function(err, result) {
    if(err) throw err;
    res.send("특약수정성공");
  })
});

function setContentName(eng) {
  let kor;
  if (eng == "apt_trade") kor = "아파트 매매 특약사항"
  else if (eng == "apt_jeonse") kor = "아파트 전세 특약사항"
  else if (eng == "apt_monthly") kor = "아파트 월세 특약사항"
  else if (eng == "apt_monthly") kor = "아파트 월세 특약사항"

  else if (eng == "officetel_trade") kor = "오피스텔 매매 특약사항"
  else if (eng == "officetel_jeonse") kor = "오피스텔 전세 특약사항"
  else if (eng == "officetel_monthly") kor = "오피스텔 월세 특약사항"

  else if (eng == "dasedae_trade") kor = "다세대 매매 특약사항"
  else if (eng == "dasedae_jeonse") kor = "다세대 전세 특약사항"
  else if (eng == "dasedae_monthly") kor = "다세대 월세 특약사항"

  else if (eng == "dagagu_trade") kor = "다가구 매매 특약사항"
  else if (eng == "dagagu_jeonse") kor = "다가구 전세 특약사항"
  else if (eng == "dagagu_monthly") kor = "다가구 월세 특약사항"

  else if (eng == "oneroom_jeonse") kor = "원룸 전세 특약사항"
  else if (eng == "oneroom_monthly") kor = "원룸 월세 특약사항"

  else if (eng == "shop_trade") kor = "상가 매매 특약사항"
  else if (eng == "shop_monthly") kor = "상가 월세 특약사항"

  else if (eng == "factory_trade") kor = "공장 매매 특약사항"
  else if (eng == "factory_monthly") kor = "공장 월세 특약사항"

  else if (eng == "land_trade") kor = "토지 매매 특약사항"
  else if (eng == "land_monthly") kor = "토지 월세 특약사항"
  return kor;
}

//router 변수를 외부 노출
module.exports = router;