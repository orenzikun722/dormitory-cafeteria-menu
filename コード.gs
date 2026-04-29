function broadcast(text) {
  const url = 'https://api.line.me/v2/bot/message/broadcast';

  const payload = {
    messages: [
      {
        type: "text",
        text: text
      }
    ]
  };

  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer "+PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN')
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}
function formatJapaneseDate(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${['日', "月", "火", "水", '木', '金', '土'][date.getDay()]})`;
}
function breakfast(){
  const date = new Date();
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('MENU_SPREADSHEET_ID')).getSheetByName("シート1");
  const foundCell = ss.createTextFinder(formatJapaneseDate(date)).findNext();
  const range = ss.getRange(foundCell.getRow(), foundCell.getColumn()+1);
  broadcast("🌅今日の朝食メニュー🗒️\n"+range.getValue());
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "breakfast") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  var next = new Date();
  next.setDate(next.getDate() + 1);
  ScriptApp.newTrigger("breakfast")
    .timeBased()
    .at(next)
    .create();
}
function lunch(){
  const date = new Date();
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('MENU_SPREADSHEET_ID')).getSheetByName("シート1");
  const foundCell = ss.createTextFinder(formatJapaneseDate(date)).findNext();
  const range = ss.getRange(foundCell.getRow(), foundCell.getColumn()+2);
  broadcast("🌞今日の昼食メニュー🗒️\n"+range.getValue());
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "lunch") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  var next = new Date();
  next.setDate(next.getDate() + 1);
  ScriptApp.newTrigger("lunch")
    .timeBased()
    .at(next)
    .create();
}
function dinner(){
  const date = new Date();
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('MENU_SPREADSHEET_ID')).getSheetByName("シート1");
  const foundCell = ss.createTextFinder(formatJapaneseDate(date)).findNext();
  const range = ss.getRange(foundCell.getRow(), foundCell.getColumn()+3);
  broadcast("🌙今日の夕食メニュー🗒️\n"+range.getValue());
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "dinner") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  var next = new Date();
  next.setDate(next.getDate() + 1);
  ScriptApp.newTrigger("dinner")
    .timeBased()
    .at(next)
    .create();
}

function doPost(e){
  let data = JSON.parse(e.postData.contents);
  let events = data.events;
  for(let i = 0; i < events.length; i++){
    let event = events[i];
    if(event.type == 'message'){
      if(event.message.type == 'text'){
        var payload = null;
        if(event.message.text == "今日の朝食"){
          const date = new Date();
          const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('MENU_SPREADSHEET_ID')).getSheetByName("シート1");
          const foundCell = ss.createTextFinder(formatJapaneseDate(date)).findNext();
          const range = ss.getRange(foundCell.getRow(), foundCell.getColumn()+1);
          const replyText = "🌅今日の朝食メニュー🗒️\n"+range.getValue();
          payload = JSON.stringify({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: replyText }],
          })
        }else if(event.message.text == "今日の昼食"){
          const date = new Date();
          const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('MENU_SPREADSHEET_ID')).getSheetByName("シート1");
          const foundCell = ss.createTextFinder(formatJapaneseDate(date)).findNext();
          const range = ss.getRange(foundCell.getRow(), foundCell.getColumn()+2);
          const replyText = "🌞今日の昼食メニュー🗒️\n"+range.getValue();
          payload = JSON.stringify({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: replyText }],
          })
        }else if(event.message.text == "今日の夕食"){
          const date = new Date();
          const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('MENU_SPREADSHEET_ID')).getSheetByName("シート1");
          const foundCell = ss.createTextFinder(formatJapaneseDate(date)).findNext();
          const range = ss.getRange(foundCell.getRow(), foundCell.getColumn()+3);
          const replyText = "🌙今日の夕食メニュー🗒️\n"+range.getValue();
          payload = JSON.stringify({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: replyText }],
          })
        }else{
          const target_meal = event.message.text.split("の")[1]
          if(!target_meal) {
            payload = JSON.stringify({
              replyToken: event.replyToken,
              messages: [{ type: 'text', text: "↓正しい形式で入力してください↓\n「4/20の朝ごはん」\n「5/13の晩」\n「今日の昼御飯」などと入力するとその日のメニューを知ることができます！" }],
            })
          }else if(target_meal == "朝食" || target_meal == "朝ごはん" || target_meal == "あさごはん" || target_meal == "朝" || target_meal == "朝ご飯" || target_meal == "朝御飯"){
            const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('MENU_SPREADSHEET_ID')).getSheetByName("シート1");
            const formated = formatJapaneseDate(parseJapaneseDate(event.message.text.split("の")[0]));
            const foundCell = ss.createTextFinder(formated).findNext();
            if(foundCell) {
              const range = ss.getRange(foundCell.getRow(), foundCell.getColumn()+3);
              const replyText = `🌅${formated}の朝食メニュー🗒️\n`+range.getValue();
              payload = JSON.stringify({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: replyText }],
              })
            }else{
              payload = JSON.stringify({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: "✖メニューの情報がありませんでした。\n今月、または来月の日付を指定してください" }],
              })
            }
          }else if(target_meal == "昼食" || target_meal == "昼ごはん" || target_meal == "ひるごはん" || target_meal == "昼" || target_meal == "昼ご飯" || target_meal == "昼御飯"){
            const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('MENU_SPREADSHEET_ID')).getSheetByName("シート1");
            const formated = formatJapaneseDate(parseJapaneseDate(event.message.text.split("の")[0]));
            const foundCell = ss.createTextFinder(formated).findNext();
            if(foundCell){
              const range = ss.getRange(foundCell.getRow(), foundCell.getColumn()+3);
              const replyText = `🌞${formated}の昼食メニュー🗒️\n`+range.getValue();
              payload = JSON.stringify({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: replyText }],
              })
            }else{
              payload = JSON.stringify({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: "✖メニューの情報がありませんでした。\n今月、または来月の日付を指定してください" }],
              })
            }
          }else if(target_meal == "夕食" || target_meal == "ばんごはん" || target_meal == "晩ごはん" || target_meal == "夕" || target_meal == "夕方" || target_meal == "晩御飯" || target_meal == "晩ご飯" || target_meal == "夜" || target_meal == "夜ごはん" || target_meal == "夜ご飯" || target_meal == "夜御飯" || target_meal == "晩"){
            const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('MENU_SPREADSHEET_ID')).getSheetByName("シート1");
            const formated = formatJapaneseDate(parseJapaneseDate(event.message.text.split("の")[0]));
            const foundCell = ss.createTextFinder(formated).findNext();
            if(foundCell){
              const range = ss.getRange(foundCell.getRow(), foundCell.getColumn()+3);
              const replyText = `🌙${formated}の夕食メニュー🗒️\n`+range.getValue();
              payload = JSON.stringify({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: replyText }],
              })
            }else{
              payload = JSON.stringify({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: "✖メニューの情報がありませんでした。\n今月、または来月の日付を指定してください" }],
              })
            }
          }else{
            payload = JSON.stringify({
              replyToken: event.replyToken,
              messages: [{ type: 'text', text: "朝食、昼ごはん、晩御飯などを指定してください" }],
            })
          }
        }
         
        const options = {
          method: "post",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer "+PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN')
          },
          payload: payload
       };
        UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
      }
    }
  }

  // 検証成功
  return ContentService.createTextOutput("OK");
}







function parseJapaneseDate(input) {
  input = String(input).trim();
  if(input == "明日" || input == "あした") {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }else if(input == "明後日" || input == "あさって") {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }else if(input == "明々後日" || input == "明明後日" || input == "しあさって") {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  }else if(input == "今日" || input == "きょう") {
    const date = new Date();
    return date;
  }else if(input == "昨日" || input == "きのう") {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }else if(input == "一昨日" || input == "おととい") {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
  input = input.replace(/(\d+)月(\d+)日/, "$1/$2");

  let y, m, d;

  let full = input.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (full) {
    y = Number(full[1]);
    m = Number(full[2]);
    d = Number(full[3]);
  } else {
    let short = input.match(/^(\d{1,2})\/(\d{1,2})$/);
    if (short) {
      y = new Date().getFullYear();
      m = Number(short[1]);
      d = Number(short[2]);
    } else {
      return false;
    }
  }

  let date = new Date(y, m - 1, d);

  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return false;
  }

  return date;
}






















