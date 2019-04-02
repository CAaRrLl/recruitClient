//商调函数据
import {isUndefined} from "util";

export class MsgData{
  MsgId: number;
  UserName: string;
  Address: string;
  Phone: string;
  Email: string;
  Identifiy: string;
  NowWorkPlace: string;
  FileName: string;
  FileId: string;
  StartTime: number;
  EndTime: number;
  constructor(MsgId: number, UserName: string, Address: string, Phone: string , Email: string,
              Identifiy: string , NowWorkPlace: string,FileName: string , FileId:string,StartTime:number,EndTime:number){
    this.UserName = UserName;
    this.Address = Address;
    this.Phone = Phone;
    this.Email = Email;
    this.Identifiy = Identifiy;
    this.NowWorkPlace = NowWorkPlace;
    this.FileId = FileId;
    this.MsgId = MsgId;
    this.FileName = FileName;
    this.StartTime = StartTime;
    this.EndTime = EndTime;
  }
}

//一般消息数据
export class CustomerMsgData{
  alcInfo: AlcMsgInfo[];
  Info: string;
  constructor(alcInfo: AlcMsgInfo[],Info: string){
    this.alcInfo = alcInfo;
    this.Info = Info
  }
}

export class SelectData {
  Birthday: string;
  TalentTitle: string;
  JobTitle: string;
  Subject: string;
  TopDegree: string;
  Paper: string[];
  Study: string[];
  SelectResult: string[];

  constructor(birthday, talentTitle, jobTitle, subject, topDegree: string
    , paper, study: string[]
    , selectRes: string[]) {
    this.Birthday = birthday;
    this.TalentTitle = talentTitle;
    this.JobTitle = jobTitle;
    this.Subject = subject;
    this.TopDegree = topDegree;
    this.Paper = paper;
    this.Study = study;
    this.SelectResult = selectRes
  }
}

export class FormData_Pcs {
  private name: string;
  private id: string;
  private type: string;
  private hint: string;
  private required: boolean;
  private optionValue: string[];
  private optionNum: number;
  private optionMoreNum: number;
  private optionMoreValue: string[];
  private childComps: any[];
  private numberLimit: number;
  private content: string[];
  private template: any[];
  constructor(
    name: string, id: string, type: string, hint: string, required: boolean,
    optionValue: string[], optionNum: number,
    optionMoreNum: number, optionMoreValue: string[],
    childComps: any[], numberLimit: number, content: string[], template: any[]) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.hint = hint;
    this.required = required;
    this.optionValue = optionValue;
    this.optionNum = optionNum;
    this.optionMoreNum = optionMoreNum;
    this.optionMoreValue = optionMoreValue;
    this.childComps = childComps;
    this.numberLimit = numberLimit;
    this.content = content;
    this.template = template;
  }
}

export class ReviewData {
  Status: number;
  constructor(Status: number) {
    this.Status = Status
  }
}

export class AnnexData {//todo:附件数据改为一个
  FileId: number[]
  FileContent: string[] //todo:此处改为数组，存放文件sha
  UpLoadPeople: string
  UpLoadTime: string
  FileName:string[]
  constructor(FileContent: string[], FileId?: number[], UpLoadPeople?: string, UpLoadTime?: string ,FileName?:string[] ) {
    this.FileId = FileId
    this.FileContent = FileContent
    this.UpLoadPeople = UpLoadPeople
    this.UpLoadTime = UpLoadTime
    this.FileName = FileName
  }
}

export class ResnData {
  StartTime: number
  EndTime: number
  Comment: string
  constructor(StartTime: number, EndTime: number, Comment: string) {
    this.StartTime = StartTime
    this.EndTime = EndTime
    this.Comment = Comment
  }
}




export class HundredTable {
  Openid: string;
  HundredInfo: HundredInfo;
  IsPass: boolean;
  constructor(Openid: string, HundredInfo: HundredInfo, IsPass: boolean) {
    this.Openid = Openid;
    this.HundredInfo = HundredInfo;
    this.IsPass = IsPass;
  }
}

