var router = require("express").Router();
var fire = require('../config/dbConfig')
var fs = require("fs");
var path = require("path");
var db = fire.firestore();

router.get("/makanan-seeder", async (req, res) => {
  const seeder_makanan = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../seeder_makanan.json"), "utf-8")
  );
  try {
    const collectionRef = db.collection("makanan");
    const batch = db.batch();

    for (const makanan of seeder_makanan) {
      const docRef = collectionRef.doc();
      batch.set(docRef, makanan);
    }
    await batch.commit();

    return res.status(200).json({
      message: "success",
      data: seeder_makanan,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error",
      data: error,
    });
  }
});


module.exports = router