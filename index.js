const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(cors());
// app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const conn = mysql.createConnection({
  host: "db4free.net",
  user: "poporthailand",
  password: "imr0991290722",
  database: "gentlewoman",
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "gentlewoman",
  port: 3306
});

app.get("/collection", async (req, res) => {
  let response = {};

  const collection = () =>{
    return new Promise((resolve, reject)=>{
      conn.query('SELECT * FROM collection ',  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
  };

  const resultCollection = await collection();
  response = resultCollection

  const collectionImages = (collectionId) =>{
    return new Promise((resolve, reject)=>{
      conn.query('SELECT formatimage.name AS format, src FROM collectionimages LEFT JOIN formatimage ON formatimage.id = collectionimages.formatImageId WHERE collectionimages.collectionId = ?', [collectionId], (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
  };

  for (key in response) {
    response[key] = {...response[key],  collectionImages:  await collectionImages(response[key].id)}
  }

  const product = (collectionId) =>{
    return new Promise((resolve, reject)=>{
      conn.query('SELECT * FROM `product` WHERE `collectionId` = ? LIMIT 6', [collectionId], (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
  };

  for (const key in response) {
    response[key] = {...response[key],  product: await product(response[key].id)}
  }

  const productImages = (productId) =>{
    return new Promise((resolve, reject)=>{
      conn.query('SELECT src FROM `productimages` WHERE productId = ? LIMIT 1', [productId], (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
  };


  for(key in response) {
    for (const keyProduct in response[key].product) {
      const src = await productImages(response[key].product[keyProduct].id)
      response[key].product[keyProduct] = {...response[key].product[keyProduct] , imgsrc : src[0].src }
    }
  }


  res.send(response)

});

// app.get("/collectionimages", (req, res) => {
//     const collectionId = req.query.collectionId;
//     db.query("SELECT * FROM collectionimages WHERE collectionId = ?", [collectionId], (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send(result);
//       }
//     });
// });

// app.get("/formatimage", (req, res) => {
//   db.query("SELECT * FROM formatimage ", (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

app.listen(process.env.PORT || 3001, () => {
    console.log("Yes, your server is running on port 3001");
});