import { getNodeChildByName } from "./getNodeChildByName";
import LegoSyncIns from './LegoSyncIns';
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    
    private bodyNode:cc.Node = null;        // 物体节点
    private title:cc.Animation = null;      // 标题
    private plate:cc.Animation = null;      // 盘子
    private plateNode:cc.Node = null;       // 盘子节点
    private bodyPlate:cc.Node[] = [];       // 物体盘子
    private bubble:cc.Animation = null;     // 气泡
    private bread:cc.Node = null;           // 面包
    private vegetables:cc.Node = null;      // 蔬菜
    private meat:cc.Node = null;            // 肉
    private guide:cc.Node = null;           // 引导
    private guideMask:cc.Node = null;       // 遮罩
    private finger:cc.Animation = null;     // 手指
    private submitAni:cc.Animation = null;  // 提交动画
    private submitBtn:cc.Node = null;       // 提交
    private great:cc.Animation = null;
    private miss:cc.Animation = null;

    private bTitleOut:Boolean = false;      // 标题渐出
    private curBody:cc.Node = null;         // 当前物体
    private bodyPos:cc.Vec2 = cc.v2(0,0);   // 当前物体位置
    private order:number[] = [];            // 物体顺序
    private curBodyOrder:number[] = [];     // 当前盘子里物体
    private curBodyNode:cc.Node[] = [];     // 当前盘子物体
    private curBodyIndex:number = 0;        // 当前操作的物体
    private curBodyListIdx:number = -1;     // 当前操作物体列表
    private bIsSubmit:boolean = false;      // 是否提交
    private bodyList:number[] = [];         // 物体列表
    private bIsMoveEnd:boolean = false;     // 移动完成
    private 
    
    onLoad() {
        let element = getNodeChildByName(this.node,"interactive_breakfast/yuanSu");
        this.bodyNode = getNodeChildByName(element,"interactive_wuTi_01");
        this.title = getNodeChildByName(this.bodyNode,"tex_tiMu", cc.Animation);
        this.plate = getNodeChildByName(this.bodyNode,"tex_panZi", cc.Animation);
        this.plateNode = getNodeChildByName(this.plate.node,"panZi");
        this.bodyPlate[0] = getNodeChildByName(this.bodyNode,"tex_xiaoPanZi_zhong");
        this.bodyPlate[1] = getNodeChildByName(this.bodyNode,"tex_xiaoPanZi_zuo");
        this.bodyPlate[2] = getNodeChildByName(this.bodyNode,"tex_xiaoPanZi_you");
        this.bubble = getNodeChildByName(this.bodyNode,"tex_qiPao", cc.Animation);
        this.bread = getNodeChildByName(this.bodyNode,"tex_zhongP_wuti");
        this.vegetables = getNodeChildByName(this.bodyNode,"tex_zuoP_wuti");
        this.meat = getNodeChildByName(this.bodyNode,"tex_youP_wuti");
        this.guide = getNodeChildByName(element,"guide");
        this.guideMask = getNodeChildByName(this.guide, "guideMask");
        this.finger = getNodeChildByName(this.guide, "finger", cc.Animation);
        this.submitAni = getNodeChildByName(element,"interactive_anNiu",cc.Animation);
        this.submitBtn = getNodeChildByName(this.submitAni.node,"tex_tiJiao_anNiu/anNiu_cai");
        this.great = getNodeChildByName(element,"great", cc.Animation);
        this.miss = getNodeChildByName(element,"miss", cc.Animation);
        this.addEvents();

    }

    // 添加事件
    private addEvents() {
        this.bread.on(cc.Node.EventType.TOUCH_START, this.bodyStart, this);
        this.vegetables.on(cc.Node.EventType.TOUCH_START, this.bodyStart, this);
        this.meat.on(cc.Node.EventType.TOUCH_START, this.bodyStart, this);
        this.bread.on(cc.Node.EventType.TOUCH_MOVE, this.bodyMove, this);
        this.vegetables.on(cc.Node.EventType.TOUCH_MOVE, this.bodyMove, this);
        this.meat.on(cc.Node.EventType.TOUCH_MOVE, this.bodyMove, this);
        this.bread.on(cc.Node.EventType.TOUCH_END, this.bodyEnd, this);
        this.vegetables.on(cc.Node.EventType.TOUCH_END, this.bodyEnd, this);
        this.meat.on(cc.Node.EventType.TOUCH_END, this.bodyEnd, this);
        
        this.bubble.on(cc.Animation.EventType.FINISHED, ()=>{
            this.bubbleFinished();
        });
        this.finger.on(cc.Animation.EventType.FINISHED,()=>{
        });

        this.submitBtn.on(cc.Node.EventType.TOUCH_START, this.submit, this);
    }

    // 移除事件
    private removeEvents() {
        this.bread.off(cc.Node.EventType.TOUCH_START, this.bodyStart, this);
        this.vegetables.off(cc.Node.EventType.TOUCH_START, this.bodyStart, this);
        this.meat.off(cc.Node.EventType.TOUCH_START, this.bodyStart, this);
        this.bread.off(cc.Node.EventType.TOUCH_MOVE, this.bodyMove, this);
        this.vegetables.off(cc.Node.EventType.TOUCH_MOVE, this.bodyMove, this);
        this.meat.off(cc.Node.EventType.TOUCH_MOVE, this.bodyMove, this);
        this.bread.off(cc.Node.EventType.TOUCH_END, this.bodyEnd, this);
        this.vegetables.off(cc.Node.EventType.TOUCH_END, this.bodyEnd, this);
        this.meat.off(cc.Node.EventType.TOUCH_END, this.bodyEnd, this);
        
        this.bubble.off(cc.Animation.EventType.FINISHED, ()=>{
            this.bubbleFinished();
        });
        this.finger.off(cc.Animation.EventType.FINISHED,()=>{
        });

        this.submitBtn.off(cc.Node.EventType.TOUCH_START, this.submit, this);
    }

    start () {
        for(let i = 0; i < 3; i++) {
            this.order.push(i);
            this.bodyList[i] = i;
        }
        LegoSyncIns.instance.setReceiveCB(this.receive.bind(this));
        LegoSyncIns.instance.setRefreshCB(this.refresh.bind(this));
    }

    // 处理消息返回
    receive(data) {
        if(data.bodyClick) {
            this.removeEvents();
            this.curBody = getNodeChildByName(this.bodyNode,data.bodyClick.name);
            this.curBody.getComponent(cc.Animation).play("item_click");
            if(this.guideMask.active) this.guideMask.active = false;
            if(!this.bTitleOut) {
                this.bTitleOut = true;
                this.title.play("tiMu_out");
            }
        }else if(data.bodyMove) {
            this.title.node.active = false;
            this.guideMask.active = false;
            let info = data.bodyMove;
            this.bIsMoveEnd = info.bIsMoveEnd;
            this.curBody = getNodeChildByName(this.bodyNode,data.bodyMove.name);
            this.curBody.setPosition(info.pos);
            this.curBody.zIndex = 100; 
            this.curBody.getChildByName("yinYing").active = false;
            this.playPlateAnim(info.result);
        }else if(data.bodyEnd) {
            if(this.bIsMoveEnd) return;
            this.bIsMoveEnd = data.bodyEnd.bIsMoveEnd;
            this.curBody = getNodeChildByName(this.bodyNode,data.bodyEnd.name);
            this.curBodyOrder = data.bodyEnd.curBodyOrder;
            this.curBodyIndex = data.bodyEnd.curBodyIndex;
            this.bodyList = data.bodyEnd.bodyList;
            this.bodyPos = data.bodyEnd.bodyPos;
            this.bodyEndFinish(data.bodyEnd.pos);
        }else if(data.submit) {
            if(this.bIsSubmit) return;
            this.bIsSubmit = data.submit.bIsSubmit;
            this.submitFinish(data.submit.isGreat);
        }
    }

    // 刷新消息返回
    refresh(data) {
        let refreshData = data.data;
        if(!refreshData) return;
        if(refreshData.bodyClick) {
            this.curBody = getNodeChildByName(this.bodyNode,refreshData.bodyClick.name);
            this.curBody.getComponent(cc.Animation).play("item_click");
            if(this.guideMask.active) this.guideMask.active = false;
            if(!this.bTitleOut) {
                this.bTitleOut = true;
                this.title.play("tiMu_out");
            }
        } else if(refreshData.bodyMove) {
            this.title.node.active = false;
            this.guideMask.active = false;
            let info = refreshData.bodyMove;
            this.bIsMoveEnd = refreshData.bIsMoveEnd;
            this.curBody = getNodeChildByName(this.bodyNode,refreshData.bodyMove.name);
            this.curBody.setPosition(info.pos);
            this.curBody.zIndex = 100; 
            this.curBody.getChildByName("yinYing").active = false;
            this.playPlateAnim(info.result);
        } else if(refreshData.bodyEnd) {
            this.title.node.active = false;
            this.guideMask.active = false;
            if(this.bIsMoveEnd) return;
            this.bIsMoveEnd = refreshData.bIsMoveEnd;
            this.curBody = getNodeChildByName(this.bodyNode,refreshData.bodyEnd.name);
            this.curBodyOrder = refreshData.bodyEnd.curBodyOrder;
            this.curBodyIndex = refreshData.bodyEnd.curBodyIndex;
            this.bodyList = refreshData.bodyEnd.bodyList;
            this.bodyPos = refreshData.bodyEnd.bodyPos;
            this.setBodyPlate();
            this.bodyEndFinish(refreshData.bodyEnd.pos);
            this.playSettleAnim();
        } else if(refreshData.submit) {
            if(this.bIsSubmit) return;
            this.bIsSubmit = refreshData.submit.bIsSubmit;
            this.title.node.active = false;
            this.guideMask.active = false;
            this.curBodyOrder = refreshData.submit.curBodyOrder;
            this.bodyList = refreshData.submit.bodyList;
            this.setBodyPlate();
            this.playSettleAnim();
            this.submitFinish(refreshData.submit.isGreat);
        }
    }

    // 气泡动画完成
    private bubbleFinished() {
        if(!this.bIsSubmit)
            this.bubble.play("qiPao_xunHuan");
    }

    // 物体点击
    private bodyStart(event: any) {
        this.curBody = event.target;
        if(this.curBody.name === "tex_zhongP_wuti") this.curBodyIndex = 0;
        else if(this.curBody.name === "tex_zuoP_wuti") this.curBodyIndex = 1;
        else if(this.curBody.name === "tex_youP_wuti") this.curBodyIndex = 2;
        let index = this.bodyList.indexOf(this.curBodyIndex);
        if(index > -1) this.bodyList[index] = -1;
        this.curBodyListIdx = index > -1 ? index : -1;
        this.bodyPos = this.curBody.getPosition();
        this.curBody.getComponent(cc.Animation).play("item_click");
        if(this.guideMask.active) this.guideMask.active = false;
        if(!this.bTitleOut) {
            this.bTitleOut = true;
            this.title.play("tiMu_out");
        }
        LegoSyncIns.instance.sendStatus({bodyClick: {name:this.curBody.name}});
    }

    // 物体移动
    private bodyMove(event: any) {
        let pos = event.getLocation();
        pos = this.node.convertToNodeSpaceAR(pos);
        this.curBody.setPosition(pos);
        this.curBody.zIndex = 100;
        this.curBody.getChildByName("yinYing").active = false;
        let result = this.plateNode.getBoundingBoxToWorld().contains(event.getLocation());
        this.playPlateAnim(result);
        this.bIsMoveEnd = false;
        let data = {
            name: this.curBody.name,
            pos: pos, 
            result: result,
            bIsMoveEnd: this.bIsMoveEnd,
        }
        LegoSyncIns.instance.sendStatus({bodyMove: data});
    }

    // 物体移动完成
    private bodyEnd(event: any) {
        this.bIsMoveEnd = true;
        let data = {
            name: this.curBody.name,
            pos: event.getLocation(),
            curBodyOrder: this.curBodyOrder,
            curBodyIndex: this.curBodyIndex,
            bodyList: this.bodyList,
            bodyPos: this.bodyPos,
            bIsMoveEnd: this.bIsMoveEnd,
        }
        // 困难模式可能丢包
        for(let i = 0; i < 10; i++) {
            LegoSyncIns.instance.sendStatus({bodyEnd: data});
        }
        this.bodyEndFinish(event.getLocation());
    }

    // 物体移动完成同步
    private bodyEndFinish(pos) {
        this.curBody.zIndex = this.curBodyOrder.length;
        let result = this.plateNode.getBoundingBoxToWorld().contains(pos);
        if(result) {
            this.curBodyOrder.push(this.curBodyIndex);
            this.curBodyNode.push(this.curBody);
            this.curBody.setPosition(this.plate.node.getPosition());
            this.playSettleAnim();
            this.playPlateAnim(false);
            if(this.curBodyOrder.length === this.order.length) {
                this.submitBtn.active = true;
                this.submitAni.play("anNiuBianSe");
            }
        } else {
            let isContains = false;
            let containsIndex = 0;
            for(let i = 0; i < this.bodyPlate.length; i++) {
                if(this.bodyPlate[i].getBoundingBoxToWorld().contains(pos)) {
                    isContains = true;
                    containsIndex = i;
                    break;
                }
            }
            if(isContains) {
                if(this.bodyList[containsIndex] < 0){
                    let index = this.curBodyOrder.indexOf(this.curBodyIndex);
                    if(index > -1){
                        this.curBodyOrder.splice(index,1);
                        this.curBodyNode.splice(index,1);
                    }
                    this.bodyList[containsIndex] = this.curBodyIndex;
                    this.curBody.setPosition(this.bodyPlate[containsIndex].getPosition());
                    this.curBody.getChildByName("yinYing").active = true;
                    if(this.submitBtn.active) this.submitBtn.active = false;
                    return;
                }
            }
            if(this.curBodyListIdx >- 1) this.bodyList[this.curBodyListIdx] = this.curBodyIndex;
            this.curBody.setPosition(this.bodyPos);
            let orderLength = this.curBodyOrder.length;
            if(orderLength > 0 && this.curBodyIndex === this.curBodyOrder[orderLength - 1]) {
                this.playSettleAnim();
            } else {
                this.curBody.getChildByName("yinYing").active = true;
            }
        }
        
    }

    // 播放或暂停盘子动画
    private playPlateAnim(isPlay:Boolean) {
        let isPlaying = this.plate.getAnimationState("big_plate_in_effect").isPlaying;
        if(isPlay) {
            if(!isPlaying) {
                getNodeChildByName(this.plate.node,"panZi_faGuang").active = true;
                this.plate.play("big_plate_in_effect");
            }
        } else {
            if(isPlaying) {
                getNodeChildByName(this.plate.node,"panZi_faGuang").active = false;
                this.plate.stop();
            }
        }
    }

    // 提交
    private submit() {
        this.removeEvents();
        this.bIsSubmit = true;
        let isGreat = this.curBodyOrder.toString() === this.order.toString();
        let submitData = {
            isGreat: isGreat,
            curBodyOrder: this.curBodyOrder,
            bodyList: this.bodyList,
            bIsSubmit: this.bIsSubmit,
        }
        // 困难模式可能丢包
        for(let i = 0; i < 10; i++) {
            LegoSyncIns.instance.sendStatus({submit: submitData});
        }
        this.submitFinish(isGreat);
    }

    // 提交完成
    private submitFinish(isGreat) {
        this.submitAni.play("dianJiAnNiu");
        this.bubble.play("qiPao_out");
        this.submitAni.on(cc.Animation.EventType.FINISHED,()=>{
            this.submitAni.node.active = false;
        });
        if(isGreat) {
            this.great.node.active = true;
            this.great.play();
        } else {
            this.miss.node.active = true;
            this.miss.play();
        }
    }

    // 播放放入动画
    private playSettleAnim() {
        for(let i = 0; i < this.curBodyNode.length; i++) {
            this.curBodyNode[i].getComponent(cc.Animation).play("item_settle");
            this.curBodyNode[i].getChildByName("yinYing").active = false;
        }
    }

    // 重连设置物体所在的盘子
    private setBodyPlate() {
        let node = [this.bread,this.vegetables,this.meat];
        for(let i = 0; i < this.bodyList.length; i++) {
            if(this.bodyList[i] > -1) {
                node[this.bodyList[i]].setPosition(this.bodyPlate[i].getPosition());
            }
        }
        for(let i = 0; i < this.curBodyOrder.length; i++) {
            node[this.curBodyOrder[i]].setPosition(this.plate.node.getPosition());
            node[this.curBodyOrder[i]].zIndex = i;
            node[this.curBodyOrder[i]].getChildByName("yinYing").active = false;
            this.curBodyNode.push(node[this.curBodyOrder[i]]);
        }
    }
}
