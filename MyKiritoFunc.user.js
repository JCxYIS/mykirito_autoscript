// ==UserScript==
// @name         MyKiritoScript(TamperMonkey)
// @namespace    https://jcjc.cf/
// @version      0.1
// @description  Hello world! Tampermonkey! My First TM script!!
// @author       JCxYIS
// @match        https://mykirito.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let inject = document.createElement('div');

    // 創建按鈕s
    var buttons = document.getElementsByTagName('button');
    console.log("按鈕數："+buttons.length);
    for(let i = 0; i < buttons.length; i++)
    {
        //console.log("按鈕名稱："+buttons[i].innerHTML);

        let newButt = document.createElement('button');
        newButt.innerHTML = "重複按："+buttons[i].innerHTML;
        newButt.onclick = ()=>{ StartRecursive(i); }
        inject.appendChild(newButt)
    }

    // write
    let newButt = document.createElement('button');
    newButt.innerHTML = "停止遞迴";
    newButt.onclick = ()=>{ EndRecursive(); }
    inject.appendChild(newButt)
    document.body.appendChild(inject);


    // fuc
    var recursiveTimerId;
    var clickCombo = 0;
    var continuousClick = 0;
    var isLastActionClick = false;
    function StartRecursive(index)
    {
        console.log("開始遞迴：按鈕"+index);
        Recursive(index);
    }
    function Recursive(index)
    {
        // Random: 10~30秒檢查一次
        let nextTime = 10000+Math.random()*19999;


        if(buttons[index].disabled)
        {
            // 仍在鎖，不能按
            isLastActionClick = false;
            continuousClick = 0;

            console.log("窩不能按！ 下次檢查時間(n秒後)："+nextTime/1000);
        }
        else
        {
            // 按下去！
            buttons[index].click();

            // statistic
            clickCombo++;
            if(isLastActionClick)
            {
                continuousClick++;
            }
            isLastActionClick = true;

            console.log(clickCombo+"combo!! 按下去！"+buttons[index].innerHTML + "\n下次檢查時間(n秒後)："+nextTime/1000);
        }

        if(continuousClick < 5)
        {
            recursiveTimerId = setTimeout( ()=>{Recursive(index)} , nextTime);
        }
        else
        {
            console.warn("無效點擊達5次，可能已遭擊殺。請重新執行遞迴！");
        }
    }
    function EndRecursive()
    {
        window.clearTimeout(recursiveTimerId);
        continuousClick = 0;
        isLastActionClick = false;
        console.log("停止遞迴、清除參數");
    }
})();