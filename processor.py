import calendar
import csv
import datetime
import json
import os
from tqdm import tqdm

DATE = 1
DEW_POINT = 43
TEMPERATURE = 44
PRECIPITATION = 45
HUMIDITY = 49
PRESSURE = 52
VISIBILITY = 53
GUST = 56
WIND = 57

files = ["3227583", "3227588", "3227607", "3227591", "3227596", "3227600", "3227601", "3227602", "3227607"]
data = {}

def get_num(date : str, field : str, num : float | str):
    if type(num) is str:
        num = num.removesuffix("s")
        num = num.removesuffix("V")
        if num.strip() in ["", "T"]: return
        try:
            return float(num.strip())
        except ValueError as e:
            print(f"{date}: Skipping number {num} in {field}")
            return None
    else:
        return num

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
    add_entry_data(date, "humidity")
    add_entry_data(date, "pressure")
    add_entry_data(date, "visibility")
    add_entry_data(date, "gust")
    add_entry_data(date, "wind")

    add_entry_data(date, "low")
    add_entry_data(date, "high")
    add_entry_data(date, "wind_chill")
    add_entry_data(date, "wind_chill_low")

def add_to_average(date : str, field : str, num : float | str):
    check = get_num(date, field, num)
    if (check is None): return
    num = check
    total = data[date][field] * data[date][field + "_count"]
    total += num
    data[date][field + "_count"] += 1
    data[date][field] = total / data[date][field + "_count"]

def add_to(date : str, field : str, num : float | str):
    check = get_num(date, field, num)
    if check is None: return
    num = check
    data[date][field] += num

def add_min(date : str, field : str, num : float | str):
    check = get_num(date, field, num)
    if check is None: return
    num = check
    if data[date][field] == 0:
        data[date][field] = num
    else:
        data[date][field] = min(num, data[date][field])

def add_max(date : str, field : str, num : float | str):
    check = get_num(date, field, num)
    if check is None: return
    num = check
    data[date][field] = max(num, data[date][field])

def calc_wind_chill(temp : float, wind : float):
    if temp is None or wind is None:
        return None
    return 0.0817 * (3.71*(wind**0.5) + 5.81 - (0.25*wind)) * (temp - 91.4) + 91.4

for i in files:
    with open("data/" + i + ".csv", "r") as f:
        reader = csv.reader(f)
        first = True
        raw = []
        for i in reader:
            raw.append(i)
        for row in tqdm(raw, desc=f.name):
            if first:
                first = False
                continue
            date = datetime.datetime.strptime(row[DATE], "%Y-%m-%dT%H:%M:%S")
            str_date = get_date(date)
            if str_date not in data.keys(): create_entry(str_date)
            add_to_average(str_date, "dew_point", row[DEW_POINT])
            add_to_average(str_date, "temperature", row[TEMPERATURE])
            add_to(str_date, "precipitation", row[PRECIPITATION])
            add_to_average(str_date, "humidity", row[HUMIDITY])
            add_to_average(str_date, "pressure", row[PRESSURE])
            add_to_average(str_date, "visibility", row[VISIBILITY])
            add_to_average(str_date, "gust", row[GUST])
            add_to_average(str_date, "wind", row[WIND])
            add_min(str_date, "low", row[TEMPERATURE])
            add_max(str_date, "high", row[TEMPERATURE])

            wind_chill = calc_wind_chill(get_num(str_date, "temperature", row[TEMPERATURE]), get_num(str_date, "wind", row[WIND]))
            if wind_chill is not None:
                add_to_average(str_date, "wind_chill", wind_chill)
                add_min(str_date, "wind_chill_low", wind_chill)

for i in tqdm(data.keys(), desc="Processing data"):
    data[i]["pressure"] *= 33.8639

with open("public/data.json", "w") as f:
    json.dump(data, f)
