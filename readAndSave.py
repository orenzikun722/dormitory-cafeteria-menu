import pdfplumber
import gspread
from google.oauth2.service_account import Credentials
import datetime
import calendar



# メイン設定
year = 2026
month = 2
pdf_file_name = "menu-domitory-2026_2_henkou.pdf"








def get_menu(target_date):
  with pdfplumber.open(pdf_file_name) as pdf:
    for page in pdf.pages:
      table=page.extract_table()
      if not table:
        continue
      headers=table[0]
      try:
        date_col=headers.index(target_date)
      except ValueError:
        continue
      breakfast = ""
      lunch = ""
      dinner = ""
      for row in table:
        try:
          if row and row[0]=="朝\n食":
            breakfast = row[date_col].split('ｴﾈﾙｷﾞｰ')[0].split('[Ａ]')[0].strip("\n")
          elif row and row[0]=="昼\n食":
            lunch = row[date_col].split('ｴﾈﾙｷﾞｰ')[0].split('[Ａ]')[0].strip("\n")
          elif row and row[0]=="夕\n食":
            dinner = row[date_col].split('ｴﾈﾙｷﾞｰ')[0].split('[Ａ]')[0].strip("\n")
        except BaseException:
          print(target_date + ": 取得に失敗しました")
      if breakfast != "" and lunch != "" and dinner != "":
        scopes = ["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/spreadsheets"]
        creds = Credentials.from_service_account_file(
          "service_account.json",
          scopes=scopes
        )
        client = gspread.authorize(creds)
        sheet = client.open("寮食管理").sheet1
        before_data = sheet.find(target_date)
        if before_data == None:
          sheet.append_row([target_date, breakfast, lunch, dinner])
        else:
          sheet.update_cell(before_data.row, before_data.col+1, breakfast)
          sheet.update_cell(before_data.row, before_data.col+2, lunch)
          sheet.update_cell(before_data.row, before_data.col+3, dinner)
        print(target_date+"の記入完了")
      else:
        if breakfast == "":
          print(target_date+": 朝食が取得できていません")
        if lunch == "":
          print(target_date+": 昼食が取得できていません")
        if dinner == "":
          print(target_date+": 夕食が取得できていません")






week = ["月","火","水","木","金","土","日"]

days = calendar.monthrange(year, month)[1]
for day in range(1, days + 1):
  date = datetime.datetime.strptime(
    "2026年"+str(month)+"月"+str(day)+"日",
    "%Y年%m月%d日"
  )
  get_menu("2026年"+str(month)+"月"+str(day)+"日("+week[date.weekday()]+")")