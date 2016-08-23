function uploadFile(){
  var file = document.getElementById("file")
  var formData = new FormData();
  var imgsrc = null;
  formData.append('file',file.files[0]);
  $.ajax({
    url: '/upload',
    type: 'POST',
    data: formData,
    async: false,
    cache: false,
    contentType: false,
    processData: false,
    success: function (data){
      if(200 === data.code) {
        $('#result').html("上传成功！");
        $('#img').attr('src','http://' + data.data.headersHost + '/images/' + data.data.name);
        $('#addimg').show();
        imgsrc = '/images/' + data.data.name
      } else {
        $('#result').html("上传失败！");
      }
    },
    error: function(){
      $("#result").html("与服务器通信发生错误");
    }
  });
  return imgsrc;
};


function iaddimg() {
	var mytextarea = document.getElementById('mytextarea')
	var src = '![Alt text](' + uploadFile() + ')'	
	mytextarea.value += src;
}


window.onload = function () {

	if(!document.getElementById('upload')){
		return false
	}else{
		var uploada = document.getElementById('upload');
		uploada.addEventListener("click",function () {
			uploadFile();
		},false);
	}

	if(!document.getElementById('addimg')){
		return false;
	}else{
		var addimg = document.getElementById('addimg');
		addimg.addEventListener('click',function () {
			iaddimg();
		} ,false)
	}

}