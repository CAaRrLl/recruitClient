/**
 * Created by jijinping on 2017/8/11.
 */
import {selector} from './selector';
import {AppModule} from "../../../app.module";
export const SelectConditions:any={
    "conditionMap":
        {
            "人才称号":
                {
                    "无":0,
                    "国家自然科学基金优秀青年基金项目获得者": 1,
                    "国家“千人计划”青年人才": 1,
                    "“国家特支计划”青年拔尖人才": 1,
                    "“长江学者奖励计划”青年学者": 1,
                    "院士": 2,
                    "长江学者特聘教授": 4,
                    "国家千人计划入选者": 4,
                    "国家杰出青年基金获得者": 4
                },
            "职称职务":
                {
                    "海外知名大学或科研机构正高":1,
                    "国内知名高校或科研机构正高":1,
                    "海外知名大学或科研机构副高":2,
                    "国内知名高校或科研机构副高":2,
                    "其他高校或科研机构正高":2
                },
            "学科类别":
                {
                    "人文社科类":1,
                    "理工类":2,
                    "艺术、体育类":4
                },
            "论文成果":
                {
                    "第一作者或主要作者在SCI或SSCI或A&HCI收录期刊上发表较高水平的学术论文1篇以上":1,
                    "学校认定的权威期刊（含一类、二类）上发表论文1篇以上":1,
                    "在本专业核心学术刊物上发表质量较高学术论文3篇或以上":1,
                    "第一作者或通讯作者在SSCI影响因子前1%的刊物或《中国社会科学》发表论文":2,
                    "在SSCI或A&HCI、学校规定的一类权威期刊全文发表3篇或以上学术论文":4,
                    "第一作者或通讯作者在SSCI影响因子前5%的刊物或学校规定的一类权威期刊发表论文2篇以上":8,
                    "作为第一作者或通讯作者在所属一类学科的权威杂志发表5篇以上高质量论文":16,
                    "第一作者或通讯作者在SCI收录期刊（含IEEE)上发表较高水平的学术论文2篇以上":32,
                    "在JCR期刊学科分区表二区期刊发表学术论文1篇以上":32,
                    "第一作者或者通讯作者在《Science》、《Nature》、《Cell》等学术刊物及其他高影响因子的子刊发表论文":64,
                    "在JCR期刊学科分区表一区期刊上全文发表5篇或以上的学术论文":128,
                    "作为第一或通讯作者发表1篇以上被收录为ESI的Top Paper":128,
                    "作为第一或通讯作者在《Science》、《Nature》、《Cell》高影响因子的子刊，或连续在所属一级学科（及交叉学科）的权威杂志发表2篇以上论文":256,
                    "在JCR期刊学科分区表一区期刊上全文发表3篇以上学术论文":512,
                    "作为第一或通讯作者发表1篇被收录为ESI的Top Paper":512,
                    "在学校认定的权威期刊上发表论文1篇以上":1024,
                    "在本专业核心学术刊物上发表学术论文2篇以上":1024,
                    "参加全国性个人美展、体育竞赛获奖前三名":1024,
                },
            "科研获奖":
                {
                    "作为第一完成人获得教育部人文社科奖三等奖":1,
                    "作为第一完成人获他省部级人文社会科学研究成果二等奖":2,
                    "作为第一完成人获得省部级以上科研成果二等奖":4,
                    "作为第一完成人获得省部级人文社会科学研究成果三等奖":8,
                    "作为第一完成人获省部级以上科研成果三等奖":16
                }
        },
    "posts":[
        {
            "name":AppModule.LEADER_TALENT,
            "level":6,
            "conditions":[
                {"ageUpLim":55,"ageDownLim":0,"talentTitRq":6,"jobTitRq":0,"subjectTitRq":0,"paperTitRq":0,"studyTitRq":0},
                {"ageUpLim":65,"ageDownLim":55,"talentTitRq":2,"jobTitRq":0,"subjectTitRq":0,"paperTitRq":0,"studyTitRq":0}
            ]
        },
        {
            "name":AppModule.SUBJECT_LEADER,
            "level":5,
            "conditions":[
                {"ageUpLim":55,"ageDownLim":0,"talentTitRq":0,"jobTitRq":1,"subjectTitRq":0,"paperTitRq":0,"studyTitRq":0}
            ]
        },
        {
            "name":AppModule.SCIENCE_LEADER,
            "level":4,
            "conditions":[
                {"ageUpLim":50,"ageDownLim":0,"talentTitRq":0,"jobTitRq":3,"subjectTitRq":0,"paperTitRq":0,"studyTitRq":0}
            ]
        },
        {
            "name":AppModule.OUTSTANTING_YOUTH_A,
            "level":3,
            "conditions":[
                {"ageUpLim":40,"ageDownLim":0,"talentTitRq":1,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":2,"studyTitRq":3},
                {"ageUpLim":40,"ageDownLim":0,"talentTitRq":1,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":4,"studyTitRq":3},
                {"ageUpLim":40,"ageDownLim":0,"talentTitRq":1,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":64,"studyTitRq":4},
                {"ageUpLim":40,"ageDownLim":0,"talentTitRq":1,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":128,"studyTitRq":0}
            ]
        },
        {
            "name":AppModule.OUTSTANTING_YOUTH_B,
            "level":2,
            "conditions":[
                {"ageUpLim":40,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":8,"studyTitRq":8},
                {"ageUpLim":40,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":16,"studyTitRq":0},
                {"ageUpLim":40,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":256,"studyTitRq":16},
                {"ageUpLim":40,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":512,"studyTitRq":0}
            ]
        },
        {
            "name":"新进讲师",
            "level":1,
            "conditions":[
                {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":1,"studyTitRq":0},
                {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":32,"studyTitRq":0},
                {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":4,"paperTitRq":1024,"studyTitRq":0}
            ]
        }
    ]
}
describe('SelectMaping',()=>{
    var testTool
    beforeEach(()=>{
        testTool=new selector(SelectConditions.conditionMap,SelectConditions.posts);
    });
    it('国家自然科学基金优秀青年基金项目获得者 to 1',()=>{
        let res=testTool.SelectMaping('国家自然科学基金优秀青年基金项目获得者','人才称号')
        if(res==1){
            console.log('Maping Success')
        }else{
            console.log('Maping Fail')
        }
    });
    it('海外知名大学或科研机构副高 to 2',()=>{
        let res=testTool.SelectMaping('海外知名大学或科研机构副高','职称职务')
        if(res==2){
            console.log('Maping Success')
        }else{
            console.log('Maping Fail')
        }
    });
    it('艺术、体育类 to 4',()=>{
        let res=testTool.SelectMaping('艺术、体育类','学科类别')
        if(res==4){
            console.log('Maping Success')
        }else{
            console.log('Maping Fail')
        }
    });
    it('在SSCI或A&HCI、学校规定的一类权威期刊全文发表3篇或以上学术论文 to 4',()=>{
        let res=testTool.SelectMaping('在SSCI或A&HCI、学校规定的一类权威期刊全文发表3篇或以上学术论文','论文成果')
        if(res==4){
            console.log('Maping Success')
        }else{
            console.log('Maping Fail')
        }
    });
    it('在本专业核心学术刊物上发表学术论文2篇以上 to 1024',()=>{
        let res=testTool.SelectMaping('在本专业核心学术刊物上发表学术论文2篇以上','论文成果')
        if(res==1024){
            console.log('Maping Success')
        }else{
            console.log('Maping Fail')
        }
    });
    it('作为第一完成人获他省部级人文社会科学研究成果二等奖 to 2',()=>{
        let res=testTool.SelectMaping('作为第一完成人获他省部级人文社会科学研究成果二等奖','科研获奖')
        if(res==2){
            console.log('Maping Success')
        }else{
            console.log('Maping Fail')
        }
    });
});
describe('SelectExep',()=>{
    var testTool
    beforeEach(()=>{
        testTool=new selector(SelectConditions.conditionMap,SelectConditions.posts);
    });
    it('新进讲师 34 0 0 1 1 0 Pass',()=>{
        let postRq={"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":1,"studyTitRq":0}
        let res=testTool.SelectExep(34,0,0,1,1,0,postRq)
        if(res==true){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
    it('新进讲师 34 0 0 4 1024 0 Pass',()=>{
        let postRq={"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":4,"paperTitRq":1024,"studyTitRq":0}
        let res=testTool.SelectExep(34,0,0,4,1024,0,postRq)
        if(res==true){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
    it('杰出青年B 35 0 0 2 256 16 Pass',()=>{
        let postRq= {"ageUpLim":40,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":256,"studyTitRq":16}
        let res=testTool.SelectExep(35,0,0,2,256,16,postRq)
        if(res==true){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
    it('杰出青年A 35 1 0 2 64 4 Pass',()=>{
        let postRq= {"ageUpLim":40,"ageDownLim":0,"talentTitRq":1,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":64,"studyTitRq":4}
        let res=testTool.SelectExep(35,1,0,2,64,4,postRq)
        if(res==true){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
    it('领军人物 60 2 0 0 0 0 Pass',()=>{
        let postRq= {"ageUpLim":65,"ageDownLim":55,"talentTitRq":2,"jobTitRq":0,"subjectTitRq":0,"paperTitRq":0,"studyTitRq":0}
        let res=testTool.SelectExep(60,2,0,0,0,0,postRq)
        if(res==true){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
    it('新进讲师 35 0 0 1 1 0 Fail',()=>{
        let postRq={"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":1,"studyTitRq":0}
        let res=testTool.SelectExep(35,0,0,1,1,0,postRq)
        if(res==false){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
    it('新进讲师 34 0 0 4 0 0 Fail',()=>{
        let postRq={"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":4,"paperTitRq":1024,"studyTitRq":0}
        let res=testTool.SelectExep(34,0,0,4,0,0,postRq)
        if(res==false){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
    it('杰出青年B 41 0 0 2 256 16 Fail',()=>{
        let postRq= {"ageUpLim":40,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":256,"studyTitRq":16}
        let res=testTool.SelectExep(41,0,0,2,256,16,postRq)
        if(res==false){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
    it('杰出青年A 35 0 0 2 64 4 Fail',()=>{
        let postRq= {"ageUpLim":40,"ageDownLim":0,"talentTitRq":1,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":64,"studyTitRq":4}
        let res=testTool.SelectExep(35,0,0,2,64,4,postRq)
        if(res==false){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
    it('领军人物 60 1 0 0 0 0 Fail',()=>{
        let postRq= {"ageUpLim":65,"ageDownLim":55,"talentTitRq":2,"jobTitRq":0,"subjectTitRq":0,"paperTitRq":0,"studyTitRq":0}
        let res=testTool.SelectExep(60,1,0,0,0,0,postRq)
        if(res==false){
            console.log('SelectExep Success')
        }else{
            console.log('SelectExep Fail')
        }
    });
});
describe('SelectType',()=>{
    var testTool
    beforeEach(()=>{
        testTool=new selector(SelectConditions.conditionMap,SelectConditions.posts);
    });
    it('新进讲师 34 0 0 1 1 0 Pass',()=>{
        let postRqs= [
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":1,"studyTitRq":0},
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":32,"studyTitRq":0},
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":4,"paperTitRq":1024,"studyTitRq":0}
        ]
        let res=testTool.SelectType(34,0,0,1,1,0,postRqs)
        if(res==true){
            console.log('SelectType Success')
        }else{
            console.log('SelectType Fail')
        }
    });
    it('新进讲师 34 0 0 2 32 0 Pass',()=>{
        let postRqs= [
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":1,"studyTitRq":0},
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":32,"studyTitRq":0},
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":4,"paperTitRq":1024,"studyTitRq":0}
        ]
        let res=testTool.SelectType(34,0,0,2,32,0,postRqs)
        if(res==true){
            console.log('SelectType Success')
        }else{
            console.log('SelectType Fail')
        }
    });
    it('新进讲师 34 0 0 4 1024 0 Pass',()=>{
        let postRqs= [
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":1,"studyTitRq":0},
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":32,"studyTitRq":0},
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":4,"paperTitRq":1024,"studyTitRq":0}
        ]
        let res=testTool.SelectType(34,0,0,4,1024,0,postRqs)
        if(res==true){
            console.log('SelectType Success')
        }else{
            console.log('SelectType Fail')
        }
    });
    it('新进讲师 34 0 0 0 32 0 Fail',()=>{
        let postRqs= [
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":1,"paperTitRq":1,"studyTitRq":0},
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":2,"paperTitRq":32,"studyTitRq":0},
            {"ageUpLim":35,"ageDownLim":0,"talentTitRq":0,"jobTitRq":0,"subjectTitRq":4,"paperTitRq":1024,"studyTitRq":0}
        ]
        let res=testTool.SelectType(34,0,0,0,32,0,postRqs)
        if(res==false){
            console.log('SelectType Success')
        }else{
            console.log('SelectType Fail')
        }
    });
});
describe('Select',()=>{
    var testTool
    beforeEach(()=>{
        testTool=new selector(SelectConditions.conditionMap,SelectConditions.posts);
    });
    it('基本筛选 34 院士 其他高校或科研机构正高 0 0 0=>领军人才',()=>{
        let res=testTool.Select(34,testTool.SelectMaping('院士','人才称号'),testTool.SelectMaping('其他高校或科研机构正高','职称职务'),0,0,0)
        if(res=='领军人才'){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('基本筛选 34 长江学者特聘教授 0 0 0 0=>领军人才',()=>{
        let res=testTool.Select(34,testTool.SelectMaping('长江学者特聘教授','人才称号'),0,0,0,0)
        if(res=='领军人才'){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('基本筛选 56 长江学者特聘教授 0 0 0 0=>无',()=>{
        let res=testTool.Select(56,testTool.SelectMaping('长江学者特聘教授','人才称号'),0,0,0,0)
        if(res==''){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('基本筛选 56 院士 0 0 0 0 =>领军人才',()=>{
        let res=testTool.Select(56,testTool.SelectMaping('院士','人才称号'),0,0,0,0)
        if(res=='领军人才'){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    })
    it('基本筛选 50 国家杰出青年基金获得者 国内知名高校或科研机构正高 0 0 0 =>领军人才',()=>{
        let res=testTool.Select(50,testTool.SelectMaping('国家杰出青年基金获得者','人才称号'),testTool.SelectMaping('国内知名高校或科研机构正高','职称职务'),0,0,0)
        if(res=='领军人才'){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    })
    it('基本筛选 48 0 海外知名大学或科研机构正高 0 0 0 =>学科带头人',()=>{
        let res=testTool.Select(48,0,testTool.SelectMaping('海外知名大学或科研机构正高','职称职务'),0,0,0)
        if(res=='学科带头人'){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('基本筛选 48 0 海外知名大学或科研机构副高 0 0 0 =>学术带头人',()=>{
        let res=testTool.Select(48,0,testTool.SelectMaping('海外知名大学或科研机构副高','职称职务'),0,0,0)
        if(res=='学术带头人'){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('再次筛选 36 国家自然科学基金优秀青年基金项目获得者 0 人文社科类 第一作者或通讯作者在SSCI影响因子前1%的刊物或《中国社会科学》发表论文 ' +
        '作为第一完成人获得教育部人文社科奖三等奖 =>杰出青年A', ()=>{
        let res=testTool.Select(36,testTool.SelectMaping('国家自然科学基金优秀青年基金项目获得者','人才称号'),0,testTool.SelectMaping('人文社科类','学科类别'),
            testTool.SelectMaping('第一作者或通讯作者在SSCI影响因子前1%的刊物或《中国社会科学》发表论文','论文成果'),
            testTool.SelectMaping('作为第一完成人获得教育部人文社科奖三等奖','科研获奖'))
        if(res==AppModule.OUTSTANTING_YOUTH_A){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('再次筛选 38 国家自然科学基金优秀青年基金项目获得者 0 人文社科类 在SSCI或A&HCI、学校规定的一类权威期刊全文发表3篇或以上学术论文 ' +
        '作为第一完成人获得教育部人文社科奖三等奖 =>杰出青年A', ()=>{
        let res=testTool.Select(38,testTool.SelectMaping('国家自然科学基金优秀青年基金项目获得者','人才称号'),0,testTool.SelectMaping('人文社科类','学科类别'),
            testTool.SelectMaping('在SSCI或A&HCI、学校规定的一类权威期刊全文发表3篇或以上学术论文','论文成果'),
            testTool.SelectMaping('作为第一完成人获得教育部人文社科奖三等奖','科研获奖'))
        if(res==AppModule.OUTSTANTING_YOUTH_A){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('再次筛选 38 国家“千人计划”青年人才 0 理工类 第一作者或者通讯作者在《Science》、《Nature》、《Cell》等学术刊物及其他高影响因子的子刊发表论文 ' +
        '作为第一完成人获得省部级以上科研成果二等奖 =>杰出青年A', ()=>{
        let res=testTool.Select(38,testTool.SelectMaping('国家“千人计划”青年人才','人才称号'),0,testTool.SelectMaping('理工类','学科类别'),
            testTool.SelectMaping('第一作者或者通讯作者在《Science》、《Nature》、《Cell》等学术刊物及其他高影响因子的子刊发表论文','论文成果'),
            testTool.SelectMaping('作为第一完成人获得省部级以上科研成果二等奖','科研获奖'))
        if(res==AppModule.OUTSTANTING_YOUTH_A){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('再次筛选 38 0 0 理工类 作为第一或通讯作者在《Science》、《Nature》、《Cell》高影响因子的子刊，或连续在所属一级学科（及交叉学科）的权威杂志发表2篇以上论文 ' +
        '作为第一完成人获省部级以上科研成果三等奖 =>杰出青年B', ()=>{
        let res=testTool.Select(38,0,0,testTool.SelectMaping('理工类','学科类别'),
            testTool.SelectMaping('作为第一或通讯作者在《Science》、《Nature》、《Cell》高影响因子的子刊，或连续在所属一级学科（及交叉学科）的权威杂志发表2篇以上论文','论文成果'),
            testTool.SelectMaping('作为第一完成人获省部级以上科研成果三等奖','科研获奖'))
        if(res==AppModule.OUTSTANTING_YOUTH_B){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('再次筛选 38 0 0 人文社科类 作为第一或通讯作者在《Science》、《Nature》、《Cell》高影响因子的子刊，或连续在所属一级学科（及交叉学科）的权威杂志发表2篇以上论文 ' +
        '0 =>杰出青年B', ()=>{
        let res=testTool.Select(38,0,0,testTool.SelectMaping('人文社科类','学科类别'),
            testTool.SelectMaping('作为第一作者或通讯作者在所属一类学科的权威杂志发表5篇以上高质量论文','论文成果'), 0)
        if(res==AppModule.OUTSTANTING_YOUTH_B){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('再次筛选 35 0 0 人文社科类 在本专业核心学术刊物上发表质量较高学术论文3篇或以上 0 =>无', ()=>{
        let res=testTool.Select(35,0,0,testTool.SelectMaping('人文社科类','学科类别'), testTool.SelectMaping('在本专业核心学术刊物上发表质量较高学术论文3篇或以上','论文成果'), 0)
        if(res==''){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('再次筛选 34 0 0 人文社科类 在本专业核心学术刊物上发表质量较高学术论文3篇或以上 0 =>新进讲师', ()=>{
        let res=testTool.Select(34,0,0,testTool.SelectMaping('人文社科类','学科类别'), testTool.SelectMaping('在本专业核心学术刊物上发表质量较高学术论文3篇或以上','论文成果'), 0)
        if(res=='新进讲师'){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('再次筛选 34 0 0 理工类 第一作者或通讯作者在SCI收录期刊（含IEEE)上发表较高水平的学术论文2篇以上 0 =>新进讲师', ()=>{
        let res=testTool.Select(34,0,0,testTool.SelectMaping('理工类','学科类别'),
            testTool.SelectMaping('第一作者或通讯作者在SCI收录期刊（含IEEE)上发表较高水平的学术论文2篇以上','论文成果'), 0)
        if(res=='新进讲师'){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
    it('再次筛选 34 0 0 艺术、体育类 在本专业核心学术刊物上发表学术论文2篇以上 0 =>新进讲师', ()=>{
        let res=testTool.Select(34,0,0,testTool.SelectMaping('艺术、体育类','学科类别'),
            testTool.SelectMaping('在本专业核心学术刊物上发表学术论文2篇以上','论文成果'), 0)
        if(res=='新进讲师'){
            console.log('Result Match')
        }else{
            console.log('Result Match Fail')
        }
    });
});