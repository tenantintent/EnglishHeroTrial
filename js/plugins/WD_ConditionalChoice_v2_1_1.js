//=============================================================================
// Plugin Name: Conditional Choice rules
// Author: Winthorp Darkrites (Winter Dream Games Creator)
// Description: Let the developer disable or hide choices in the "Show Choice" menu based on switches and variables.
// Terms of Use: By using this plugin you agree at our ToU (https://drive.google.com/file/d/1lG2Lep2Unme80ghZD7-fA-hPGWKLsiR7/view)
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Allow to input a check in the "Show Choice" that disables or hide the choice.
 * @author Winthorp Darkrites
 * @url https://www.patreon.com/WinterDreamGamesCreator
 *
 * @param disabledSE
 * @text Disabled Choice SE
 * @type file
 * @dir audio/se
 * @desc The sound effect to play when a player clicks on a Disabled choice (blank for none)
 * @default
 * 
 * @param hiddenDefault
 * @text Hidden Default
 * @type select
 * @option Do not choose any option ("None Default")
 * @value hidden1
 * @option Select the first option
 * @value hidden2
 * @option Select next (if possible)
 * @value hidden3
 * @option Select previous (if possible)
 * @value hidden4
 * @desc What happens if the default choice is hidden?
 * @default hidden1
 *
 * @param alternativeText
 * @text Disabled Alternative Text
 * @type struct<disableText>[]
 * @desc Show an alternative Text when disabled
 * @default []
 *
 * @param errorHandling
 * @text Error Handling
 * @type select
 * @option Skip the rule and ignore it (Warning in console)
 * @value error1
 * @option Consider the rule to be false (Warning in console)
 * @value error2
 * @option Generate an Error (will crash the game)
 * @value error3
 * @desc What happens if a hidden/disabled formula is wrong?
 * @default error1
 *
 * @help WD_ConditionalChoice.js
 *
 * This plugin edits the Choice display of RPG Maker MZ based on
 * given conditions by the developer.
 * 
 * How to use:
 * 
 * If you want to add a condition to check to DISABLE a choice 
 * use this format: <<[condition]>>Choice Text.
 *
 * If you want to add a condition to check to HIDE a choice use
 * this format (([condition]))Choice Text.
 *
 * If you want to add both, the order is not important as long as
 * they are before the text: <<[condition]>>(([condition]))Text is 
 * ok as (([condition]))<<[condition]>>Text
 *
 * IMPORTANT: Do NOT place spaces in the conditions formatting as
 * it will result in an error.
 *
 * You can add as many conditions as you like as long as they are 
 * separated by a comma, if ALL of the conditions are TRUE then the 
 * choice will be disabled or hidden.
 *
 * Conditions List and their use:
 *
 * - Switch: Use the format s[#] (where # is the switch number) to
 *           check if a switch is ON, use !s[#] to check if a switch 
 *           is OFF. Example: (([s[3],!s[4]]))Hello will hide the 
 *           choice "Hello" if Switch 3 is ON and Switch 4 is off
 * - Variables: Use the format v[#] followed by the math operators
 *              = (equal), != (not equal), > (greater), >= (greater 
 *              or equal), < (lesser) or <= (lesser or equal) and 
 *              the second operator to check (can be another v[#],
 *              a fixed integer or g (for gold).
 *              Example: v[65]<70 checks if Variable 65 is lesser 
 *              than 70. !v[4]>g checks if it's FALSE that variable 
 *              4 is greater than party gold.
 * - Gold: Simply use g for party gold, the use is the same as
 *         variables explained above.
 * - Actor in party: Use p[#] where # is the Actor Database ID to 
 *                   check if the actor is in the party at the moment
 *                   of the choice. Use negative operator !p[#] to
 *                   check if Actor is NOT in the party.
 * - Inventory: Use i[#], w[#] or a[#] to check on Item, Weapons or
 *              Armors where # is the corresponding Item/Weapon/Armor
 *              ID number in the database. You can use this command 
 *              as is to check if the party has the corresponding
 *              item in inventory (equipped weapons and armors are 
 *              checked). Example: i[55] checks if Item 55 is in 
 *              inventory, !a[4] checks if Armor 4 is NOT in inventory
 *              (nor equipped).
 *              You can also add a math operation as explained in Variables
 *              in this case the plugin will count all the items and 
 *              perform a math operation. i[6]>=v[4] checks if Item 6 is
 *              greater or equal than variable 4.
 *
 *
 * Text change for Disabled choices:
 *
 * From the plugin parameters it's possible to add a text code that will 
 * generate a text if the choice is normal and another text if the choice 
 * is disabled.
 *
 * Example: Code: DISABLETEXT001, Default Text: This Choice is Enabled,
 *          Disabled Text: This Choice is Disabled.
 *
 * To use it simply write a choice with the following text:
 * <<[conditions]>>DISABLETEXT001
 *
 * If choice is enbaled the player will see "This Choice is Enabled",
 * otherwise the player will see "This Choice is Disabled".
 *
 * WARNING: DO NOT CREATE A SITUATION WHERE ALL THE CHOICES ARE HIDDEN 
 *          AS IT WILL RESULT IN AN EMPTY CHOICE WINDOW WITHOUT POSSIBILITY 
 *          TO EXIT. AS WELL, IF ALL OPTIONS ARE DISABLED, BE SURE TO HAVE 
 *          A CONDITIONAL BRANCH ESCAPE 
 * 
 * You can find more scripts and games on my Patreon page:
 * https://www.patreon.com/WinterDreamGamesCreator
 * 
 * //////////////////////////////////////////////////
 * VERSION 1.1:
 * - Fixed the height of the Show Choice Window
 * 
 * 
 * VERSION 1.2:
 * - Removed the HIDE functionality due to big indexing problems
 * - Now using the "escape choice" functionality doesn't 
 *   ovverride the plugin
 * - Using the action button while there is no choice selected
 *   no longer cause to skip the Show Choice event
 * - Trimming of the <<[ and ]>> tags are now limited to the
 *   Show Choice box
 *
 * VERSION 2.0:
 * - 100% rework of the code, it has been rebuilt from scratch
 * - Kept retro-compatibility with previous versions
 * - Return of the HIDE funtionality, now perfectly working (use (([ 
 *   and ])) for hide conditions.
 * - Plugin now support more conditions check! (Actors in party, Items
 *   in inventory, gold carried)
 * - Added plugin parameters to personalize buzzer sound and handle 
 *   default selection in case it falls on an hidden choice.
 * - Added the possibility to change the text of a disabled choice 
 *
 * VERSION 2.1:
 * - Changed the rules check mechanism from string reader to RegEx
 * - Fixed a bug that wouldn't retrieve armors data
 * - Fixed a bug that prevents the correct execution of the rule
 *   if a negative number was used (Thanks to alistor1213 for the report)
 * - Now it allows to use items quantity as second operator
 * - Added Error Handling option for wrong or broken formulas
 * VERSION 2.1.1:
 * - Hotfix for v2.1, the rule check were giving the oppostire result
 *   (Thanks again to alistor1213)
 * //////////////////////////////////////////////////
 *
 */
 /*~struct~disableText:
 * @param textCode
 * @text Text Code
 * @desc The text code to insert in the option. Example: <<[s[1]]>>CODE1
 * @default
 *
 * @param defaultText
 * @text Default Text
 * @desc The text that will be shown when enabled
 * @default
 *
 * @param disableText
 * @text Disabled Text
 * @desc The text that will be shown when disabled
 * @default
 */

!function(){const params=PluginManager.parameters("WD_ConditionalChoice"),disabledSE=params.disabledSE||"",hiddenDefault=params.hiddenDefault||"hidden1",disableTextCodes=disabledCodesStructurer(params.alternativeText),errorHandling=params.errorHandling||"error1";let choicesStructureRecorder=[],commandListArray=[];const choicesDefaultOptions={defaultChoice:-1,cancelChoice:-1},callingWindowResize={flag:!1,rows:0};let moddedChoice=!1;function choicesAnalyzer(e){if(e._choices.length>0){choicesStructureRecorder=[];for(let r=0;r<e._choices.length;r++)choicesStructureRecorder.push({choiceText:e._choices[r],originalIndex:r,newIndex:-1,hidden:!1,disabled:!1});return choicesDefaultOptions.defaultChoice=e._choiceDefaultType,choicesDefaultOptions.cancelChoice=e._choiceCancelType,stringCodeReader(),newChoiceIndex(),choiceTextManager(),commandListArrayBuilder(),!0}return!1}function stringCodeReader(){for(const e of choicesStructureRecorder)if(e.choiceText.includes("<<[")&&e.choiceText.includes("]>>")&&e.choiceText.includes("(([")&&e.choiceText.includes("]))"))if(e.choiceText.startsWith("<<[")){let r=e.choiceText.replace("<<[","");const n=r.split("]>>"),o=n[0];if(n[1].startsWith("(([")){const t=(r=n[1].replace("(([","")).split("]))"),c=t[0];r=t[1];const s=rulesChecker(o,c,"Both");e.disabled=s.disabled,e.hidden=s.hidden,e.choiceText=r}else console.warn("Plugin Choice Code in illegal position for choice: "+e.choiceText)}else if(e.choiceText.startsWith("(([")){let r=e.choiceText.replace("(([","");const n=r.split("]))"),o=n[0];if(n[1].startsWith("<<[")){const t=(r=n[1].replace("<<[","")).split("]>>"),c=t[0];r=t[1];const s=rulesChecker(c,o,"Both");e.disabled=s.disabled,e.hidden=s.hidden,e.choiceText=r}else console.warn("Plugin Choice Code in illegal position for choice: "+e.choiceText)}else console.warn("Plugin Choice Code in illegal position for choice: "+e.choiceText);else if(e.choiceText.includes("<<[")&&e.choiceText.includes("]>>"))if(e.choiceText.startsWith("<<[")){const r=e.choiceText.replace("<<[","").split("]>>"),n=rulesChecker(r[0],"","Disable");e.disabled=n.disabled,e.choiceText=r[1]}else console.warn("Plugin Choice Code in illegal position for choice: "+e.choiceText);else if(e.choiceText.includes("(([")&&e.choiceText.includes("]))"))if(e.choiceText.startsWith("(([")){const r=e.choiceText.replace("(([","").split("]))"),n=rulesChecker("",r[0],"Hide");e.hidden=n.hidden,e.choiceText=r[1]}else console.warn("Plugin Choice Code in illegal position for choice: "+e.choiceText)}function rulesChecker(e,r,n){const o={hidden:!1,disabled:!1};let t,c;switch(n){case"Both":t=e.split(","),c=r.split(","),o.disabled=rulesValidator(t),o.hidden=rulesValidator(c);break;case"Disable":t=e.split(","),o.disabled=rulesValidator(t);break;case"Hide":c=r.split(","),o.hidden=rulesValidator(c)}return o}function rulesValidator(checkArray){let result=!0;for(const rule of checkArray){const regex=/[sviwap]\[\d+\]|g|===|==|<=|>=|!==|!=|=|<|>|[-+]?\d+/g,regexMatch=rule.match(regex),firstInvCheck={isInInventory:!1,quantity:0},secondInvCheck={isInInventory:!1,quantity:0};let isNegative=!1,ruleResult=!1,ruleCheckFinished=!1,optionalAddedRule=!1,mathematicalOperator="",firstOperandResult=null,secondOperandResult=null;if(null===regexMatch){const e="WD_ConditionalChoices: Couldn't find a valid rule for "+rule+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}if(1!==regexMatch.length&&3!==regexMatch.length){const e="WD_ConditionalChoices: Unexpected matches number for rule "+rule+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}let noLeftOver=rule;const replacedStrings=[];for(const e of regexMatch){const r=noLeftOver.replace(e,"");replacedStrings.push(r),noLeftOver=r}if(noLeftOver=replacedStrings[replacedStrings.length-1],""!==noLeftOver&&"!"!==noLeftOver){const e="WD_ConditionalChoices: Unexepected characters in rule "+rule+"! The following characters aren't processed "+noLeftOver+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}"!"===noLeftOver&&(isNegative=!0);const firstOperand=regexMatch[0],secondLevelRegex=/[sviwapg]|[-+]?\d+/g,secondLevelregexMatch=firstOperand.match(secondLevelRegex);if(null===secondLevelregexMatch){const e="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}switch(secondLevelregexMatch[0]){case"s":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&parseInt(secondLevelregexMatch[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const e=parseInt(secondLevelregexMatch[1]),r=$gameSwitches.value(e);ruleResult=isNegative?!r:r,ruleCheckFinished=!0;break;case"v":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&parseInt(secondLevelregexMatch[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const n=parseInt(secondLevelregexMatch[1]);firstOperandResult=$gameVariables.value(n);break;case"i":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&parseInt(secondLevelregexMatch[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const o=parseInt(secondLevelregexMatch[1]);firstInvCheck.isInInventory=$gameParty.hasItem($dataItems[o]),firstInvCheck.quantity=$gameParty.numItems($dataItems[o]),firstOperandResult=firstInvCheck.quantity,optionalAddedRule=!0;break;case"w":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&parseInt(secondLevelregexMatch[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const t=parseInt(secondLevelregexMatch[1]);firstInvCheck.isInInventory=$gameParty.hasItem($dataWeapons[t]),firstInvCheck.quantity=$gameParty.numItems($dataWeapons[t]),firstOperandResult=firstInvCheck.quantity,optionalAddedRule=!0;break;case"a":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&parseInt(secondLevelregexMatch[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const c=parseInt(secondLevelregexMatch[1]);d,firstInvCheck.isInInventory=$gameParty.hasItem($dataArmors[c]),firstInvCheck.quantity=$gameParty.numItems($dataArmors[c]),firstOperandResult=firstInvCheck.quantity,optionalAddedRule=!0;break;case"p":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&parseInt(secondLevelregexMatch[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const s=parseInt(secondLevelregexMatch[1]),i=$gameParty._actors;let a=!1;for(const e of i)e===s&&(a=!0);ruleResult=isNegative?!a:a,ruleCheckFinished=!0;break;case"g":if(1!==secondLevelregexMatch.length){const e="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}firstOperandResult=$gameParty.gold();break;default:const l="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(l);continue;case"error2":console.warn(l),result=!1;continue;case"error3":throw new Error(l)}}if(!ruleCheckFinished)if(optionalAddedRule&&1===regexMatch.length)ruleResult=isNegative?!firstInvCheck.isInInventory:firstInvCheck.isInInventory,ruleCheckFinished=!0;else{const e=regexMatch[1];switch(e){case"=":case"==":case"===":mathematicalOperator="===";break;case">":case">=":case"<":case"<=":mathematicalOperator=e;break;case"!=":case"!==":mathematicalOperator="!==";break;default:const r="WD_ConditionalChoices: Couldn't find a valid math operator for rule "+rule+"! Current text is "+e+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(r);continue;case"error2":console.warn(r),result=!1;continue;case"error3":throw new Error(r)}}}if(!ruleCheckFinished){const secondOperand=regexMatch[2],secondLevelregexMatch2=secondOperand.match(secondLevelRegex);if(null===secondLevelregexMatch2){const e="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}switch(secondLevelregexMatch2[0]){case"g":if(1!==secondLevelregexMatch2.length){const e="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}secondOperandResult=$gameParty.gold();break;case"s":const e="WD_ConditionalChoices: Second Operand can't be a switch! Skipping rule "+rule+"!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}break;case"v":if(2!==secondLevelregexMatch2.length&&!isNaN(parseInt(secondLevelregexMatch2[1]))&&parseInt(secondLevelregexMatch2[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const r=parseInt(secondLevelregexMatch2[1]);secondOperandResult=$gameVariables.value(r);break;case"i":if(2!==secondLevelregexMatch2.length&&!isNaN(parseInt(secondLevelregexMatch2[1]))&&parseInt(secondLevelregexMatch2[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const n=parseInt(secondLevelregexMatch2[1]);secondInvCheck.isInInventory=$gameParty.hasItem($dataItems[n]),secondInvCheck.quantity=$gameParty.numItems($dataItems[n]),secondOperandResult=secondInvCheck.quantity;break;case"w":if(2!==secondLevelregexMatch2.length&&!isNaN(parseInt(secondLevelregexMatch2[1]))&&parseInt(secondLevelregexMatch2[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const o=parseInt(secondLevelregexMatch2[1]);d,secondInvCheck.isInInventory=$gameParty.hasItem($dataWeapons[o]),secondInvCheck.quantity=$gameParty.numItems($dataWeapons[o]),secondOperandResult=secondInvCheck.quantity;break;case"a":if(2!==secondLevelregexMatch2.length&&!isNaN(parseInt(secondLevelregexMatch2[1]))&&parseInt(secondLevelregexMatch2[1])>0){const e="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}const t=parseInt(secondLevelregexMatch2[1]);d,secondInvCheck.isInInventory=$gameParty.hasItem($dataArmors[t]),secondInvCheck.quantity=$gameParty.numItems($dataArmors[t]),secondOperandResult=secondInvCheck.quantity;break;case"p":const c="WD_ConditionalChoices: Second Operand can't be an Actor! Skipping rule "+rule+"!";switch(errorHandling){case"error1":console.warn(c);continue;case"error2":console.warn(c),result=!1;continue;case"error3":throw new Error(c)}break;default:if(isNaN(parseInt(secondLevelregexMatch2[0]))){const e="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(e);continue;case"error2":console.warn(e),result=!1;continue;case"error3":throw new Error(e)}}else secondOperandResult=parseInt(secondLevelregexMatch2[0])}const ruleMathFormula=firstOperandResult+mathematicalOperator+secondOperandResult,mathResultFormula=eval(ruleMathFormula);ruleResult=isNegative?!mathResultFormula:mathResultFormula}if(!ruleResult){result=!1;break}}return result}function choiceTextManager(){for(const e of disableTextCodes)for(const r of choicesStructureRecorder)r.choiceText===e.textCode&&r.disabled?r.choiceText=e.disableText:r.choiceText!==e.textCode||r.disabled||(r.choiceText=e.defaultText);for(const e of choicesStructureRecorder)if(e.disabled){const r=e.choiceText;e.choiceText="\\C[7]"+r}}function newChoiceIndex(){let e=0;for(let r=0;r<choicesStructureRecorder.length;r++)choicesStructureRecorder[r].hidden||(choicesStructureRecorder[r].newIndex=e,e++)}function commandListArrayBuilder(){commandListArray=[];for(const e of choicesStructureRecorder)e.hidden||commandListArray.push(e.choiceText);callingWindowResize.rows=commandListArray.length}function returnNextChoice(e){const r=choicesStructureRecorder.length-1,n={foundFlag:!1,foundIndex:-1};for(let o=e.originalIndex+1;o<=r;o++)for(const e of choicesStructureRecorder)if(!n.foundFlag&&e.originalIndex===o&&-1!==e.newIndex){n.foundFlag=!0,n.foundIndex=e.newIndex;break}return n}function returnPrevChoice(e){const r={foundFlag:!1,foundIndex:-1};for(let n=e.originalIndex-1;n>=0;n--)for(const e of choicesStructureRecorder)if(!r.foundFlag&&e.originalIndex===n&&-1!==e.newIndex){r.foundFlag=!0,r.foundIndex=e.newIndex;break}return r}function disabledCodesStructurer(e){let r,n=[];r=null==e?JSON.parse("[]"):JSON.parse(e);for(const e of r)n.push(JSON.parse(e));return n}const _alias_Window_ChoiceList_initialize=Window_ChoiceList.prototype.initialize;Window_ChoiceList.prototype.initialize=function(){_alias_Window_ChoiceList_initialize.call(this)},Window_ChoiceList.prototype.start=function(){this.updatePlacement(),this.updateBackground(),this.placeCancelButton(),this.createContents(),this.refresh(),this.scrollTo(0,0),this.selectDefault(),this.open(),this.activate()},Window_ChoiceList.prototype.selectDefault=function(){if(moddedChoice)if(-1===choicesDefaultOptions.defaultChoice||0===commandListArray.length)this.select(-1);else{let e;for(const r of choicesStructureRecorder)if(r.originalIndex===choicesDefaultOptions.defaultChoice){e=r;break}if(e)if(e.hidden)switch(hiddenDefault){case"hidden1":this.select(-1);break;case"hidden2":this.select(0);break;case"hidden3":const r=returnNextChoice(e);if(r.foundFlag)this.select(r.foundIndex);else{const r=returnPrevChoice(e);r.foundFlag?this.select(r.foundIndex):this.select(-1)}break;case"hidden4":const n=returnPrevChoice(e);if(n.foundFlag)this.select(n.foundIndex);else{const r=returnNextChoice(e);r.foundFlag?this.select(r.foundIndex):this.select(-1)}}else this.select(e.newIndex);else console.warn("Unexpected error selecting default Choice"),this.select(-1)}else this.select($gameMessage.choiceDefaultType())},Window_ChoiceList.prototype.makeCommandList=function(){const e=choicesAnalyzer($gameMessage),r=e?commandListArray:$gameMessage.choices();for(const e of r)this.addCommand(e,"choice");e&&(moddedChoice=!0,callingWindowResize.flag=!0,this.updatePlacement(),this.updateBackground(),this.placeCancelButton(),this.createContents())},Window_ChoiceList.prototype.drawItem=function(e){const r=this.itemLineRect(e);this.drawTextEx(this.commandName(e),r.x,r.y,r.width)},Window_ChoiceList.prototype.callOkHandler=function(){if(moddedChoice){const e=this.index();let r;for(const n of choicesStructureRecorder)if(e===n.newIndex){r=n;break}r?r.disabled?this.playCustomBuzzer():($gameMessage.onChoice(r.originalIndex),this._messageWindow.terminateMessage(),this.close()):console.error("Critical error in Choice Selection")}else $gameMessage.onChoice(this.index()),this._messageWindow.terminateMessage(),this.close()},Window_ChoiceList.prototype.playCustomBuzzer=function(){""!==disabledSE&&AudioManager.playSe({name:disabledSE,volume:100,pitch:100,pan:0})},Window_ChoiceList.prototype.callCancelHandler=function(){if(moddedChoice)if(-1!==choicesDefaultOptions.cancelChoice&&-2!==choicesDefaultOptions.cancelChoice){let e;for(const r of choicesStructureRecorder)if(r.originalIndex===choicesDefaultOptions.cancelChoice){e=r;break}e?e.hidden||e.disabled?this.playCustomBuzzer():($gameMessage.onChoice(e.originalIndex),this._messageWindow.terminateMessage(),this.close()):(console.error("Unexpected error finding cancel choice"),this.playCustomBuzzer())}else $gameMessage.onChoice($gameMessage.choiceCancelType()),this._messageWindow.terminateMessage(),this.close();else $gameMessage.onChoice($gameMessage.choiceCancelType()),this._messageWindow.terminateMessage(),this.close()},Window_ChoiceList.prototype.windowHeight=function(){return callingWindowResize.flag?this.fittingHeight(callingWindowResize.rows):this.fittingHeight(this.numVisibleRows())},Window_ChoiceList.prototype.maxChoiceWidth=function(){let e=96;if(callingWindowResize.flag){const r=commandListArray;for(const n of r){const r=this.textSizeEx(n).width,o=Math.ceil(r)+2*this.itemPadding();e<o&&(e=o)}return e}{const r=$gameMessage.choices();for(const n of r){const r=this.textSizeEx(n).width,o=Math.ceil(r)+2*this.itemPadding();e<o&&(e=o)}return e}}}();