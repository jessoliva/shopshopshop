const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// display all categories
router.get('/', (req, res) => {
   console.log('======================');
   // find all categories
   // be sure to include its associated Products
   Category.findAll({
      attributes: ['id', 'category_name'],
      include: [
         {
            model: Product,
            attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
         }
      ]
   })
   // this is the Promise that captures the response from the database call
   // database call is the findAll and what is returned
   .then(dbCategoryData => res.json(dbCategoryData)) 
   .catch(err => {
      console.log(err);
      res.status(500).json(err); 
      // 500 is internal server error
   });
});

// display category by id
router.get('/:id', (req, res) => {
   // find one category by its `id` value
   // be sure to include its associated Products
   Category.findOne({
      where:{ 
         id: req.params.id
      },
      attributes: ['id', 'category_name'],
      include: [
         {
            model: Product,
            attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
         }
      ]
   })
   .then(dbCategoryData => {
      if (!dbCategoryData) {
         // The 404 status code identifies a user error and will need a different request for a successful response
         res.status(404).json({ message: 'No category was found with this id' });
         return;
      }
      res.json(dbCategoryData);
   })
   .catch(err => {
      console.log(err);
      res.status(500).json(err);
   });
});

// create new category
router.post('/', (req, res) => {
   // create a new category
   Category.create({
      category_name: req.body.category_name,
   })
   .then(dbUserData => res.json(dbUserData))
   .catch(err => {
      console.log(err);
      res.status(500).json(err);
   }); 
});

// update category name
router.put('/:id', (req, res) => {
   // update a category by its `id` value
   Category.update(
      { // used the req.body.category_name value to replace the name of the category
         category_name: req.body.category_name,
     },
     {
         where: { 
            // used the request parameter to find the post,
            id: req.params.id
         }
     }
   )
   .then(dbCategoryData => {
      if (!dbCategoryData) {
          res.status(404).json({ message: 'No category was found with this id' });
          return;
      }
      // In the response, we sent back number of rows that has been modified and stored in the database.
      res.json(dbCategoryData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

// delete a category
router.delete('/:id', (req, res) => {
   // delete a category by its `id` value  
   Category.destroy({
      where: {
         id: req.params.id,
      }
   })
   .then((dbCategoryData) => {
      if (!dbCategoryData) {
         res.status(404).json({ message: "No category was found with this id" });
         return;
      }
      res.json(dbCategoryData);
   })
   .catch((err) => {
      console.log(err);
      res.status(500).json(err);
   });
});

module.exports = router;
