/**
 * 流程名称：根据流程id获取流程名称
 * by wzb
 * */

export class PcsNameGroup{
    public static PCSNAMEGROUP = [
        { code : 1 , name : '填写筛选',remark:'等待中'},
        { code : 2 , name : '填写简历',remark:'简历未提交'},
        { code : 3 , name : '审核简历',remark:'简历等待审核'},
        { code : 4 , name : '填写简历',remark:'简历已打回修改审核'},
        { code : 5 , name : '预约面试',remark:'管理员设置预约时间'},
        { code : 6 , name : '预约面试',remark:'等待应聘者确认'},
        { code : 7 , name : '自查表、汇总表提交',remark:'等待提交'},
        { code : 8 , name : '人事处初审',remark:'等待中' },
        { code : 9 , name : '预约洽谈',remark:'管理员设置预约时间'},
        { code : 10 , name : '预约洽谈',remark:'等待应聘者确认预约'},
        { code : 11 , name : '提交洽谈结果',remark:'考核协议等待提交'},
        { code : 12 , name : '审核考核协议',remark:'考核协议等待审核' },
        { code : 13 , name : '提交洽谈结果',remark:'考核协议已被打回修改'},
        { code : 14 , name : '过会审核',remark:'等待审核'},
        { code : 15 , name : '校领导审阅',remark:'等待审核'},
        { code : 16 , name : '人事处确认',remark:'等待确认'},
        { code : 17 , name : '录入体检结果',remark:'等待提交'},
        { code : 18 , name : '确认签约完成',remark:'等待确认'},
        { code : 19 , name : '上传商调函',remark:'等待提交'},
        { code : 20 , name : '预约报道',remark:'管理员设置预约时间'},
        { code : 21 , name : '确认报道',remark:'等待确认'},
        { code : 22 , name : '学院提交考核协议',remark:'等待提交'},
        { code : 23 , name : '预约报道',remark:'等待应聘者确认预约'},
        { code : 24 , name : '查看商调函',remark:'进行中'},
        { code:  25 , name : '管理员预约签约' , remark : '进行中'},
        { code:  26 , name : '等待应聘人确认预约' , remark : '等待中'},
        { code:  27 , name : '等待应聘人确认体验', remark:'等待中'},
        { code:  28 , name : '应聘结束', remark:'完成招聘'},
        { code : 29 , name : '上传计划生育',remark:'等待提交'},
        { code : 30 , name : '审核计划生育',remark:'进行中'},
        { code : 31 , name : '校领导审阅',remark:'等待审核'},
        { code : 0 , name : '应聘结束',remark:'应聘者被拒绝'}
    ];
    public static PCSNAMEGROUP_SCH = [
        { code : 1 , name : '填写筛选',remark:'等待中'},
        { code : 2 , name : '填写简历',remark:'简历未提交'},
        { code : 3 , name : '审核简历',remark:'简历等待审核'},
        { code : 4 , name : '填写简历',remark:'简历已打回修改审核'},
        { code : 5 , name : '完成报名',remark:'等待管理员进一步操作'},
    ];
    public static getPcsName(pcsid: number): string{
      if(pcsid > PcsNameGroup.PCSNAMEGROUP.length || pcsid < 0 ){
        alert("流程id错误");
        return "流程id错误";
      }
      for (let i = 0; i < PcsNameGroup.PCSNAMEGROUP.length; i++) {
        if ((pcsid-1) == i) {
          return PcsNameGroup.PCSNAMEGROUP[i].name;
        }
      }
    }
}
