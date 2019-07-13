!function($){
  /*
  *设置默认参数
  */
  var defaut = {
      type:'checkbox',//checkbox：多选 radio:单选
      initListData:[],//初始化下拉选数据
      search:true,//true支持搜索功能；false:不能搜索
      searchList:[],//搜索到的数据
      searchflag:false, // 是否是搜索数据
      returnParametersId:'id',//获取到id key
      returnParametersName:'name'//获取到name key
  }
  /**
   * 初始化input区域
   * @param {*} option
   */
  function initInputHtml(obj){
      if($('#'+obj[0].id+' .datalist')){
          $('#'+obj[0].id+' .datalist').remove();
      }
      var html = `<div class="datalist"><div id="search-input"><input type="text" placeholder="请输入要搜索的内容" id="keywords" autocomplete="off" class="input-text">`
          +`<input type="hidden" name="`+obj.option.returnParametersId+`" id="`+obj.option.returnParametersId+`">`
          +`<input type="hidden" name="`+obj.option.returnParametersName+`" id="`+obj.option.returnParametersName+`">`
          +`</div><div class="sel"><ul name="sel-list" id="sel-list"></ul></div></div>`;
      //obj调用的对象
      obj.append(html)
  }

  /**
   *商品下拉选内容设置
   * */
  function setSelectOptin(obj){
      var objId = obj[0].id || '';
      // //移除下拉选内容
      $('#'+objId+' #sel-list li').remove()
      var option = obj['option'];
      var dataList = !option.searchflag ? option.initListData : option.searchList;
      if(typeof dataList == "string"){
          dataList=JSON.parse(dataList)
      }
      var html = ``;
      if(dataList.length == 0){
          html = "<li style='padding-top:5px;text-align: center;'>未查询到相关商品</li>";
          $('#'+objId+' #sel-list').append(html);
          return
      }
      dataList.forEach(element => {
          //参数结构
          var key = Object.keys(element)
          //单选
          if(option.type == 'radio'){
              html += `<li data-id="`+objId+`"><label for="`+element[key[0]]+`" class="label-check"><input type="`+option.type+`" id="`
                  +element[key[0]]+`" value="`+element[key[1]]+`" name="choose" style="display:none"/><span>`+element[key[1]]+`</span></label></li>`

          }
          //多选
          if(option.type == 'checkbox'){
              html += `<li data-id="`+objId+`"><label for="`+element[key[0]]+`" class="label-check"><input type="`+option.type+`" id="`
                  +element[key[0]]+`" value="`+element[key[1]]+`" name="choose"/><span>`+element[key[1]]+`</span></label></li>`
          }
      })
      //追加下拉选
      $('#'+objId+' #sel-list').append(html)

  }

  /**
   * 商品搜索事件
   * */
  function productSearch(obj){
      var option = obj.option;
      var initListData = option.initListData;
      $('#'+obj[0].id+" #search-input").keyup((e)=>{
          var searchList=[];
          var keyword = $('#'+obj[0].id+" #keywords").val();
          if(keyword){
              //页面初始化数据为json字符串数组
              if(typeof initListData == "string"){
                  initListData=JSON.parse(initListData)
              }
              initListData.forEach(item=>{
                  var obj_key = Object.keys(item)
                  var searchName = obj_key[obj_key.length-1]
                  //内容包含，则展示
                  if((item[searchName]).indexOf(keyword) != -1){
                      searchList.push(item)
                  }
              })
              option.searchList = searchList;
              option.searchflag = true;
          }
          //未找到，下拉选数据为原始数据
          if(keyword == '' || keyword == undefined || keyword == null){
              option.searchflag = false;
          }
          setSelectOptin(obj)
          optionClickEvent(obj)
      });
  }

  /**
   * 商品选中事件
   * */
  function optionClickEvent(obj){
      var objId = obj[0].id || '';
      // 用调用对象的id,绑定点击事件
      $('#'+objId+' #sel-list li').click((e)=>{
          //获取自定义的id（调用对象的id）
          var liId = $('#'+objId+' #sel-list li').data('id')
          var selected = $('#'+liId+' #sel-list li input:checked');
          selected.parent().parent().addClass('active')
          $('#'+liId+' #sel-list li input:not(:checked)').parent().parent().removeClass('active');
          if(selected.length == 0){
              $('#'+liId+' #'+obj.option.returnParametersName).val('');
              $('#'+liId+' #'+obj.option.returnParametersId).val('');
              $('#'+liId+' #keywords').val('');
          }
          if(selected && selected.length!=0){
              var keys='';
              var productId = '';
              for(var i=0;i<selected.length;i++){
                  if(keys.length==0){
                      keys=selected[i].value;
                      productId=selected[i].id;
                  }else{
                      keys+=','+selected[i].value;
                      productId+=','+selected[i].id;
                  }
              }
              $('#'+liId+' #keywords').val(keys)
              $('#'+liId+' #'+obj.option.returnParametersName).val(keys);
              $('#'+liId+' #'+obj.option.returnParametersId).val(productId);
          }
          //将数据绑定到input

      })
  }
  /**
   * 鼠标事件
   * */
  function mouseEvent(obj){
      var objId = obj[0].id;
      //鼠标进入下拉选显示
      $('#'+objId+' .datalist').mouseenter(()=>{
          $('#'+objId+' .sel').show()
      })
      //鼠标离开下拉选隐藏
      $('#'+objId+' .datalist').mouseleave(()=>{
          $('#'+objId+' .sel').hide()
      })
  }

  /**d
   * 商品名称下拉选初始化
   * */
  function dropDown(option){
      const _this = this
      //1.默认参数与传入参数合并，以option为先
      this.option = $.extend(true,{},defaut,option)
      //2.input初始化
      initInputHtml(_this)
      //3.商品下拉选初始化
      setSelectOptin(_this);
      //4.鼠标事件（下拉选显示/取消）
      mouseEvent(_this);
      //5.选择点击事件
      optionClickEvent(_this);
      //6.搜索事件
      if(_this.option.search){
          productSearch(_this);
      }
  };
  $.fn.dropDown = dropDown;
}(jQuery)