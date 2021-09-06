import React, { useState } from 'react';
import { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = ({ chartData }) => {
    const [loading, setLoading] = useState(true)
    const [maxY, setMaxY] = useState(0)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']

    useEffect(() => {
        setMaxY(Math.max.apply(Math, chartData.map(each => (each.total))))
        setLoading(false)
    }, [])

    const series = [
        {
            name: "Highest Present",
            // data: [1, 2, 3, 4, 11, 17, 10],
            // labels: ["Apple", "Mango", "Banana", "Papaya", "Orange"]
            data: chartData.map(each => each.present.length)
        },
    ]
    const options = {
        chart: {
            height: 150,
            type: 'line',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            toolbar: {
                show: false
            }
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'Attendance Tracking',
            align: 'centre'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        markers: {
            size: 1
        },
        xaxis: {
            categories: chartData.map(each => `${new Date(each.date).getDate()}, ${days[new Date(each.date).getDay()]}`),
            // categories: chartData.map(each => days[new Date(each.date).getDay()]),
            title: {
                text: 'This Week'
            }
        },
        yaxis: {
            title: {
                text: 'Members'
            },
            min: 0,
            max: maxY
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
        }
    }

    return (
        <div id="chart">
            {loading ? <h1>loading...</h1> : (<ReactApexChart options={options} series={series} type="line" height={350} width={500} />)}
        </div>
    );
};

export default LineChart;