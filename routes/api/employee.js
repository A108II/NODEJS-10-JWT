const express = require('express');
const router = express.Router();
const emp_controller = require('../../controllers/emp_controller');

router.route('/')
  .get(emp_controller.get_all_employees)
  .post(emp_controller.add_employee)
  .put(emp_controller.update_employee)
  .delete(emp_controller.delete_employee)
router.route('/:id')
  .get(emp_controller.get_emp_id)
  
module.exports = router;

























