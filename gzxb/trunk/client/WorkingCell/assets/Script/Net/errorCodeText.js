var net = require("net")

net.errorCodeText = {
    "PARAM_ERROR": "参数错误",
    "NOT_REIGSTER": "没有注册",
    "PLAYER_NOT_EXIST": "玩家不存在",
    "DESERIALIZE_FAILED": "反序列化失败",
    "FRESH_USER_MONEY_ERROR": "刷新玩家金币失败",
    "SYSTEM_ERROR": "系统错误",
    "ENTER_ROOM_LOCK_FAILED": "您的账号已在其他游戏登陆，请先退出",
    "ENTER_ROOM_GET_BASE_INFO_FAILED": "进房间获取用户基本数据失败",
    "ENTER_ROOM_READ_GOLD_FAILED": "进房间读取金币失败",
    "ENTER_ROOM_LACK_GOLD_FAILED": "进房间失败(金币不足)",
    "ENTER_ROOM_LOAD_DATA_FAILED": "进房间加载玩家键值对数据失败",
    "ACCOUNT_REMOTE_LOGIN": "账号异地登录",
    "START_GAME_STATUS_ERROR": "当前状态不能开始游戏",
    "RESTART_GAME_STATUS_ERROR": "当前状态不能重新开始游戏",

    "SET_RATIO_NOT_EXIST": "设置的倍率不存在",
    "SET_RATIO_LACK_GOLD_FAILED": "金币不足以设置当前倍率",
    "CARD_OPEN_LACK_GOLD_FAILED": "金币不足无法翻牌",
    "CARD_ALREADY_OPENED": "卡牌已被翻开了",
    "CARD_ALREADY_USED": "卡牌已被使用过了",
    "CARD_NOT_ALLOW_USE": "卡牌不能使用",
    "ENQUIP_ROLE_ID_NOT_EXIST": "上阵英雄不存在",
    "ENQUIP_ROLE_NOT_UNLOCK": "上阵了未解锁的英雄",
    "ENQUIP_ROLE_ALREADY_BE_ENQUIP": "英雄已经在阵容上",
    "UNENQUIP_POSITION_IS_NULL": "方位是空的无法下阵",
    "UNENQUIP_COUT_LIMIT": "只剩一个英雄在阵容上，无法下阵",
    "ATTACK_ENTITY_NOT_EXIST": "实体不存在",
    "ATTACK_ENTITY_NOT_MONSTER": "攻击实体不是怪物类型",
    "ATTACK_ENTITY_LACK_GOLD_FAILED": "攻击实体金币不足",
}