import {
  HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse,
  HttpSentEvent, HttpUserEvent
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {errorCodes} from '../../constant/errorCodes';
import {AlertMsg} from '../shared/alert/alert.component';
import {MeditorService} from './meditor.service';
import {LoggerService} from './logger.service';

@Injectable()
export class RespInterceptor implements HttpInterceptor {
  constructor(private meditor: MeditorService, private clog: LoggerService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler)
  : Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    return next.handle(req).map((event) => {
      if (event instanceof HttpResponse) {
        switch (event.status) {
          case 200:
            const code = event.body.errCode;  // 自定义错误码
            const msg: AlertMsg = {
              title: '错误',
              content: '',
              confirmEvn: () => {}
            };
            switch (code) {
              case errorCodes.custom.pcsNoAuth:
                msg.title='提醒';
                msg.content = '请求流程数据没有权限';
                this.clog.W( 'class=intercept', '请求流程数据没有权限');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '请求流程数据没有权限'};
              case errorCodes.custom.pcsSysErr:
                msg.content = '请求流程数据失败，系统出错';
                this.clog.W( 'class=intercept', '请求流程数据失败，系统出错');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '请求流程数据失败，系统出错'};
              case errorCodes.custom.pcsParaErr:
                msg.content = '请求流程数据参数错误';
                this.clog.W( 'class=intercept', '请求流程数据参数错误');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '请求流程数据参数错误'};
              case errorCodes.custom.pcsNoExist:
                msg.content = '流程不存在';
                this.clog.W( 'class=intercept', '流程不存在');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '流程不存在'};
              case errorCodes.custom.pcsIdInvaild:
                msg.content = '流程号不匹配';
                this.clog.W( 'class=intercept', '流程号不匹配');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '流程号不匹配'};
              case errorCodes.custom.pcsOperCodeInvaild:
                msg.content = '操作码不合法';
                this.clog.W( 'class=intercept', '操作码不合法');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '操作码不合法'};
              case errorCodes.custom.alcNoAuth:
                msg.content = '应聘者没有权限';
                this.clog.W( 'class=intercept', '应聘者没有权限');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '应聘者没有权限'};
              case errorCodes.custom.alcSysErr:
                msg.content = '系统出错';
                this.clog.W( 'class=intercept', '系统出错');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '系统出错'};
              case errorCodes.custom.alcParaErr:
                msg.content = '请求参数错误';
                this.clog.W( 'class=intercept', '请求参数错误');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '请求参数错误'};
                //校领导审核
              case errorCodes.custom.tableNoMatch:
                msg.content = 'Excel行数与openid 数不对应';
                this.clog.W( 'class=intercept', 'Excel行数与openid 数不对应');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: 'Excel行数与openid 数不对应'};
              case errorCodes.custom.tableSetInfoFail:
                msg.content = '数据库插入失败';
                this.clog.W( 'class=intercept', '数据库插入失败');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '数据库插入失败'};
              case errorCodes.custom.tableGetInfFail:
                msg.content = '得到数据库的数据失败';
                this.clog.W( 'class=intercept', '得到数据库的数据失败');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '得到数据库的数据失败'};
              case errorCodes.custom.tableMarshalFail:
                msg.content = 'json化失败';
                this.clog.W( 'class=intercept', 'json化失败');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: 'json化失败'};
              case errorCodes.custom.tableUnmarshalFail:
                msg.content = '解析json失败';
                this.clog.W( 'class=intercept', '解析json失败');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '解析json失败'};
              case errorCodes.custom.tableUpdateFail:
                msg.content = '数据库更新失败';
                this.clog.W( 'class=intercept', '数据库更新失败');
                this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '数据库更新失败'};
              // case errorCodes.custom.alcExist:
              //   msg.content = '应聘者存在';
              //   this.clog.W( 'class=intercept', '应聘者存在');
              //   this.meditor.push({id: 'alert', body: msg});
              //   throw {status: code, statusText: '应聘者存在'};
              // case errorCodes.custom.alcNoExist:
              //   msg.content = '应聘者不存在';
              //   this.clog.W( 'class=intercept', '应聘者不存在');
              //   this.meditor.push({id: 'alert', body: msg});
              //   throw {status: code, statusText: '应聘者不存在'};
              case errorCodes.custom.sysNoAuth:
                msg.content = '没有权限，请求数据失败';
                this.clog.W( 'class=intercept', '没有权限，请求数据失败');
               // this.meditor.push({id: 'alert', body: msg});
                throw {status: code, statusText: '没有权限，请求数据失败'};
              case errorCodes.custom.fileNoAuth:
                msg.content = '没有权限';
                this.clog.W( 'class=intercept', '没有权限');
                throw {status: code, statusText: '没有权限'};
              case errorCodes.custom.fileSysErr:
                msg.content = '系统出错';
                this.clog.W( 'class=intercept', '系统出错');
                throw {status: code, statusText: '系统出错'};
              case errorCodes.custom.fileParaErr:
                msg.content = '请求参数错误';
                this.clog.W( 'class=intercept', '请求参数错误');
                throw {status: code, statusText: '请求参数错误'};
              case errorCodes.custom.fileSuffixErr:
                msg.content = '文件后缀不支持';
                this.clog.W( 'class=intercept', '文件后缀不支持');
                throw {status: code, statusText: '文件后缀不支持'};
                //消息部分
              // case errorCodes.custom.MSG_FAILD:
              //   msg.content = '获取消息失败！';
              //   this.clog.W( 'class=intercept', '获取消息失败！');
              //   throw {status: code, statusText: '获取消息失败！'};
              case errorCodes.custom.MSG_SYS_ERROR:
                msg.content = '获取消息失败，系统出错！';
                this.clog.W( 'class=intercept', '获取消息失败，系统出错！');
                throw {status: code, statusText: '获取消息失败，系统出错！'};
              case errorCodes.custom.MSG_PARA_ERR:
                msg.content = '获取消息失败，参数错误！';
                this.clog.W( 'class=intercept', '获取消息失败，参数错误！');
                throw {status: code, statusText: '获取消息失败，参数错误！'};
              case errorCodes.custom.MSG_DB_ERR:
                msg.content = '获取消息失败，数据库出错！';
                this.clog.W( 'class=intercept', '获取消息失败，数据库出错！');
                throw {status: code, statusText: '获取消息失败，数据库出错！'};
              // case errorCodes.custom.GET_NO_DATA:
              //   msg.content = '获取信息失败，没有数据！';
              //   this.clog.W( 'class=intercept', '获取信息失败，没有数据！');
              //   throw {status: code, statusText: '获取信息失败，没有数据！'};
              case errorCodes.custom.GET_INFO_FAIL:
                msg.content = '获取信息失败，json化失败！';
                this.clog.W( 'class=intercept', '获取信息失败，json化失败！');
                throw {status: code, statusText: '获取信息失败，json化失败！'};
                // 获取管理员信息
              case errorCodes.custom.priNoAuth:
                msg.content = '获取管理员信息失败，没有权限！';
                this.clog.W( 'class=intercept', '获取管理员信息失败，没有权限！');
                throw {status: code, statusText: '获取管理员信息失败，没有权限！'};
              case errorCodes.custom.priSysErr:
                msg.content = '获取管理员信息失败，系统出错！';
                this.clog.W( 'class=intercept', '获取管理员信息失败，系统出错！');
                throw {status: code, statusText: '获取管理员信息失败，系统出错！'};
              case errorCodes.custom.priParaErr:
                msg.content = '获取管理员信息失败，参数错误！';
                this.clog.W( 'class=intercept', '获取管理员信息失败，参数错误！');
                throw {status: code, statusText: '获取管理员信息失败，参数错误！'};
              case errorCodes.custom.priQueryDbErr:
                msg.content = '获取管理员信息失败，数据库查询出错！';
                this.clog.W( 'class=intercept', '获取管理员信息失败，数据库查询出错！');
                throw {status: code, statusText: '获取管理员信息失败，数据库查询出错！'};
              default:
                return event.clone({body: event.body});
            }
          case 404:
            // todo
            break;
          default:

            throw {status: event.status, statusText: event.statusText};
        }
      }
      // if(event.type === 0){
      //   const msg: AlertMsg = {
      //     title: '错误',
      //     content: '发生未知错误，请求被拒绝',
      //     confirmEvn: () => {}
      //   };
      //   this.clog.W( 'class=intercept', '发生未知错误，请求被拒绝');
      //   //this.meditor.push({id: 'alert', body: msg});
      // }
      // console.log(event);
      return event;
    });
  }

}
