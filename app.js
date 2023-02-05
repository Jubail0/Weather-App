const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');


dotenv.config({path:'./config.env'});
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000;


let weatherData =[]

const refreshWeatherData = async()=>{
    // List of 30 cities
    const cities =[
        "Delhi",
        "Mumbai",
        "Kolkata",
        "Jaipur",
        "Manali",
        "Hyderabad",
        "Chennai",
        "Ooty",
        "Shimla",
        "Udaipur",
        "Pune",
        "Shimla",
        "Mysore",
        "Lucknow",
        "Munnar",
        "Agra",
        "Indore",
        "Gangtok",
        "Bhopal",
        "Madurai",
        "Allahabad",
        "Patna",
        "Gulmarg",
        "Shillong",
        "Mangalore",
        "Surat",
        "Puri",
        "Lonavla",
        "Varkala",
        "Dharamsala",
        
    ]

    const citiesWeatherInfo = cities.map(async(city)=>{
    const api = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`)
    const data = await api.json()
    
    if(data){
        
        const{name,coord,main,sys} = data
        return {
            id:sys?.id,
            name:name,
            position:[coord?.lat,coord?.lon],
            temp:main?.temp,
            humidity:main?.humidity
        }
    }else{
        console.log("No Data")
    }
    
    })
     weatherData = await Promise.all(citiesWeatherInfo)
    }

    refreshWeatherData();
    setInterval(refreshWeatherData,300000) // refresh data every 5 minutes


app.get('/weather', async(req,res)=>{

try {

// Pagination
const page = req.query.page || 1;
const pageSize = 10;
const startIndex = (page - 1) * pageSize;  
const endIndex = startIndex + pageSize; 

const data = weatherData.slice(startIndex,endIndex);


res.status(200).json({
    data:data,
    totalPage:Math.ceil(weatherData.length/pageSize),
    currentPage:page
})


}
catch (error) {
 console.log(error)
}


})



app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})

