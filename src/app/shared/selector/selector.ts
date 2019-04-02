export class selector{
    constructor(private conditionMap:any,private posts){
        console.log(conditionMap);
        console.log(posts);
    };
    //将人才称号,职称职务,学科类别,科研获奖,论文成果的文字映射为数字
    public SelectMaping(content:string,type:string):number{
        if(content=='') return 0;
        if(typeof this.conditionMap[type]!='undefined'){
            if(typeof this.conditionMap[type][content]!='undefined'){
                return this.conditionMap[type][content];
            }else{
                console.log(content+' not found in conditionMap['+type+']');
            }
        }else{
            console.log(type+' not found in conditionMap');
        }
        return 0;
    }
    //对人才筛选表的一条要求进行筛选,eg:{"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":1,"studyTitRq":0}
    public SelectExep(age:number,talentTit:number, jobTit:number,
                      subjectTit:number,paperTit:number,studyTit:number,postRq:any):boolean{
        let res:boolean;
        res=age<postRq.ageUpLim&&age>=postRq.ageDownLim;
        if(postRq.talentTitRq!=0){
            res=res&&(postRq.talentTitRq&talentTit)!=0;
        }
        if(postRq.jobTitRq!=0){
            res=res&&(postRq.jobTitRq&jobTit)!=0;
        }
        if(postRq.subjectTitRq!=0){
            res=res&&(postRq.subjectTitRq&subjectTit)!=0;
        }
        if(postRq.paperTitRq!=0){
            res=res&&(postRq.paperTitRq&paperTit)!=0;
        }
        if(postRq.subjectTitRq!=0){
            res=res&&(postRq.subjectTitRq&subjectTit)!=0;
        }
        return res;
    }
    //对某类岗位进行筛选,eg:是否为新进讲师
    public SelectType(age:number,talentTit:number, jobTit:number,
                      subjectTit:number,paperTit:number,studyTit:number,postRqs:any):boolean{
        let res:boolean=false;
        for(let i=0;i<postRqs.length;i++){
            res=res||this.SelectExep(age,talentTit,jobTit,subjectTit,paperTit,studyTit,postRqs[i]);
            if(res) break;
        }
        return res;
    }
    //筛选最终结果,取最高级别岗位
    public Select(age:number,talentTit:number,jobTit:number,
                  subjectTit:number,paperTit:number,studyTit:number):string{
        let res:string='';
        let level:number=0;   //当前选中岗位级别
        for(let i=0;i<this.posts.length;i++){
            if(level<this.posts[i].level){
                if(this.SelectType(age,talentTit,jobTit,subjectTit,paperTit,studyTit,this.posts[i].conditions)){
                    level=this.posts[i].level;
                    res=this.posts[i].name;
                }
            }
        }
        return res;
    }
    public GetAge(birthday:string):number{
        let res=birthday.match(/^([0-9]{1,4})(-|\/)([0-9]{1,2})\2([0-9]{1,2})$/);
        if(res==null){
            return -1;
        }
        let birth=new Date(res[0]);
        let today=new Date();
        let age=(today.getTime() - birth.getTime())/(24 * 60 * 60 * 1000 * 365);
        return parseInt(age.toString());
    }
    public GetTopTalent(posts:string[]):string{
        let post:string='';
        let level:number = 0;
        if(typeof posts =='undefined'){
            return post;
        }
        for(let i=0;i<posts.length;i++){
            for(let j=0;j<this.posts.length;j++){
                if(this.posts[j].name==posts[i]){
                    if(level<this.posts[j].level){
                        level=this.posts[j].level;
                        post=this.posts[j].name;
                        break;
                    }
                }
            }
        }
        return post;
    }
}
