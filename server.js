const express = require('express')
const app = express()
const port = 3000

// Sección de configuraciones
// esto configura a mi servidor, usar el sistema de vista de handlebars
app.set('view engine', 'hbs');
// abajo indica al servidor que todas las vistas estarán ubicadas en la carpeta absoluta "views"
app.set("views", __dirname + "/views/")

const hbs = require('hbs');
hbs.registerPartials(__dirname + "/views/partials")

// inicializamos acceso al envoltorio de la API
const DogApi = require('doggo-api-wrapper');
const myDog = new DogApi();

// Sección de busqueda de data
const allLessons = require("./data/all-lessons.js")

// Sección de las rutas
app.get('/', (req, res) => {
  // res.send('Hello World!')

  // con hbs, no vamos a directamente enviar el archivo
  // con hbs hacemos un metodo nuevo de res que se llama .render()
  res.render("home.hbs")
})

app.get("/about", (req, res, next) => {

  res.render("about.hbs", {
    title: "PatataHack",
    staff: ["Pedro", "Antonio", "Ruth"],
    isAvailable: false
  })
  // como segundo segundo argumento podemos pasar un (Objeto)

} )

app.get("/lessons", (req, res, next) => {
  console.log(allLessons)
  res.render("lessons.hbs", {
    allLessons: allLessons,
    // podriamos hacerlo con un solo nombre
    // allLessons,
  })
})

app.get("/lessons/approved/:approvedType", (req, res, next) => {
  // esta ruta nos renderizará solo las:
  // - /lessons/approved/si => lecciones que esten aprobadas
  // - /lessons/approved/no => lecciones que no esten aprobadas

  console.log(req.params.approvedType)
  let filteredLessons;
  if (req.params.approvedType === "si") {
    filteredLessons = allLessons.filter((eachLesson) => {
      return eachLesson.approved === true
    })
  } else if (req.params.approvedType === "no"){
    filteredLessons = allLessons.filter((eachLesson) => {
      return eachLesson.approved === false
    })
  }

  console.log(filteredLessons)

  res.render("approved.hbs", {
    filteredLessons: filteredLessons
  })

})

app.get("/perritos/aleatorio", (req, res, next) => {

  myDog.getARandomDog()
  .then((response) => {
    console.log(response)
    
    res.render("dogs/random.hbs", {
      imagen: response.message
    })

  })
  .catch((error) => {
    console.log(error)
  })



})
// 1. crear la ruta
// 2. crear la vista
// 3. renderizar la vista
// 4... todo el resto

app.get("/perritos/lista-de-razas", (req, res, next) => {

  myDog.getListOfAllBreeds()
  .then((response) => {
    console.log(response.message)
    let razas = [];
    for (let key in response.message) {
      // console.log(key)
      razas.push(key)
    }
    console.log(razas)
    // let razas = Object.keys(response.message)
    // console.log(razas)
    res.render("dogs/list.hbs", {
      razas: razas
    })

  })
  .catch((error) => {
    console.log(error)
  })

  
})

app.get("/perritos/por-raza/:raza", (req, res, next) => {

  console.log(req.params.raza)
  myDog.getAllDogsByBreed(req.params.raza)
  .then((response) => {
    console.log(response)
    res.render("dogs/dogs-by-raza.hbs", {
      dogs: response.message
    })
  })
  .catch((error) => {
    console.log(error)
  })

  

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})