module.exports = function(app) {

  const {db} = app.settings;

  app.get("/api/builder/lessons", (req, res) => {

    db.lessons.findAll({where: req.query}).then(u => {
      res.json(u).end();
    });

  });

  app.post("/api/builder/lessons/save", (req, res) => {
    
    db.lessons.update(req.body, {where: {id: req.body.id}}).then(u => {
      res.json(u).end();
    });

  });  

  app.post("/api/builder/lessons/new", (req, res) => {
    
    db.lessons.create(req.body).then(u => {
      res.json(u).end();
    });

  });

  app.delete("/api/builder/lessons/delete", (req, res) => {

    db.lessons.destroy({where: {id: req.query.id}}).then(() => {
      db.minilessons.destroy({where: {lid: req.query.id}}).then(u => {
        res.json(u).end();
      });
    });

  });

  app.get("/api/builder/minilessons", (req, res) => {

    db.minilessons.findAll({where: {lid: req.query.lid}}).then(u => {
      res.json(u).end();
    });

  });

  app.post("/api/builder/minilessons/save", (req, res) => {
    
    db.minilessons.update(req.body, {where: {id: req.body.id}}).then(u => {
      res.json(u).end();
    });

  });

  app.post("/api/builder/minilessons/new", (req, res) => {
    
    db.minilessons.create(req.body).then(u => {
      res.json(u).end();
    });

  });

  app.get("/api/builder/minilessons/all", (req, res) => {

    db.minilessons.findAll({where: req.query}).then(u => {
      res.json(u).end();
    });

  });

  app.delete("/api/builder/minilessons/delete", (req, res) => {

    db.minilessons.destroy({where: {id: req.query.id}}).then(() => {
      db.slides.destroy({where: {mlid: req.query.id}}).then(u => res.json(u).end());
    });

  });

  app.get("/api/builder/slides", (req, res) => {

    db.slides.findAll({where: {mlid: req.query.mlid}}).then(u => {
      res.json(u).end();
    });

  });

  app.get("/api/builder/slides/all", (req, res) => {

    db.slides.findAll({where: req.query}).then(u => {
      res.json(u).end();
    });

  });  

  app.post("/api/builder/slides/save", (req, res) => {
    
    db.slides.update(req.body, {where: {id: req.body.id}}).then(u => {
      res.json(u).end();
    });

  });

  app.post("/api/builder/slides/new", (req, res) => {
    
    db.slides.create(req.body).then(u => {
      res.json(u).end();
    });

  });

  app.delete("/api/builder/slides/delete", (req, res) => {

    db.slides.destroy({where: {id: req.query.id}}).then(u => {
      res.json(u).end();
    });

  });

};