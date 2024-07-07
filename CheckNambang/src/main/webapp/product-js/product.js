/**
 * product.js
 */
let search = {page : 1, searchCondition: -1, keyword:""};
let pageDTO = {};


//데이터 목록 출력하기

function proList(search = {}){
fetch(`hyunControl2.do?page=${search.page}&kw=${search.keyword || ''}`)
	.then(result => result.json())
	.then(result => {
		document.querySelector("#product_list").innerHTML = "";
		pageDTO = result.dto;
		result.list.forEach(item => {
			cloneDiv(item);
		})		
		console.log(pageDTO);
		paging(pageDTO);
	});
}
proList(search);


//검색창 이벤트
//엔터 누를시
document.querySelector("input[type='text']").addEventListener("keyup" ,(e) => {
	if(e.keyCode == 13){
		search.keyword = e.target.value;
		proList(search);
	}
})

// 버튼 클릭시
document.querySelector(".site-btn").addEventListener("click", (e)=>{
		search.keyword = document.querySelector("input[type='text']").value;
		proList(search);
})


// 페이지 만들기
function paging(pageDTO = {}){
	let pageBody = document.querySelector(".product__pagination > div");
	pageBody.innerHTML = "";
	if(pageDTO.prev){
		let cloneLarrow = document.querySelector(".product__pagination > a:nth-of-type(1)").cloneNode(true);
		cloneLarrow.style.display = "";
		cloneLarrow.addEventListener("click", (e) =>{
			search.page = pageDTO.startPage - 1;
			e.preventDefault();
			proList(search);
		})
		pageBody.appendChild(cloneLarrow);
	}
	for(let p = pageDTO.startPage; p <= pageDTO.endPage; p++){ //페이지 순번
		let clonePage = document.querySelector(".product__pagination > a:nth-of-type(2)").cloneNode(true);
		clonePage.innerHTML = p;
		clonePage.style.display = "";
		if(p == pageDTO.page) clonePage.setAttribute("class", "active");
		clonePage.addEventListener("click" , (e) =>{
			e.preventDefault();
			search.page = p;
			proList(search);
		});
		pageBody.appendChild(clonePage);
	}
	if(pageDTO.next){ //페이지 우측화살표
		let cloneRarrow = document.querySelector(".product__pagination > a:nth-of-type(3)").cloneNode(true);
		cloneRarrow.style.display = "";
		cloneRarrow.addEventListener("click", (e) => {
			search.page = pageDTO.endPage + 1;
			e.preventDefault();
			proList(search);
		})
		pageBody.appendChild(cloneRarrow);
	}
}//end of paing

function productDetail(e) {
	console.log(e.target.id);
	location.href = "mocontrol.do?proCode=" + e.target.id;
}
let totalC = document.getElementById('totalCnt');
function cloneDiv(product = {}) {

	let cloneDiv = document.querySelector("#product_id").cloneNode(true);
	cloneDiv.style.display = "";
	cloneDiv.querySelector(".product_img").style.backgroundImage = `url(moImg/${product.productImage})` + " ";
	cloneDiv.querySelector(".product_img").setAttribute("id", product.productCode);
	cloneDiv.querySelector(".product_img").addEventListener("click", productDetail);
	cloneDiv.querySelector("#product_title").innerHTML = `${product.company}` + `${product.productName}`;
	cloneDiv.querySelector("#product_price").innerHTML = `${product.offPrice}` + "원";
	cloneDiv.querySelector("p").innerHTML = `${product.price}` + "원";
	//할인값 없을때 일반 가격
	let defaultPrice = cloneDiv.querySelector("#product_price")
	if (`${product.offPrice}` == 0 || `${product.offPrice}` == null || `${product.offPrice}` == `${product.price}`) {
		cloneDiv.querySelector("p").innerHTML = "";
		cloneDiv.querySelector("#product_price").style.color = "black";
		defaultPrice.innerHTML = `${product.price}` + "원";
	}
	cloneDiv.querySelector(".product_text>h6").innerHTML = "💬 " + `${product.viewCnt}`;

	//장바구니 버튼 모달창
	cloneDiv.querySelector(".cart_btn").addEventListener("click", (e) => {
		if (e.target.classList.contains('cart_btn')) {
			document.querySelector('.modal').style.display = 'flex';
		}
		document.getElementById('modal_code').textContent = `${product.productCode}`
		document.getElementById('modal_img').style.backgroundImage = `url(moImg/${product.productImage})`;
		document.getElementById('modal_company').innerHTML = `${product.company}` + `${product.productName}`;

		// 할인된 값이 없을 때 기본 값 설정

		let modalPrice = document.getElementById('modal_price'); // 물건 당 가격
		let endPrice = document.querySelector('#priceSum'); // 총합계

		if (`${product.offPrice}` == 0) {
			modalPrice.innerHTML = "가격 : " + `${product.price}` + "원";
			endPrice.innerHTML = "총 합계 : " + `${product.price}` + "원";
		} else {
			modalPrice.innerHTML = "가격 : " + `${product.offPrice}` + "원";
			endPrice.innerHTML = "총 합계 : " + `${product.offPrice}` + "원";
		}


		//클릭 개수에 따른 가격 총합 
		document.querySelector('.pro-qty').addEventListener('click', () => {
			let total = totalC.value; // 갯수 체크한 값
			if (`${product.offPrice}` == 0) {
				endPrice.innerHTML = "총 합계 : " + total * `${product.price}` + "원"
			} else if (`${product.offPrice}` != 0) {
				endPrice.innerHTML = "총 합계 : " + total * `${product.offPrice}` + "원"
			}
		})
		document.getElementById('totalCnt').value = 1;
	});
	document.querySelector("#product_list").appendChild(cloneDiv); // 복사본 붙이기


}

//장바구니 버튼 클릭시 장바구니 담기
document.querySelector('.putCart').addEventListener('click', () => {
	let proCode = document.getElementById('modal_code').textContent;
	let totalCnt = totalC.value;
	console.log(totalCnt);
	console.log(proCode);
	const putAjax = new XMLHttpRequest();
	putAjax.open('get', 'hyunControl3.do?proCode=' + proCode //
		+ '&userId=' + userId + '&cartVolume=' + totalCnt);
	putAjax.send();
	putAjax.onload = function() {
		let result = JSON.parse(putAjax.responseText);
		if (result.retCode == 'OK') {
			alert('장바구니담기 완료');
		} else {
			alert('장바구니담기 실패');
		}
	}
});









