'use client';

import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import { Bar, Line } from 'react-chartjs-2'
import { useState } from 'react'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataset } from 'chart.js';
import MultiRangeSlider from "multi-range-slider-react";

import _raw_data from '../public/data.json'
import Dropdown, { toTitleCase } from '@/lib/dropdown';

const raw_data : any = _raw_data;
const size = Object.keys(raw_data).length;
const years = ['1948', '1950', '1952', '1954', '1956', '1958', '1960', '1962', '1964', '1966', '1968', '1970', '1972', '1974', '1976', '1978', '1980', '1982', '1984', '1986', '1988', '1990', '1992', '1994', '1996', '1998', '2000', '2002', '2004', '2006', '2008', '2010', '2012', '2014', '2016', '2018', '2020', '2022'];
const colors = ["#FFAA00", "#AA00AA", "#33FF33", "#FF3333", "#00AAFF"];
const choices = [["temperature", "dew_point", "humidity", "high", "low"], ["gust", "wind", "wind_chill_low", "wind_chill"], ["precipitation", "visibility"], ["pressure"]];

const inter = Inter({ subsets: ['latin'] })

function getDataset(i : string, idex : number, minVal : number, maxVal : number) : ChartDataset<"line", any> {
    return {label: toTitleCase(i), data: Object.keys(raw_data).map(e => raw_data[e][i]).slice(minVal, maxVal), backgroundColor: colors[idex], borderColor: colors[idex]};
}

function rebuildData(choice : string[], minVal : number, maxVal : number) {
    var _data : ChartDataset<"line", any>[] = [];
    var idex = 0;
    choice.forEach(i => {
        _data.push(getDataset(i, idex, minVal, maxVal));
        idex++;
    });

    return _data;
}

export default function Home() {
    Chart.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
    const [choice, setChoice] = useState<string[]>(choices[0]);
    const [minVal, setMinVal] = useState<number>(0);
    const [maxVal, setMaxVal] = useState<number>(size);
    const [data, setData] = useState<ChartDataset<"line", any>[]>(rebuildData(choice, minVal, maxVal));

    return (
        <main className={inter.className} style={{height: "100%", width: "100%"}}>
            <div>
                <div style={{paddingLeft: 5}}>All displayed values are averages for the month. Choose variables to view:</div>
                <Dropdown options={["Temperature, dew point, and humidity", "Wind", "Precipitation and visibility", "Pressure"]} onClick={opt => {
                    console.log(opt);
                    var c : string[] = [];
                    if (opt == "Temperature, dew point, and humidity") {
                        c = choices[0];
                    } else if (opt == "Wind") {
                        c = choices[1];
                    } else if (opt == "Precipitation and visibility") {
                        c = choices[2];
                    } else if (opt == "Pressure") {
                        c = choices[3];
                    }
                    setChoice(c);
                    setData(rebuildData(c, minVal, maxVal));
                }}/>
                <ul style={{display: "inline"}}>
                    {
                        choice.map(i => {
                            return (<li key={i} style={{float: "left", display: "inline", paddingLeft: "5px"}}>
                                <input type="checkbox" id={i} defaultChecked={true} onClick={(input) => {
                                    const element = input.target as HTMLInputElement;
                                    var idex = choice.findIndex(e => i == e);
                                    data[idex].hidden = element.checked;
                                    console.log("Toggled " + i);
                                    setData(data);
                                }}></input>
                                <label style={{paddingLeft: "5px", paddingRight: "10px"}} htmlFor={i}>{i}</label>
                            </li>);
                        })
                    }
                </ul>
                <br/>
                <MultiRangeSlider labels={years} min={0} max={size} step={1} onChange={e => {
                    setMinVal(e.minValue);
                    setMaxVal(e.maxValue);
                }}/>
            </div>
            <div style={{width: "100%", height: "710px"}}>
                <Line options={{maintainAspectRatio: false}} data={{labels: Object.keys(raw_data).slice(minVal, maxVal), datasets: data}}></Line>
            </div>
        </main>
    )
}
