// pages/account/account.js
const app = new getApp();

Page({

    /**
     * 页面的初始数据   小程序读取数据一般是data下面
     */
    data: {
        data_key: [
            { can_edit: false, key: 'headimgurl', value: '头像', info: './image/4.png', flag: 'true' },
            { can_edit: true, key: 'nickname', value: '昵称', info: '122', flag: 'false' },
            { can_edit: true, key: 'email', value: '电子邮件', info: '123@qq.com', flag: 'true' },
            { can_edit: true, key: 'tel', value: '手机号码', info: '12345678912 ', flag: 'false' },
            { can_edit: true, key: 'name', value: '真实姓名', info: '123', flag: 'true' },
            { can_edit: true, key: 'sex', value: '性别', flag: 'true' },
            { can_edit: true, key: 'birthday', value: '生日', info:'1997-1-1', flag: 'true' },
            { can_edit: false, key: 'address', value: '我的地址', flag: 'true', link:'/pages/address/address' },
            { can_edit: false, key: 'password', value: '修改密码', flag: 'true' },
            { can_edit: false, key: '', value: '授权管理', flag: 'true' },
            { can_edit: false, key: '', value: '退出账户', flag: 'true' }
        ],
        data_key_index:'',
        array: ['女', '男',],
        showModalStatus: false,
        showPopStatus: false,
        key: "",
        editCon: "",
    },
    /**
     * 修改个人信息API
     */
    editInfo:function(key,info){
        const that = this;
        wx.request({
            url:app.pserver+'editInfo',
            data:{key:key,info:info},
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success:function(res){
                console.log(res);
                if(res){
                    that.editInfoByKey(info);
                    that.showModal('修改成功');
                }else{
                    that.showModal('修改失败');
                }
            }
        })
    },
    /**
     * 初始化赋值
     */
    dataInit: function(data){
        const this_data = this.data.data_key;
        this_data.map((item,index) => {
            if(data[item.key]){
                this_data[index]['info'] = data[item.key];
            }
        })
        console.log(this_data);
        this.setData({
            data_key:this_data
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;
        wx.request({
            url:app.pserver + 'personInfo',
            header: {
              'content-type': 'application/json'
            },
            success:function(res){
                that.dataInit(res.data.data);
            }
        })
    },
    /**
     * 提示信息
     * @param  {[type]} con 提示内容
     */
    showModal: function(con) {
        const that = this;
        wx.showModal({
            title: '提示',
            content: con,
            showCancel: false,
            success: function(res) {
                if (res.confirm) {
                    that.setData({
                        showModalStatus: false,
                    })
                }
            }
        })
    },
    /**
     * 显示信息
     */
    showToast: function() {
        wx.showToast({
            title: '修改成功',
            icon: 'succes',
            duration: 1000,
            mask: true
        })
        this.setData({
            showModalStatus: false,
        })
    },
    /**
     * 通过key来修改信息
     * 二次修改之后记录了点击的data_key_index属性所以不需要传key
     */
    editInfoByKey: function(info){
        const data = this.data.data_key;
        data[this.data.data_key_index]['info'] = info;
        this.setData({
            data_key:data
        })
    },
    /**
     * 修改信息
     */
    onSure_click: function(event) {
        const that = this;
        var rule = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        var key = this.data.key;
        var info = event.detail.value.info;
        if (key == 'name') {
            if (info == '') {
                this.showModal('姓名不能为空');
            } else {
                this.editInfo(key,info);
            }
        }
        if (key == 'email') {
            if (info == '') {
                this.showModal('邮箱不能为空');
            } else {
                if (rule.test(info)) {
                    this.editInfo(key,info);
                } else {
                    this.showModal('电子邮箱格式不正确');
                }
            }
        }
        if(key == 'tel') {
            if (info == '') {
                this.showModal('手机号码不能为空');
            } else {
                this.editInfo(key,info);
            }
        }
    },
    /**
     * 弹框事件（点击邮件、真实姓名进行信息修改）
     */
    onPostTap: function(event) {
        const key = event.currentTarget.dataset.key;
        const index = event.currentTarget.dataset.index;
        const data = this.data.data_key;
        //自定义编辑
        if (data[index]['can_edit']) {
            if(key == 'sex' || key == 'birthday'){
                this.setData({
                    key: key,
                    data_key_index:index
                })
            }else{
                this.setData({
                    showModalStatus: true,
                    key: key,
                    editCon:data[index].info,
                    data_key_index:index
                })
            }
        }
        //跳转链接
        if(data[index]['link']){
            try {
                wx.setStorageSync('is_shopping', false)
                wx.navigateTo({
                    url:data[index]['link']
                })
            } catch (e) {  
                console.log(e);
            }
        }
    },
    onClose: function() {
        this.setData({
            showModalStatus: false,
        })
    },

    /**
     * 性别选择
     */
    bindPickerChange: function(e) {
        this.editInfoByKey(e.detail.value);
    },
    /**
     * 日期选择
     */
    bindDateChange: function(e) {
        this.editInfoByKey(e.detail.value);
    },
    onReachBottom: function () {
    
    },
})