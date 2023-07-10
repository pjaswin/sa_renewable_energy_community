import React, { useState, useEffect } from "react";

import axios from 'axios';

import { Link, Navigate, useLocation } from "react-router-dom";

import { Line } from "react-chartjs-2";

import { Chart as ChartJS, LineElement, LinearScale, PointElement, CategoryScale, Legend } from 'chart.js'




ChartJS.register(

  LineElement,

  CategoryScale,

  LinearScale,

  PointElement,

  Legend

)




export default function HomePage() {

  const location = useLocation();

  const userData = location.state?.userData;

  const user_id = userData.id

  console.log(user_id);




  console.log(userData);

  const [chartData, setChartData] = useState({

    labels: [],

    datasets: [],

  });




  const [chartData2, setChartData2] = useState({

    labels: [],

    datasets: [],

  });




  const [totalEnergyUsage, setTotalEnergyUsage] = useState(0);




  const loggedInUser = localStorage.getItem("authenticated");




  useEffect(() => {

    if (loggedInUser === 'true') {

      fetchData();

      fetchFutureData();

    }

  }, []);




  const returnLogin = () => {

    return <Navigate replace to="/login" />;

  };




  const fetchData = () => {

    axios

      .get("http://127.0.0.1:8002/fetch_data/"+user_id)

      .then((response) => {

        const processedData = processChartData(response.data);

        setChartData(processedData);

        // Calculate total energy usage up to yesterday's date

        const actualEnergyData = response.data[`Energy_Consumption_House_${user_id}`];

        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1);

        let totalUsage = 0;

        for (let i = 0; i < response.data.Date.length; i++) {

          const date = new Date(response.data.Date[i]);

          if (date <= yesterday) {

            totalUsage += actualEnergyData[i];

          }

        }

        totalUsage = totalUsage.toFixed(2);

        setTotalEnergyUsage(totalUsage);

      })

      .catch((error) => {

        console.error("Error fetching chart data:", error);

      });

  };




  const fetchFutureData = () => {

    axios

      .get("http://127.0.0.1:8003/fetch_future_data/"+user_id)

      .then((response) => {

        const processedData2 = processChartData2(response.data);

        setChartData2(processedData2);

        console.log(response.data.Date);

      })

      .catch((error) => {

        console.error("Error fetching chart data:", error);

      });

  };





  const processChartData = (data) => {

    const formattedDates = data.Date.map((dateString) => {

      const date = new Date(dateString);

      const formattedDate = date.toLocaleDateString("en-US", {

        day: "2-digit",

        month: "short",

        year: "numeric",

      });

      return formattedDate;

    });

   

    const totalEnergyProperty = `Energy_Consumption_House_${user_id}`;

    const renewableEnergyProperty = `Renewable_Energy_Consumption_House_${user_id}`;

    return {

      labels: formattedDates,

      datasets: [

        {

          label: "Total Energy Usage",

          data: data[totalEnergyProperty],

          fill: true,

          backgroundColor: "rgba(75, 192, 192, 0.2)",

          borderColor: "rgba(75, 192, 192, 1)",

        },

        {

          label: "Renewable Energy Usage",

          data: data[renewableEnergyProperty],

          fill: false,

          borderColor: "#742774",

        },

      ],

    };

  };




  const processChartData2 = (data) => {

    const formattedDates = data.Date.map((dateString) => {

      const date = new Date(dateString);

      const formattedDate = date.toLocaleDateString("en-US", {

        day: "2-digit",

        month: "short",

        year: "numeric",

      });

      return formattedDate;

    });

 

    const actualEnergyProperty = `Energy_Consumption_House_${user_id}`;

    const predEnergyProperty = `predicted_usage${user_id}`;

 

    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

 

    const actualEnergyData = data[actualEnergyProperty].filter((_, index) => {

      const date = new Date(data.Date[index]);

      return date <= yesterday;

    });

 

    const predEnergyData = data[predEnergyProperty];

 

    return {

      labels: formattedDates,

      datasets: [

        {

          label: "Actual Energy Usage",

          data: actualEnergyData,

          fill: true,

          backgroundColor: "rgba(75, 192, 192, 0.2)",

          borderColor: "rgba(75, 192, 192, 1)",

          pointBackgroundColor: (ctx) =>

            ctx.dataIndex === actualEnergyData.length - 1 ? "red" : "rgba(75, 192, 192, 1)",

          pointRadius: (ctx) => (ctx.dataIndex === actualEnergyData.length - 1 ? 6 : 3),

        },

        {

          label: "Predicted Energy Usage",

          data: predEnergyData,

          fill: false,

          borderColor: "#742774",

        },

      ],

    };

  };

 

  const options = {

    scales: {

      x: {

        type: "category",

      },

    },

    plugins: {

      legend: {

        display: true,

        position: "top",

      },

    },

  };

 

  if (loggedInUser !== 'true') {

    return <Navigate replace to="/login" />;

  }




  return (

    <div className="container">

      <h3>Welcome, {userData.username}</h3>




      <div className="row justify-content-center">

        <div className="col-md-3 d-flex">

          <div className="card">

            <div className="card-body">

              <h5 className="card-title">Usage Bill forCurrent Month</h5>

              <p className="card-text">Rs. 437.67</p>

              <Link to="/pay" className="btn btn-primary">

                Pay

              </Link>

            </div>

          </div>

        </div>




        <div className="col-md-3 d-flex">

          <div className="card">

            <div className="card-body">

              <h5 className="card-title">Predicted Bill for Next Month</h5>

              <p className="card-text">Rs. 520.46 </p>

            </div>

          </div>

        </div>




        <div className="col-md-3 d-flex">

          <div className="card">

            <div className="card-body">

              <h5 className="card-title">Usage for Current Month</h5>

              <p className="card-text">{totalEnergyUsage} kWh</p>

            </div>

          </div>

        </div>




        <div className="col-md-3 d-flex">

          <div className="card">

            <div className="card-body">

              <h5 className="card-title">Usage Ranking</h5>

              <p className="card-text">

              You are among the top 5% of the users in the community!🔝

              </p>

            </div>

          </div>

        </div>

      </div>




      <div className="mt-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        <div>

          <h3>Energy Usage </h3>

          <Line data={chartData} options={options} />

        </div>

        <div>

          <h3>Projected Energy Usage</h3>

          <Line data={chartData2} options={options} />

        </div>

      </div>

    </div>

  );

}