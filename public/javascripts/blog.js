function upload() {
	var myForm = new FormData();
	var file = document.getElementById("file");
	myForm.append("file", file.files[0]);
	myForm.append("test", "aaa");
	console.log(file.files[0])
	// var xmlHttpReq = new XMLHttpRequest();
	// xmlHttpReq.open('POST','/uppic',true);
	// xmlHttpReq.setRequestHeader("If-Modified-Since", "0");
	// xmlHttpReq.send(form);
	$.ajax({
		url: '/uppic',
		type: 'POST',
		data: myForm,
		cache: false,
    contentType: false,
    processData: false,
    success: function(data){
    	$("#result").html("上传成功！");
    	console.log(data)
    },
    error: function(){
      $("#result").html("与服务器通信发生错误");
    }
	})	
}

function postPage() {
	if(!document.getElementById('upload')){
		return false;
	}else{
		var file = document.getElementById('file');
		var img = document.getElementById('img');
		var uploada = document.getElementById('upload');

		uploada.addEventListener("click",function () {
			upload();
		},false);

		file.addEventListener('change', function () {
			var file = this.files[0];
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (e) {
				img.src = this.result;
			}
		},false);
	}
}

window.onload = function () {
	postPage();
}