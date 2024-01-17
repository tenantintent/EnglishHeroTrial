//=============================================================================
// RPG Maker MZ Chimaki_MsgTool.js
// Version: 1.0
//=============================================================================
/*:
 * @target MZ
 * @plugindesc one times center msg
 * @author Chimamki
 * @url http://www.chimakier.com
 * 
 * @command toCenter
 * @text msg center one times
 * @desc msg center one times
 * 
 * 
 * 
 * @help 
 * use plugins command , then one times center msg 
 * 
 * 
*/


/*:zh_TW
 * @target MZ
 * @plugindesc one times center msg
 * @author Chimaki
 * @url http://www.chimakier.com
 * 
 * @command toCenter
 * @text msg center one times
 * @desc msg center one times
 * 
 * 
 * 
 * @help 
 * 用插件指令可以啟用一次性的對話置中
 * 
 * 
*/



var alias = alias || {};
alias.windowMsgTool = alias.windowMsgTool || {};
(() => {
    'use strict'
    const pluginName = 'Chimaki_MsgTool';
    var center = false;
    PluginManager.registerCommand(pluginName, "toCenter", args => {
        center = true;
    });
    
    alias.windowMsgTool.msgWindowInitMember = Window_Message.prototype.initMembers;
    Window_Message.prototype.initMembers = function() {
        this._needCenter = 
        alias.windowMsgTool.msgWindowInitMember.call(this);

    };
    alias.windowMsgTool.msgWindowNewPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        alias.windowMsgTool.msgWindowNewPage.call(this, textState);
        if (this.needCenter()) {
            textState.x = this.contents.width / 2 - this.textWidth(this._textState.text) / 2;
            textState.y = (this.contents.height / 2) - (this._textState.height / 2);   
            center = false;
        }  
    };

    Window_Message.prototype.needCenter = function (){
        return center;
    }

})()

