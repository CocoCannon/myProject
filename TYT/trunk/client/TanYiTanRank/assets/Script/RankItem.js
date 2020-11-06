cc.Class({
    extends: cc.Component,
    // name: "RankItem",
    properties: {
        backSprite: cc.Node,
        rankLabel: cc.Label,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        topScoreLabel: cc.Label,
        topSprite: cc.Node,
    },
    start() {

    },

    init: function (rank, data) {
        let self = this;
        let avatarUrl = data.avatarUrl;
        // let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;

        if (rank % 2 == 0) {
            this.backSprite.color = new cc.Color(55, 55, 55, 255);
        }

        // if (rank == 0) {
        //     // this.rankLabel.node.color = new cc.Color(255, 0, 0, 255);
        //     // this.rankLabel.node.setScale(2);
        //     cc.loader.loadRes("res/danzhu_ph_disan", cc.SpriteFrame, function (err, spriteFrame) {
        //         self.topSprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        //     });
        // } else if (rank == 1) {
        //     // this.rankLabel.node.color = new cc.Color(255, 255, 0, 255);
        //     // this.rankLabel.node.setScale(1.6);
        // } else if (rank == 2) {
        //     // this.rankLabel.node.color = new cc.Color(100, 255, 0, 255);
        //     // this.rankLabel.node.setScale(1.3);
        // }
        if (rank < 3) {
            this.topSprite.active = true;
            this.rankLabel.node.active = false;
            let url = "res/top" + (rank + 1);
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                self.topSprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else {
            this.topSprite.active = false;
            this.rankLabel.node.active = true;
            this.rankLabel.string = (rank + 1).toString();
        }
        this.createImage(avatarUrl);
        this.nickLabel.string = nick;
        this.topScoreLabel.string = this.change(grade);
    },

    change(score) {
        return score > 100000 ? ((score / 10000).toFixed(0) + "万") : score;
    },

    loadImg() {

    },
    createImage(avatarUrl) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        // cc.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                // cc.log(e);
                this.avatarImgSprite.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

});