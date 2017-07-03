module.exports = function(app) {

  const {db} = app.settings;

  app.get("/api/rules", (req, res) => {

    db.testrules.findAll({where: req.query}).then(u => res.json(u).end());

  });

};