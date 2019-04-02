export const errorCodes = {
  Success: 200,               // 请求已成功
  AuthenticationFail: 403,    // 服务器已经理解请求，但是拒绝执行它
  noFound: 404,                // 请求失败
  custom: {                    // 自定义错误码
    IdentityVerificationTimeout: 1024,



    msgSuccess: 1000, // 消息成功码
    msgFail: 1001, // 消息失败码
    msgSysErr: 1002, // 系统出错码
    msgParaErr: 1003, // 参数错误码
    msgDbErr: 1004, // 数据库错误码
    msgAlcErr: 1005, // 身份错误码

    pcsSuccess: 2000,
    pcsNoAuth: 2001, // 没有权限
    pcsSysErr: 2003, // 系统出错
    pcsParaErr: 2004, // 请求参数错误
    pcsNoExist: 2005, // 流程不存在
    pcsIdInvaild: 2006, // 流程号不匹配
    pcsOperCodeInvaild: 2007, // 操作码不合法

    fileSuccess: 3000,
    fileNoExist: 3001,
    fileExist: 3002,
    fileNoAuth: 3003, // 没有权限
    fileSysErr: 3004, // 系统出错
    fileParaErr: 3005, // 请求参数错误
    fileSuffixErr: 3006, // 文件后缀不支持

    alcSuccess: 4000,
    alcNoAuth: 4001,         // 没有权限
    alcSysErr: 4003,           // 系统出错
    alcParaErr: 4004,          // 请求参数错误
    alcExist: 4005,          // 应聘者存在
    alcNoExist: 4006,         // 应聘者不存在
    alcListEmpty: 4008,       // 总览列表为空

    formSuccess: 5000,
    formNoAuth: 5003, // 没有权限
    formSysErr: 5004, // 系统出错
    formParaErr: 5005, // 请求参数错误

    sysNoAuth: 6001,
    sysContactSuccess: 6000,
    sysContactMethodErr: 6002,

    sumSuccess: 7000,
    sumErr: 7001,
    sumServiceErr: 7002,

    tableSuccess: 8000, // 处理成功
    tableCheckFail: 8001, // Excel表格被改动
    tableNoData: 8002, // 没有数据
    tableNoMatch: 8003, // Excel行数与openid 数不对应
    tableSetInfoFail: 8004, // 数据库插入失败
    tableGetInfFail: 8005, // 得到数据库的数据失败
    tableMarshalFail: 8006, // json化失败
    tableUnmarshalFail: 8007, // 解析json失败
    tableGetInfoSuccess: 8008, // 得到数据成功
    tableUpdateFail: 8009, // 数据库更新失败

    // 获取管理员信息
    priSuccess: 9000,       // 获取成功
    priNoAuth: 9001,        // 没有权限
    priSysErr: 9003,        // 系统出错
    priParaErr: 9004,       // 请求参数错误
    priQueryDbErr: 9005,    // 查询数据库出错(极有可能是查不到数据)


    // 请求应聘者相关信息返回的状态码
    ALC_SUCCESS: 4000,
    ALC_NO_AUTH: 4001,		        // 没有权限
    ALC_SYS_ERR: 4003,		        // 系统出错
    ALC_PARA_ERR: 4004,			      // 请求参数错误
    ALC_EXIST: 4005,				      // 应聘者存在
    ALC_NOT_EXIST: 4006,			    // 应聘者不存在
    ALC_REVIEWLIST_EMPTY: 4007, 	// 请求的审核列表为空

    // 请求文件返回状态码
    FILE_SUCCESS: 3000,
    FILE_NOT_EXIST: 3001,       // 文件不存在
    FILE_EXIST: 3002,           // 文件存在
    FILE_NO_AUTH: 3003,		    // 没有权限
    FILE_SYS_ERR: 3004,		    // 系统错误
    FILE_PARA_ERR: 3005,		// 请求参数错误
    FILE_SUFFIX_ERR: 3006,      // 文件后缀不支持

    // 请求表单返回状态码
    FORM_SUCCESS: 5000,
    FORM_NO_AUTH: 5003,	        // 没有权限
    FORM_SYS_ERR: 5004,		    // 系统出错
    FORM_PARA_ERR: 5005,		// 请求参数错误

    // 请求消息列表返回状态码
    MSG_SUCCESS: 1000,     // 消息成功码
    MSG_FAILD: 1001,     // 消息失败码
    MSG_SYS_ERROR: 1002,     // 系统出错码
    MSG_PARA_ERR: 1003,     // 参数错误码
    MSG_DB_ERR: 1004,     // 数据库错误码

    // 流程相关返回状态码
    PCS_SUCCESS: 2000,
    PCS_NO_AUTH: 2001,	    // 没有权限
    PCS_SYS_ERR: 2003,		// 系统出错
    PCS_PARA_ERR: 2004,		// 请求参数错误
    PCS_PARA_DIFF: 2006,		// 当前流程不匹配

    CUR_ALC_PCS_NO_EXIST: 0,

    OPER_SUBMIT: 1, // 提交
    OPER_T_SAVE_RESUME: 4, // 暂时保存
    OPER_NEED_TO_MODIFY: 2,
    OPER_REFUSE: 3,
    OPER_BOOK: 5,
    OPER_CONFIRM_BOOK: 6, // 确认预约时间
    OPER_HUNDRED_PEOPLE: 7,
    OPER_NEW_LECTURER: 8,
    OPER_FINISH: 9,


    MSG_SysMsgType: 0, // 系统消息类型
    MSG_AppointmentType: 1, // 预约消息类型
    MSG_BusinessLetterType: 2, // 商调函消息类型
    MSG_ConfirmHealthCheck: 3, // 体检确认消息类型
    MSG_MgrSimpleMsgType: 4, // 管理员普通消息类型

    // GET 请求返回
    GET_SYS_NO_AUTH: 6001,				// 没有权限
    GET_NO_DATA: 8002,					// 没有数据
    GET_INFO_FAIL: 8005,			// 得到数据库的数据失败
    MARSHAL_FAIL: 8006,				// json化失败
    GET_INFO_SUCCESS: 8008,			// 得到数据成功

    // POST 请求返回
    POST_SYS_NO_AUTH: 6001,	  // 没有权限
    UNMARSHAL_FAIL: 8007,			// 解析json失败
    POST_NO_DATA: 8002,				// 没有数据
    UPDATE_FAIL: 8009,				// 数据库更新失败
    POST_INFO_SUCCESS: 8000,  // 提交成功
    NOT_FILL: 8010,           // 未填写数据
  }
};

