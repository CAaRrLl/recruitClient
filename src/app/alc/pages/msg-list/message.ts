export class Message {
	MsgId: number
	MsgType: number
	SenderId: string
	RecId: string
	CreateTime: string
	IsRead: boolean
	ProcessId: number
	Status: number
	Title: string
	Info: string
	StartTime: number
	EndTime: number
}

export class FBMessages {
	errCode: number
	data: Message[]
}

export class FBMessage {
	errCode: number
	data: Message
}

export class MSG_ERR_CODE {
	public static MSG_SUCCESS = 1000 //消息成功码
	public static MSG_FAILD = 1001 //消息失败码
	public static MSG_SYS_ERROR = 1002 //系统出错码
	public static MSG_PARA_ERR = 1003 //参数错误码
	public static MSG_DB_ERR = 1004 //数据库错误码
}

