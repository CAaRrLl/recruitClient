export interface PcsDataModel {
  PcsId: number;
  OperCode: number;
  AlcOpenid?: string;
  FormData?: FormDataModel[];
  HundredTable?: HrdDataModel[];
  NewLectureTable?: LecDataModel[];
}

export interface HrdDataModel {
  IsPass: boolean;
  HundredInfo: any
}

export interface LecDataModel {
  IsPass: boolean;
  NewLectureInfo: any
}

export interface FormDataModel {
  name: string;
  id: string;
  type: string;
  hint: string;
  required: boolean;
  optionValue: string[];
  optionNum: string;
  optionMoreNum: string;
  optionMoreValue: string[];
  childComps: any[];
  numberLimit: string;
  content: string[];
  template: any[];
}
