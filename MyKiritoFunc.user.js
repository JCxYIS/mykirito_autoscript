// ==UserScript==
// @name         MyKiritoScript(TamperMonkey)
// @namespace    https://jcjc.cf/
// @version      1.1
// @description   My First TM script!!
// @author       JCxYIS
// @match        https://mykirito.com/
// @grant        none
// ==/UserScript==

(function() 
{
    'use strict';

    // 參數
    const ACTION_NAME_LIST = ["狩獵兔肉", "自主訓練", "外出野餐", "汁妹", "做善事", "坐下休息", "釣魚"];
    const BUTTON_AVAILABLE_CLASSNAME = "sc-AxgMl sc-fznZeY bbwYrD";
    const CONTAINER_CLASSNAME = "sc-fzokOt hLgJkJ";

    // 製作選單
    let inject = document.createElement('div');
    inject.className = "sc-fzplWN hRBsWH";
    let title = document.createElement("h3");
    title.innerHTML = "自律行動";
    inject.appendChild(title);

    // 獲取可點的按鈕
    var allbuttons = document.getElementsByTagName('button');
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

    // write
    let newButt = document.createElement('button');
    newButt.innerHTML = "停止遞迴";
    newButt.onclick = ()=>{ EndRecursive(); }
    inject.appendChild(newButt)
    document.getElementsByClassName(CONTAINER_CLASSNAME)[0].appendChild(inject);



    // fuc
    var recursiveTimerId;
    var clickCombo = 0;
    var continuousClick = 0;
    var isLastActionClick = false;

    function StartRecursive(butt)
    {
        console.log("開始遞迴：按鈕"+butt.innerHTML);
        Recursive(butt);
    }
    function Recursive(butt)
    {
        // Random: 5~20秒檢查一次
        let nextTime = 5000+Math.random()*15000;


        if(butt.disabled)
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
        }

        if(continuousClick < 5)
        {
            recursiveTimerId = setTimeout( ()=>{Recursive(butt)} , nextTime);
        }
        else
        {
            console.warn("無效點擊達 5 次。請重新執行遞迴！");
        }
    }
    function EndRecursive()
    {
        window.clearTimeout(recursiveTimerId);
        continuousClick = 0;
        isLastActionClick = false;
        console.log("停止遞迴；清除參數");
    }
}
)();