'use client';

import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import { Bar } from 'react-chartjs-2'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [data, setData] = useState<number[]>([]);

    return (
        <main>
            <Bar options={{}} data={{labels: data.map(i => i), datasets: [{label: "numbers", data: data}]}}></Bar>
        </main>
    )
}
