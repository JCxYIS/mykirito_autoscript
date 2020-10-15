// ==UserScript==
// @name         MyKirito Auto Action
// @namespace    https://github.com/JCxYIS/mykirito_autoscript
// @version      2.0
// @description  我的第一支油猴腳本，所以很破對不起。總之：自律行動，當心被抓。
// @author       JCxYIS
// @match        https://mykirito.com/*
// @grant        none
// @updateURL    https://github.com/JCxYIS/mykirito_autoscript/raw/master/MyKiritoAutoAction.js
// ==/UserScript==

(function()
{
    'use strict';


    // 參數
    const ACTION_NAME_LIST = ["狩獵兔肉", "自主訓練", "外出野餐", "汁妹", "做善事", "坐下休息", "釣魚"];
    const BATTLE_NAME_LIST = ["友好切磋", "認真對決", "決一死戰", "我要超渡你"];
    const BUTTON_AVAILABLE_CLASSNAME = "sc-AxgMl llLWDd";
    const BUTTON_DISABLED_CLASSNAME = "sc-AxgMl kPlkaT";
    const H3_CLASSNAME = "sc-fznyAO CWQMf";
    const CONTAINER_CLASSNAME = "sc-fzokOt hLgJkJ";
    const BATTLE_CONTAINER_CLASSNAME = "sc-fzplWN hRBsWH";
    const INJECTION_CLASSNAME = "sc-fzplWN hRBsWH";


    // 變數
    var inject;
    var title;
    var subtitle1;
    var subtitle2; // -
    var myFunctionButtons = []; // - 實際上只會動最後兩個 lol

    // 進入點 小夫
    setInterval ( function ()
        {
            if ( this.lastPath != location.pathname )
            {
                this.lastPath = location.pathname;
                console.log("SWITCH!："+location.pathname);
                EndRecursive();
                main ();
            }
        }
        , 1000
    );



    // 主函式
    function main()
    {
        // 先決定我們在哪個頁面
        let usingActionList = [];
        let usingInjectionPos;
        let usingInjectionOrder;
        if(location.pathname == "/")
        {
            usingActionList = ACTION_NAME_LIST;
            usingInjectionPos = document.getElementsByClassName(BATTLE_CONTAINER_CLASSNAME)[0].parentNode;
            usingInjectionOrder = 4;
        }
        else if (location.pathname.startsWith("/profile/"))
        {
            usingActionList = BATTLE_NAME_LIST;
            usingInjectionPos = document.getElementsByClassName(BATTLE_CONTAINER_CLASSNAME)[0].parentNode;
            usingInjectionOrder = 2;
        }
        else
        {
            // 不是可以自動的地方就滾
            return;
        }

        // 綁定按紐們
        let allbuttons = document.getElementsByTagName('button');
        let actionButtons = [];
        myFunctionButtons = [];
        for(let i = 0; i < allbuttons.length; i++)
        {
            for(let j = 0; j < usingActionList.length; j++)
            {
                if(allbuttons[i].innerText == usingActionList[j] && allbuttons[i].offsetParent === null) /*.parentElement.style.display != "none"*/
                {
                    actionButtons.push(allbuttons[i]);
                    continue;
                }
            }
        }

        // 製作選單
        inject = document.createElement('div');
        title = document.createElement("h3");
        subtitle1 = document.createElement('p');
        subtitle2 = document.createElement('p');

        usingInjectionPos.insertBefore(inject, usingInjectionPos.childNodes[usingInjectionOrder])//.appendChild(inject);
        inject.appendChild(title);
        inject.appendChild(subtitle1);
        inject.appendChild(subtitle2);

        inject.classList = INJECTION_CLASSNAME;
        title.classList = H3_CLASSNAME;
        title.innerHTML = "自律行動";
        subtitle1.innerHTML = "自動點按行動按鍵，當按鈕能被按下時就會按下。<span style='color:yellow'>注意：這就是團長說的腳本了，出事請自行負責。</span>";

        // 創建剛綁好的按鈕
        for(let i = 0; i < actionButtons.length; i++)
        {
            //console.log("按鈕名稱："+buttons[i].innerHTML);

            let newButt = document.createElement('button');
            newButt.classList = BUTTON_AVAILABLE_CLASSNAME;
            newButt.innerHTML = ""+actionButtons[i].innerHTML;
            newButt.onclick = ()=>{ StartRecursive(actionButtons[i]); }
            inject.appendChild(newButt);
            myFunctionButtons.push(newButt);
        }
        inject.appendChild(document.createElement('br'));
        // 止，吾止也
        let newButt = document.createElement('button');
        newButt.innerHTML = "停止";
        newButt.classList = BUTTON_AVAILABLE_CLASSNAME;
        newButt.onclick = ()=>{ EndRecursive(); }
        inject.appendChild(newButt);
    }



    // 以下是功能
    var recursiveTimerId;
    var clickCombo = 0;
    var clickComboTotal = 0;
    var continuousInvalidClick = 0;
    var isLastActionClick = false;

    function StartRecursive(butt)
    {
        console.log("開始遞迴！按鈕 "+butt.innerHTML);
        EndRecursive();
        for(var i = 0; i < myFunctionButtons.length; i++)
        {
            myFunctionButtons[i].classList = BUTTON_DISABLED_CLASSNAME;
        }
        Recursive(butt);
    }
    function Recursive(butt)
    {
        // Random: 15~30秒檢查一次
        let nextTime = 15000+Math.random()*15000;


        if(butt.disabled || butt.classList == BUTTON_DISABLED_CLASSNAME)
        {
            // 仍在鎖，不能按
            isLastActionClick = false;
            continuousInvalidClick = 0;

            console.log("按鈕不能按！ 下次檢查時間(n秒後)："+nextTime/1000);
        }
        else
        {
            // 按下去！
            butt.click();
            clickCombo++;
            clickComboTotal++;
            if(isLastActionClick)
            {
                continuousInvalidClick++;
            }
            isLastActionClick = true;

            console.log(clickCombo+"("+clickComboTotal+") combo!! "+butt.innerHTML + "\n下次檢查時間(n秒後)："+nextTime/1000);
            console.log(butt);
        }

        if(continuousInvalidClick < 5)
        {
            recursiveTimerId = setTimeout( ()=>{Recursive(butt)} , nextTime);
        }
        else
        {
            console.warn("無效點擊達 5 次。請重新執行！");
            EndRecursive();
        }

        subtitle2.innerHTML = "自律行動執行中，點擊【"+butt.innerHTML+"】，已點擊了 "+clickCombo+" ("+clickComboTotal+") 次！";
        if(continuousInvalidClick > 0)
            subtitle2.innerHTML += "<br><span style='color:yellow'>連續點擊次數( 5 次將會暫停腳本)："+continuousInvalidClick+" / 5";
    }
    function EndRecursive()
    {
        window.clearTimeout(recursiveTimerId);
        clickCombo = 0;
        continuousInvalidClick = 0;
        isLastActionClick = false;
        for(var i = 0; i < myFunctionButtons.length; i++)
        {
            myFunctionButtons[i].classList = BUTTON_AVAILABLE_CLASSNAME;
        }
        if(subtitle2)
            subtitle2.innerHTML = "";
        console.log("停止遞迴；清除參數。");
    }
}
)();