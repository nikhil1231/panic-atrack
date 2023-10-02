import "./ChartEpisodes.css";

import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import {
  Chart,
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { getEpisodes } from "../util";

Chart.register(
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const ChartEpisodes = (props) => {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    getEpisodes().then((eps) => setEpisodes(eps));
  }, []);

  const sumSeverity = {};
  const countsPerDay = {};
  const triggerCounter = {};

  episodes.forEach((ep) => {
    const date = new Date(ep.time).toLocaleDateString();

    sumSeverity[date] = (sumSeverity[date] || 0) + parseInt(ep.severity);
    countsPerDay[date] = (countsPerDay[date] || 0) + 1;
    triggerCounter[ep.trigger] = (triggerCounter[ep.trigger] || 0) + 1;
  });

  const sortedDates = Object.keys(sumSeverity).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const averageSeverities = sortedDates.map(
    (date) => sumSeverity[date] / countsPerDay[date]
  );
  const sortedCounts = sortedDates.map((date) => countsPerDay[date]);

  const severityData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Severity over Time",
        data: averageSeverities,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  const episodesPerDayData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Severity over Time",
        data: sortedCounts,
        fill: false,
        borderColor: "#20c997",
        tension: 0.3,
      },
    ],
  };

  const triggers = Object.keys(triggerCounter);
  const triggerCounts = triggers.map((trigger) => triggerCounter[trigger]);

  const triggerData = {
    labels: triggers,
    datasets: [
      {
        label: "Episodes by Trigger",
        data: triggerCounts,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 206, 86)",
          "rgb(75, 192, 192)",
        ],
      },
    ],
  };

  const { labels, counts } = getEpisodesByTimeOfDay(episodes, 12);

  const episodeTimeData = {
    labels: labels,
    datasets: [
      {
        label: "Episodes by Time of Day",
        data: counts,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const lineChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          suggestedMin: 0,
        },
      },
    },
  };

  return (
    <Container>
      <h4>Severity Over Time</h4>
      <Line data={severityData} options={lineChartOptions} />
      <h4>Episodes per day</h4>
      <Line data={episodesPerDayData} options={lineChartOptions} />
      <h4>Episodes by Trigger</h4>
      <Bar data={triggerData} />
      <h4>Episodes by Time of Day</h4>
      <Bar data={episodeTimeData} />
    </Container>
  );
};

const getEpisodesByTimeOfDay = (episodeData, bucketCount = 24) => {
  const counts = Array(bucketCount).fill(0);
  const bucketSize = 24 / bucketCount; // Size of each bucket in hours

  episodeData.forEach((ep) => {
    const date = new Date(ep.time);
    const hour = date.getHours() + date.getMinutes() / 60; // Convert time to a decimal number
    const bucketIndex = Math.floor(hour / bucketSize);
    counts[bucketIndex]++;
  });

  const labels = Array(bucketCount)
    .fill(0)
    .map((_, index) => {
      const startHour = index * bucketSize;
      const endHour = (index + 1) * bucketSize;
      return `${Math.floor(startHour)}:00 - ${Math.floor(endHour)}:00`;
    });

  return {
    labels: labels,
    counts: counts,
  };
};

export default ChartEpisodes;
