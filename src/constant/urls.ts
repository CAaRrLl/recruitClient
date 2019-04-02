export const urls = {
  api: {
    reviewList: '/api/reviewlist',                        // 百人计划审核列表
    alcList: '/api/alclist',                              // 应聘者总览
    pcsData: '/api/pcs/pcsdata',                          // 获取流程数据
    pcsName: '/api/pcsarrayname',
    bindTeacherList: '/api/mgr/getBindTeacher',           // 获取教师列表
    getAdminList: '/api/mgr/getMgrs',                     // 获取管理员列表
    getAdminInfo: '/api/mgr/initMgrData',                 // 获取部门，岗位列表
    delAdmin: '/api/mgr/delBindTc',                       // 删除管理员
    modifyAdmin: '/api/mgr/modifyMgr',                    // 更新管理员内容
    updataContact: '/api/updateContact',                  // 刷新通信录
    getcomword:'/api/msg/comword',                        // 管理员获取常用语
    getFile:'/api/file' ,                                 // 下载文件
    getCurId: '/api/curpcsid',                            // 获取当前流程id
    getSelConds: '/api/getselconds',                      // 获取筛选条件表
    sendSimpleMsgUrl:'/api/msg/postmsg',                  // 发送普通消息
    submitPcsDataUrl:'/api/formdata',                     // 提交流程数据(发送预约数据，应聘结束操作)
    getLastPcsData:'/api/pcs/lastpcsdata',                // 获取上一流程数据
    sendSysMsg:'/api/msg/alcsysmsg',                      // 确认发送应聘者系统消息
    postSelData:'/api/pcs/selectdata',                    // 提交筛选数据
    reqInfoUrl:'/api/alc/homeinfo',                       // 获取应聘者主页数据
    reqMsgArrayUrl: '/api/msg/msgarray',                  // 请求消息数组
    getMsgDetailUrl:'/api/msg/detail',                    // 应聘者获取消息详情
    getPcsIdUrl: '/api/curpcsid',
    getBusLetr:'/api/alc/busletr',                        // 获取简历中的商调函信息
    getMgrInfo: '/api/mgr/mgrinf',                        // 获取管理员自身信息
    getHpstInfo: '/api/gethpstinfo',                      // 校领导审阅获取百人计划数据
    getNlInfo: '/api/getnlinfo',                          // 校领导审核获取新进讲师数据
    auth: '/api/logintest',                               // mock login
    updatehpstInfo: '/api/updatehpstInfo',                // 百人计划
    updatenlInfo: '/api/updatenlInfo',                    // 新进讲师
    getAlcInfo: '/api/alc',                               // 获取应聘者信息
    getFormTemplate: '/api/form',                         // 获取表单模板
    checkFile: '/api/file/exist',                         // 判断文件是否存
    getBrjhBaseInfo: '/api/getBrjhBaseInfo',              // 获取百人计划基本信息
    getXjjsBaseInfo: '/api/getNLBaseInfo',                // 获取新进讲师基本信息
    hpstFile: '/api/hpstfile',                            // 下载百人计划表格
    nlstFile: '/api/nlstfile',                            // 下载新进讲师表格
    modifyBrjhBaseInfo: '/api/modifyBrjhBaseInfo',        // 修改百人计划基本信息
    modifyXjjsBaseInfo: '/api/modifyNLBaseInfo',          // 修改新进讲师基本信息
    editJob:'/api/editjob',                               // 切换应聘岗位
    confirmBrjhBaseInfo: '/api/confirmBrjhBaseInfo',      // 点击自查表开关，确定生成自查表xsls
    confirmXjjsBaseInfo: '/api/confirmNLBaseInfo',        // 点击自查表开关，确定生成自查表xsls
    submitSelfCheckForm: '/api/sck',                      // 确定提交自查表
    submitFormData: '/api/formdata',                      // 确定第八流程
    download: '/api/file',                                // 通过sha256下载数据，GET id = sha256
    downloadMult: '/api/file/url',                        // 同时下载多个文件打包
    alcData: '/api/sumdata',                              // 应聘者统计数据
    downloadResume: '/api/resumedownloadfile',            // 下载简历
    saveHpstInfo: '/api/updatehpstcheckInfo',             // 保存百人计划
    saveNlInfo: '/api/updatenlcheckInfo'                  // 保存新进讲师
  },
  urls: {
    // 公共路由
    noFound: '/404',
    err: '/error',
    // 管理员部分
    checklist: '/mgr/checklist',
    leaderCheckBrjh: '/mgr/leaderCheckBrjh',        // 校领导审阅 百人计划
    leaderCheckXjjs: '/mgr/leaderCheckXjjs',        // 校领导审阅 新进讲师
    adminAdd: '/mgr/add',                           // 添加管理员
    adminModify: '/mgr/modify',                     // 管理员更新
    alcView: '/mgr/alcview',                        // 预览全部应聘者
    alcDetails: '/mgr/alcDetails',                // 百人计划人才引进情况表
    selfCheck: '/mgr/checkSelf',                    // 自查表
    alcDisplay: '/mgr/alcDataDisplay',              // 应聘者数据图表展示
    // 应聘者部分
    alcHome: '/alc/home',                           // 应聘者主页
    alcResume: '/alc/resume-form',
    alcMsg: '/alc/msg-list',                        // 应聘者消息列表
    MsgDetail: '/alc/msg-detail',                   // 消息详情
    BaseSelect: '/alc/base-select',                 // 基本筛选
    ReSelect: '/alc/again-select',                  // 再次筛选
    SelectFailed: '/alc/fail-select',               // 筛选失败
    Resume: '/alc/resume-form',                     // 简历预览
    xzjlh: '/alc/before-xzjlh',                     // 学者交流会
  },
};
export const roles = {
  mgr: {
    name: '管理员',
    home: '/mgr',
    nav: [ // 管理员导航，其中userLevel表示存在该导航的用户列表，如果userLevel设置为null，则全部的用户可见
      {name: '主页', icon: 'home',userLevel: null, url: urls.urls.alcDisplay , sub: []},
      {name: '审核', icon: 'apps', userLevel: null,url: '' , sub: [
        {name: '应聘者总览', userLevel: null,url: urls.urls.alcView},
        {name: '应聘者审核', userLevel: null,url: urls.urls.checklist},
      ]},
      {name: '管理员配置', icon: 'content_copy', userLevel: ['1', '5'], url: '' , sub: [
        {name: '添加管理员',userLevel: null, url: urls.urls.adminAdd},
        {name: '管理员列表', userLevel: null, url: urls.urls.adminModify},
      ]},
      {name: '校领导审阅', icon: 'bubble_chart', userLevel: ['1', '2','8'], url: '' , sub: [
        {name: '百人计划', userLevel: null,url: urls.urls.leaderCheckBrjh},
        {name: '新进讲师', userLevel: null,url: urls.urls.leaderCheckXjjs},
      ]}
      ]},
  alc: {
    name: 'admin',
    home: '/mgr',
    urls: [
      {title: '主页' , url: urls.urls.alcHome},
      {title: '消息列表' , url: urls.urls.alcMsg},
      {title: '消息详情' , url: urls.urls.MsgDetail},
      {title: '基本筛选' , url: urls.urls.BaseSelect},
      {title: '再次筛选' , url: urls.urls.ReSelect},
      {title: '筛选失败' , url: urls.urls.SelectFailed},
      {title: '简历预览' , url: urls.urls.Resume},
      {title: '学者交流会' , url: urls.urls.xzjlh}
    ]
  }
};
