const express = require('express')
const app = express()
const port = 3000

// Sección de configuraciones
// esto configura a mi servidor, usar el sistema de vista de handlebars
app.set('view engine', 'hbs');
// abajo indica al servidor que todas las vistas estarán ubicadas en la carpeta absoluta "views"
app.set("views", __dirname + "/views/")

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})