// ==UserScript==
// @name         MyKirito Auto Action
// @namespace    https://jcjc.cf/
// @version      1.3
// @description  我的第一支油猴腳本，所以很破對不起。
// @author       JCxYIS
// @match        https://mykirito.com/*
// @grant        none
// ==/UserScript==

(function() 
{
    'use strict';

    // 參數
    const ACTION_NAME_LIST = ["狩獵兔肉", "自主訓練", "外出野餐", "汁妹", "做善事", "坐下休息", "釣魚"];
    const BUTTON_AVAILABLE_CLASSNAME = "sc-AxgMl llLWDd";
    const BUTTON_DISABLED_CLASSNAME = "sc-AxgMl kPlkaT";
    const H3_CLASSNAME = "sc-fznyAO CWQMf";
    const CONTAINER_CLASSNAME = "sc-fzokOt hLgJkJ";
    
    const INJECTION_CLASSNAME = "sc-fzplWN hRBsWH"

    // 製作選單
    let inject = document.createElement('div');
    let title = document.createElement("h3");
    let subtitle1 = document.createElement('p');
    let subtitle2 = document.createElement('p');
    document.getElementsByClassName(CONTAINER_CLASSNAME)[0].insertBefore(inject, 
        document.getElementsByClassName(CONTAINER_CLASSNAME)[0].childNodes[2])//.appendChild(inject);
    inject.appendChild(title);
    inject.appendChild(subtitle1);
    inject.appendChild(subtitle2);
    inject.classList = INJECTION_CLASSNAME;
    title.classList = H3_CLASSNAME;
    title.innerHTML = "自律行動";
    subtitle1.innerHTML = "自動點按行動按鍵，當按鈕能被按下時就會按下。<span style='color:yellow'>注意：這就是團長說的腳本了，出事請自行負責</span>";

    // 獲取可點的按鈕
    let allbuttons = document.getElementsByTagName('button');
    var actionButtons = [];
    for(let i = 0; i < allbuttons.length; i++)
    {
        for(let j = 0; j < ACTION_NAME_LIST.length; j++)
        {
            if(allbuttons[i].innerText == ACTION_NAME_LIST[j])
            {
                actionButtons.push(allbuttons[i]);
                continue;
            }
        }
    }

    // 創建按鈕
    for(let i = 0; i < actionButtons.length; i++)
    {
        //console.log("按鈕名稱："+buttons[i].innerHTML);

        let newButt = document.createElement('button');
        newButt.classList = BUTTON_AVAILABLE_CLASSNAME;
        newButt.innerHTML = ""+actionButtons[i].innerHTML;
        newButt.onclick = ()=>{ StartRecursive(actionButtons[i]); }
        inject.appendChild(newButt)
    }
    let newButt = document.createElement('button');
    newButt.innerHTML = "停止";
    newButt.classList = BUTTON_AVAILABLE_CLASSNAME;
    newButt.onclick = ()=>{ EndRecursive(); }
    inject.appendChild(newButt);
    



    // 以下是功能
    var recursiveTimerId;
    var clickCombo = 0;
    var continuousClick = 0;
    var isLastActionClick = false;

    function StartRecursive(butt)
    {
        console.log("開始遞迴：按鈕"+butt.innerHTML);
        for(var i = 0; i < actionButtons.length; i++)
        {
            actionButtons[i].disabled = true;
        }
        EndRecursive();
        Recursive(butt);
    }
    function Recursive(butt)
    {
        // Random: 5~20秒檢查一次
        let nextTime = 5000+Math.random()*15000;


        if(butt.disabled || butt.classList == BUTTON_DISABLED_CLASSNAME)
        {
            // 仍在鎖，不能按
            isLastActionClick = false;
            continuousClick = 0;

            console.log("按鈕不能按！ 下次檢查時間(n秒後)："+nextTime/1000);
        }
        else
        {
            // 按下去！
            butt.click();
            clickCombo++;
            if(isLastActionClick)
            {
                continuousClick++;
            }
            isLastActionClick = true;

            console.log(clickCombo+" combo!! "+butt.innerHTML + "\n下次檢查時間(n秒後)："+nextTime/1000);
            console.log(butt);
        }        

        if(continuousClick < 5)
        {
            recursiveTimerId = setTimeout( ()=>{Recursive(butt)} , nextTime);
        }
        else
        {
            console.warn("無效點擊達 5 次。請重新執行遞迴！");
            EndRecursive();
        }

        subtitle2.innerHTML = "自律行動執行中，已點擊了 "+clickCombo+" 次！";
        if(continuousClick > 0)
            subtitle2.innerHTML += "<br><span style='color:yellow'>連續點擊次數( 5 次將會暫停腳本)："+continuousClick+" / 5";
    }
    function EndRecursive()
    {
        window.clearTimeout(recursiveTimerId);
        continuousClick = 0;
        isLastActionClick = false;
        for(var i = 0; i < actionButtons.length; i++)
        {
            actionButtons[i].disabled = false;
        }
        subtitle2.innerHTML = "";
        console.log("停止遞迴；清除參數。");
    }
}
)();