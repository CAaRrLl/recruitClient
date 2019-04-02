/*
流程1基本筛选再次筛选数据类型
 */
export interface SelectData{
  Birthday:any;
  TalentTitle:string;
  JobTitle:string;
  Subject:string;
  TopDegree:string;
  Paper:string[];
  Study:string[];
  SelectResult:string[];
}
/*
流程5、9、25、20预约时间数据类型
 */
export interface ResnData{
  StartTime:number;
  EndTime:number;
  Comment:string;
}
/*
流程7自查表数据类型
 */
export interface SelfCheckSheet{
  AnnexFiles:File[];
}
interface File{
  FileName:string;
  FileContent:number;
}
/*
流程11,22考核协议数据、14过会纪要数据、18签约合同数据数据类型
 */
export interface AnnexData{
  FileContent:string[];
  FileName?: string[];
}
export interface ReviewData{
  Status: number;
}
/*
流程19商调函、29计划生育证明数据类型
 */
export interface MsgData{
  //商调函
  MsgId?:number;
  StartTime?:number;
  EndTime?:number;
  UserName:string;
  Address:string;
  Phone:string;
  Email:string;
  Identity:string;
  NowWorkPlace: string;

  //计划生育证明
  FileName:string;
  FileId:string;
}

//校领导审核百人计划数据
export interface HundredTable{
  Openid: string;
  HundredInfo: HundredInfo;
  IsPass: boolean;
}
//校领导审核新进讲师数据
export interface LecturerTable {
  Openid: string;
  NewLectureInfo: LecturerInfo;
  IsPass: boolean;
}
/*
流程数据
 */
export interface PcsDataModel {
  PcsId: number;
  OperCode: number;
  AlcOpenid?: string;
  SelectData?: SelectData;
  MsgData?: MsgData;
  AnnexData?: AnnexData;
  ResnData?: ResnData;
  ReviewData?: ReviewData;
  HundredTable?: HundredTable[];
  NewLectureTable?: LecturerTable[];
  Mark?: string;
}

/*
筛选条件表
*/
export interface SelectConditions{
  conditionMap:any;
  posts:any;
}

//发送单独/批量消息时构造应聘者数组
export interface AlcMsgInfo{
  alcoid: string;
  alcname: string;
}

//一般消息数据
export interface CustomerMsgData{
  alcInfo: AlcMsgInfo[];
  Info: string;
}

export interface HundredInfo {
  Openid: string
  TIndex: string;
  Department: string;
  Name: string;
  Nationality: string;
  Sex: string;
  Birthday: string;
  FirstDegree: string;
  TopDegree: string;
  Degree: string;
  Profession: string;
  Workplace: string;
  Position: string;
  PositionalTitle: string;
  TalentKind: string;
  Thesis: string;
  Science: string;
  Contact: string;
  EMail: string;
  PositionKind: string;
  Salary: string;
  ScienceMoney: string;
  HouseMoney: string;
  HirePosition: string;
  HireTime: string;
  MetorKind: string;
  TechLevel: string;
  Tips: string;
  ID: string;
}

export interface LecturerInfo {
  Openid: string;
  TIndex: string;
  Department: string;
  Name: string;
  Nationality: string;
  Sex: string;
  Birthday: string;
  Id: string;
  FirstDegree: string;
  TopDegree: string;
  Degree: string;
  Profession: string;
  Workplace: string;
  Position: string;
  Thesis: string;
  Science: string;
  Email: string;
  Allowance: string;
  OtherRequire: string;
}


