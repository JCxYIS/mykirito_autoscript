var inject = document.createElement('div');

// 創建按鈕s
var buttons = document.getElementsByTagName('button');
console.log("按鈕數："+buttons.length);
for(var i = 0; i < buttons.length; i++)
{
    //console.log("按鈕名稱："+buttons[i].innerHTML);

    var newButt = document.createElement('button');
    newButt.innerHTML = "重複按："+buttons[i].innerHTML;
    newButt.setAttribute('onclick', "StartRecursive("+i+")")
    inject.appendChild(newButt)
}

// write
var newButt = document.createElement('button');
newButt.innerHTML = "停止遞迴";
newButt.setAttribute('onclick', "EndRecursive()")
inject.appendChild(newButt)
document.body.appendChild(inject);


// fuc
var recursiveTimerId;
function StartRecursive(index)
{
    console.log("開始遞迴：按鈕"+i);
    Recursive(index);
}

function Recursive(index)
{
    var nextTime = 10000+Math.random()*19999; // Random: 10~30秒檢查一次  
    

    if(buttons[index].disabled)
    {
        // 仍在鎖，不能按
        console.log("窩不能按！ 下次檢查時間(n秒後)："+nextTime/1000);
    }
    else
    {
        // 按下去！
        console.log("按下去！ "+buttons[index].innerHTML + "\n下次檢查時間(n秒後)："+nextTime/1000);
        buttons[index].click();
    }
    
    recursiveTimerId = setTimeout( ()=>{Recursive(index)} , nextTime);  
}
function EndRecursive()
{
    window.clearTimeout(recursiveTimerId);
    console.log("停止遞迴");
}