var router = require("express").Router();
var fire = require("../config/dbConfig");
var bodyParser = require("body-parser");
var db = fire.firestore();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// get all makanan
router.get("/makanan/all", (req, res) => {
  var makanan = [];
  db.collection("makanan")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        makanan.push(doc.data());
      });
      res.status(200).json({
        message: "success",
        data: makanan,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        data: err,
      });
    });
});

// get topm makanan by search record
router.get("/makanan/top", (req, res) => {
  var makanan = [];
  db.collection("makanan")
    .orderBy("search_record", "desc")
    .limit(10)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        makanan.push(doc.data());
      });
      res.status(200).json({
        message: "success",
        data: makanan,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        data: err,
      });
    });
});

// get makanan by id
router.get("/makanan/:id", (req, res) => {
  var id = req.params.id;
  console.log(id);
  db.collection("makanan")
    .doc(id)
    .get()
    .then((doc) => {
      // update search count
      var search_record = doc.data().search_record;
      search_record++;
      db.collection("makanan").doc(id).update({
        search_record: search_record,
      });

      // return data
      res.status(200).json({
        message: "success",
        data: doc.data(),
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        data: err,
      });
    });
});

// get makanan by slug
router.get("/makanan/:title", (req, res) => {
  var title = req.params.title;
  console.log(title);
  var makanan = [];
  db.collection("makanan")
    .where("title", "==", title)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        makanan.push(doc.data());
      });
      res.status(200).json({
        message: "success",
        data: makanan,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        data: err,
      });
    });
});

// search makanan by likely parameter and limit
router.get("/makanan", (req, res) => {
  var search = req.query;
  console.log(search);
  if (search.slug == undefined) {
    // get all makanan
    var makanan = [];
    db.collection("makanan")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          makanan.push(doc.data());
        });
        res.status(200).json({
          message: "success",
          data: makanan,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "error",
          data: err,
        });
      });
  } else {
    var key = Object.keys(search);
    var value = Object.values(search);
    value[0] = value[0].toLowerCase();

    var makanan = [];
    db.collection("makanan")
      .where(key[0], ">=", value[0])
      .where(key[0], "<=", value[0] + "\uf8ff")
      .limit(10)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          makanan.push(doc.data());
          console.log(doc.data());
        });
        if (makanan.length == 0) {
          res.status(200).json({
            message: "not found",
            data: makanan,
          });
        } else {
          res.status(200).json({
            message: "success",
            data: makanan,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "error",
          data: err,
        });
      });
  }
});

// Route for adding makanan
router.post("/makanan", (req, res) => {
  var data = req.body;

  // Generate new ID
  db.collection("makanan")
    .orderBy("id", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      let lastId = 0;
      snapshot.forEach((doc) => {
        lastId = doc.data().id;
      });

      const newId = lastId + 1;

      // Add recipe to database
      db.collection("makanan")
        .doc(newId.toString())
        .set({
          id: newId,
          title: data.title,
          slug: data.slug,
          description: data.description,
          calories: data.calories,
          healthyCalories: data.healthyCalories,
          ingredients: data.ingredients,
          healthyIngredients: data.healthyIngredients,
          steps: data.steps,
          healthySteps: data.healthySteps,
          isFavorite: false,
          photoUrl: data.photoUrl,
          created_on: new Date().toISOString(),
        })
        .then(() => {
          console.log("Resep berhasil dibuat");
          return res.status(200).json({
            error: false,
            message: "Resep berhasil dibuat",
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            error: true,
            message: error,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: error,
      });
    });
});

// Route for Delete Makanan
router.delete("/makanan/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = db.collection("makanan").doc(id);
    const makanan = await docRef.get();

    if (!makanan.exists) {
      return res.status(404).json({
        success: false,
        message: "Makanan not found",
      });
    }

    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Delete makanan successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Route for updating makanan
router.put("/makanan/:id", (req, res) => {
  const makananId = req.params.id;
  const updatedData = req.body;

  // Update recipe in database
  db.collection("makanan")
    .doc(makananId)
    .update({
      title: updatedData.title,
      slug: updatedData.slug,
      description: updatedData.description,
      calories: updatedData.calories,
      healthyCalories: updatedData.healthyCalories,
      ingredients: updatedData.ingredients,
      healthyIngredients: updatedData.healthyIngredients,
      steps: updatedData.steps,
      healthySteps: updatedData.healthySteps,
      photoUrl: updatedData.photoUrl,
    })
    .then(() => {
      console.log("Resep berhasil diperbarui");
      return res.status(200).json({
        error: false,
        message: "Resep berhasil diperbarui",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: error,
      });
    });
});

// export router
module.exports = router;
