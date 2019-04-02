
export class AlcInfo {
    Name: string;
    UserPic: string;
    NoRead: number;
    PscId: number;
    PcsType: string;
    PcsNameArray: PcsName[];
}

export class FBAlcInfo {
    errCode: number;
    data: AlcInfo;
}

export class PcsName {
    PcsId: number[];
    PcsName: number;
}

export class ShowPcs {
    Name: string;
    IsShow: number;
}