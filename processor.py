import csv
import os
import datetime
import calendar
import json

DATE = 1
DEW_POINT = 43
TEMPERATURE = 44
PRECIPITATION = 45

files = ["3227583", "3227588", "3227607", "3227591", "3227596", "3227600", "3227601", "3227602", "3227607"]
data = {}

def get_date(date : datetime.datetime) -> str:
    month = calendar.month_abbr[date.month];
    return month + " " + str(date.year)

def add_entry_data(date : str, field : str):
    data[date][field] = float(0)
    data[date][field + "_count"] = float(0)

def create_entry(date : str):
    data[date] = {}
    add_entry_data(date, "dew_point")
    add_entry_data(date, "temperature")
    add_entry_data(date, "precipitation")

def add_to_average(date : str, field : str, num : float | str):
    if type(num) is str:
        if num.strip() == "": return
        try:
            num = float(num.strip())
        except ValueError as e:
            print(e, "Skipping number")
            return
    total = data[date][field] * data[date][field + "_count"]
    total += num
    data[date][field + "_count"] += 1
    data[date][field] = total / data[date][field + "_count"]

def add_to(date : str, field : str, num : float | str):
    if type(num) is str:
        num = num.removesuffix("s")
        if num.strip() in ["", "T"]: return
        try:
            num = float(num.strip())
        except ValueError as e:
            print(e, "Skipping number")
            return
    data[date][field] += num

for i in files:
    with open("data/" + i + ".csv", "r") as f:
        print("Loading: " + f.name)
        reader = csv.reader(f)
        first = True
        for row in reader:
            if first:
                first = False
                continue
            date = datetime.datetime.strptime(row[DATE], "%Y-%m-%dT%H:%M:%S")
            str_date = get_date(date)
            if str_date not in data.keys(): create_entry(str_date)
            add_to_average(str_date, "dew_point", row[DEW_POINT])
            add_to_average(str_date, "temperature", row[TEMPERATURE])
            add_to(str_date, "precipitation", row[PRECIPITATION])
print(data)