export class LecturerTable {
  constructor(Openid: string, LecturerInfo: LecturerInfo, IsPass: boolean) {
    this.Openid = Openid;
    this.NewLectureInfo = LecturerInfo;
    this.IsPass = IsPass;
  }
  Openid: string;
  NewLectureInfo: LecturerInfo;
  IsPass: boolean;
}

export class HundredInfo {
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
  constructor(TIndex: string, Department: string, Name: string, Nationality: string, Sex: string, Birthday: string, FirstDegree: string, TopDegree: string, Degree: string, Profession: string, Workplace: string, Position: string, PositionalTitle: string, TalentKind: string, Thesis: string, Science: string, Contact: string, EMail: string, PositionKind: string, Salary: string, ScienceMoney: string, HouseMoney: string, HirePosition: string, HireTime: string, MetorKind: string, TechLevel: string, Tips: string, ID: string) {
    this.TIndex = TIndex;
    this.Department = Department;
    this.Name = Name;
    this.Nationality = Nationality;
    this.Sex = Sex;
    this.Birthday = Birthday;
    this.FirstDegree = FirstDegree;
    this.TopDegree = TopDegree;
    this.Degree = Degree;
    this.Profession = Profession;
    this.Workplace = Workplace;
    this.Position = Position;
    this.PositionalTitle = PositionalTitle;
    this.TalentKind = TalentKind;
    this.Thesis = Thesis;
    this.Science = Science;
    this.Contact = Contact;
    this.EMail = EMail;
    this.PositionKind = PositionKind;
    this.Salary = Salary;
    this.ScienceMoney = ScienceMoney;
    this.HouseMoney = HouseMoney;
    this.HirePosition = HirePosition;
    this.HireTime = HireTime;
    this.MetorKind = MetorKind;
    this.TechLevel = TechLevel;
    this.Tips = Tips;
    this.ID = ID;
  }
}

export class LecturerInfo {
  constructor(TIndex: string, Department: string, Name: string, Nationality: string, Sex: string, Birthday: string, ID: string, FirstDegree: string, TopDegree: string, Degree: string, Profession: string, Workplace: string, Position: string, Thesis: string, Science: string, EMail: string, Allowance: string, OtherRequire: string) {
    this.TIndex = TIndex;
    this.Department = Department;
    this.Name = Name;
    this.Nationality = Nationality;
    this.Sex = Sex;
    this.Birthday = Birthday;
    this.Id = ID;
    this.FirstDegree = FirstDegree;
    this.TopDegree = TopDegree;
    this.Degree = Degree;
    this.Profession = Profession;
    this.Workplace = Workplace;
    this.Position = Position;
    this.Thesis = Thesis;
    this.Science = Science;
    this.Email = EMail;
    this.Allowance = Allowance;
    this.OtherRequire = OtherRequire;
  }
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

export class PcsDataModel {
  PcsId: number;
  OperCode: number;
  AlcOpenid?: string;
  SelectData?: SelectData;
  FormData?: FormData_Pcs[];
  MsgData?: MsgData;
  ReviewData?: ReviewData;
  AnnexData?: AnnexData;
  ResnData?: ResnData;
  CustomerMsgData?: CustomerMsgData;
  Mark?: string;
  HundredTable?: HundredTable[];
  NewLectureTable?: LecturerTable[];
  constructor(pcsId: number, operCode: number, alcOpenId?: string) {
    this.PcsId = pcsId;
    this.OperCode = operCode;
    if (!isUndefined(alcOpenId)) {
      this.AlcOpenid = alcOpenId;
    }
  }
}
export class AlcMsgInfo{
  alcoid: string;
  alcname: string;
  constructor(alcoid: string,alcname: string){
    this.alcoid = alcoid;
    this.alcname = alcname;
  }
}

