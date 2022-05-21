var express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var router = express.Router();
var path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://D_Arguello:Jesus2021@cluster0.gimis.mongodb.net/db1?retryWrites=true&w=majority"
  )
  .catch((error) => handleError(error));

const peliculaSchema = new mongoose.Schema(
  {
    titulo: String,
    descripcion: String,
    duracion: String,
    autor: String,
    enlace: String,
    fecha: String 
  },
  {
    collection: "video", 
  }
);

const VIDEO = mongoose.model("VIDEO", peliculaSchema);

  // muestra todos los videos
  router.get("/videos", (req, res) => {
    VIDEO.find((err, vides) => {
      if (err) res.status(500).send("Error en la base de datos  #1");
      else res.status(200).json(vides);
    });
  });

  // muestra todos los videos de un autor
  router.get("/videos/porNombre", function (req, res) {
    VIDEO.find({  autor: req.query.autor  }, function (err, vides) {
      if (err) {
        console.log(err);
        res.status(500).send("Error al leer de la base de datos #3");
      } else res.status(200).json(vides);
    });
  });

     // muestra todos los videos agregados en un rango de fechas 
     router.get("/videos/dentro", function (req, res) {
      //hace un query de los documentos
      VIDEO.find({ fecha: { $gte: req.query.fecha ,  $lte: req.query.fecha1}}, function (err, vides) {
        if (err) {
          console.log(err);
          res.status(500).send("Error al leer de la base de datos");
        } else res.status(200).json(vides);
      });
    });
  
    //agregar un nuevo video
  router.post("/videos", function (req, res) {
    const video1 = new VIDEO({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      duracion: req.body.duracion,
      autor: req.body.autor,
      enlace: req.body.enlace,
      fecha: req.body.fecha
    });
  
    video1.save(function (error, vide) {
      if (error) {
        res.status(500).send("No se ha podido agregar.");
      } else {
        res.status(200).json(vide); 
      }
    });
  });


  //elimina un video por id
  router.delete("/videos/:id", function (req, res) {
    VIDEO.findById(req.params.id, function (err, vide) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (vide != null) {
          vide.remove(function (error, result) {
            if (error) res.status(500).send("Error en la base de datos");
            else {
              res.status(200).send("Eliminado exitosamente");
            }
          });
        } else res.status(404).send("No se encontro esa cancion en la lista");
      }
    });

  });

    // muestra un video por id
    router.get("/videos/:id", function (req, res) {
      VIDEO.findById(req.params.id, function (err, vide) {
        if (err) res.status(500).send("Error en la base de datos");
        else {
          if (vide != null) {
            res.status(200).json(vide);
          } else res.status(404).send("No se encontro ese video");
        }
      });
    });
  
  
module.exports = router;