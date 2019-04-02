import {environment} from '../environments/environment';

export const config = {
  // 开发环境
  environment: {
    debug: !environment.production,
    consoleOut: false,
    prodPrefix: '',
  },
  // 服务器设置
  server: {
    protocol: 'http',
    host: '',
    testHost: '',
    port: 6600,
    testPort: 6607,
  },
  // 公有方法
  common: {
    getApiPrefix() {
      return `${config.environment.debug ? `` : `/recruitMgr` }`;
    },
  },
  // 项目常量
  project: {
    proName: '新版人才招聘系统',
    hundrenPlan: '百人计划',
    newLecturer: '新进讲师',
    other: '其他',
    scholarComm: '学者交流会',
    leaderTalent: '领军人才',
    subjectLeader: '学科带头人',
    scientLeader: '学术带头人',
    outstandingYounthA: '青年杰出人才（A类）',
    outstandingYounthB: '青年杰出人才（B类）'
  },
  catalog: {
    Img: 'assets/img',
    html: 'assets/html'
  },
  // 管理员等级
  level: {
    alc: 0,
    god: 1,
    principal: 2,
    personnel: 5,
    college: 6,
    vicePrincipal: 8
  },
  // 操作码
  operCode: {
    checkBrjhSelfSubmit: 7,
    checkXjjsSelfSubmit: 8,
    submit: 1,
    needModify: 2,
    refuse: 3,
    saveResume: 4,
    book: 5,
    confirmBook: 6,
    hundrenPlan: 7,
    newLecturer: 8,
    finish: 9
  },

  // 学者交流会开关
  xzjlh: {
    open: true
  }
};
