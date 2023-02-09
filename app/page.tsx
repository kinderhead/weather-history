'use client';

import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import { Bar, Line } from 'react-chartjs-2'
import { useState } from 'react'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

const inter = Inter({ subsets: ['latin'] })

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
    const [data, setData] = useState<number[]>([6, 1, 7, 2, 9, 7, 3, 5, 7, 2, 1, 0]);

    return (
        <main>
            <Line options={{}} data={{labels: data.map(i => i), datasets: [{label: "numbers", data: data, backgroundColor: "#000000", borderColor: "#A0A0A0"}]}}></Line>
        </main>
    )
}
