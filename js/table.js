//checkbox 선택 >> 선택된 특약사항 컬러 설정
$(document).ready(function(){
  $('.checkbox').click(function(){
		//선택된 checkbox의 같은 row의 lebel 가져오기 
		let tr = $(this).parent().parent();
 		let td = tr.children();
		let label = td.eq(1).children();

		if (this.checked == true)
			label[0].style.color = "blue";
		else 
			label[0].style.color = "darkgray";
	})
});

//특약 체크박스 선택후 >> 작성하기 버튼 클릭시
$(document).ready(function(){
  $('#copyButton').click(function(e){

		//1. 테이블에서 선택한 특약내용을 textarea 에 보여주기
		let contentStr = "";
		for (let i=0; i<$('.checkbox').length; i++){
			if ($('.checkbox')[i].checked == true){
				contentStr += $('.content')[i].innerText;
				contentStr += "\n";
			}
		}
		document.getElementById("copyContent").innerHTML = contentStr;

		//2. Clipboard.js를 이용하여 선택한 특약내용을 clipboard에 카피하기
		var clipboard = new ClipboardJS("#copyButton");
		clipboard.on('success', function (e) {
			console.log(e);
		});
		clipboard.on('error', function (e) {
			console.log(e);
		});
	})
});

//로그인후 >> 테이블 [수정] 버튼 클릭
$(document).ready(function(){
  $('#edit_button').click(function(e){
		if (this.innerText == "수정") {
			this.innerText = "완료";
			//[선택] 버튼 활성화
			let btns = document.getElementsByClassName("clause_btn");
			for(let btn of btns)
				btn.className = "clause_btn show_btn";
			//체크박스 비활성화
			let checkboxes = document.querySelectorAll(".checkbox");
			for(let cb of checkboxes)
				cb.style.visibility = 'hidden';
			//선택버튼 활성화시 칼럼 사이즈 늘리기
			let td = document.getElementById("col_size");
			td.style.width = '15%';
		} 
		else if (this.innerText == "완료") {
			this.innerText = "수정";
			//[선택] 버튼 비활성화
			let btns = document.getElementsByClassName("clause_btn");
			for(let btn of btns)
				btn.className = "clause_btn";
			//체크박스 활성화
			let checkboxes = document.querySelectorAll(".checkbox");
			for(let cb of checkboxes)
				cb.style.visibility = 'visible';
			//선택버튼 비활성화시 칼럼 사이즈 복원
			let td = document.getElementById("col_size");
			td.style.width = '12%';
		}
	})	
});

//로그인후 >> 테이블 [수정] 버튼 >> [선택] 버튼 클릭 >> 모달뷰
function clickEdit(e) {
	num = e.dataset.id;	//선택한 특약의 id넘버 가져오기
	//list.js 에서 사용됨
	let contract_no = document.querySelector("#contract_no");
	contract_no.value = num;
	//선택된행의 데이터를 모달입력창에 설정
	let title;
	let content;
	let checkboxes = document.querySelectorAll(".checkbox");
	for (let i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].dataset.id == num) {
			title = document.querySelectorAll(".title")[i].innerText;
			content = document.querySelectorAll(".content")[i].innerText;
			break;
		} 
	}
	document.querySelector("#edit_title").value = title;
	document.querySelector("#edit_content").value = content;
	
	//모달 show
	let modal = document.getElementById("editModal");
	modal.style.display = "block";
}


