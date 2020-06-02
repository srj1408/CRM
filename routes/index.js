const express = require('express');
const router = express.Router();
const session = require('express-session');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Customer = require('../models/customer');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home'));

// Dashboard
var sess;
router.get('/customer', ensureAuthenticated, (req, res) => {
	sess = req.session;
	sess.user = req.user;
	Customer.find({uid:sess.user._id},function(err,found){
		if(found){
			res.render('customer',{
				user:sess.user,
				customers:found
			})
		}else{
			res.send(err);
		}
	});
});
router.get('/addCustomer', ensureAuthenticated, (req, res) => res.render('addCustomer'));

router.post('/addCustomer', (req, res) => {
  const { firstName, lastName, email, address, state, pin, country, mobile, gender, dob, source, emc, smc } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !address || !state || !pin || !country || !mobile || !gender || !dob || !source || !emc || !smc) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (errors.length > 0) {
    res.render('addCustomer', {
      errors,
      firstName, 
	  lastName,
	  email,
	  address,
	  state,
	  pin,
	  country,
	  mobile,
	  gender,
	  dob,
	  source,
	  emc,
	  smc
    });
  } else {
	    sess = req.session;
	    sess.user = req.user;
	    uid=sess.user._id;
        const newCustomer = new Customer({
		  uid,
          firstName, 
		  lastName, 
		  email,
		  address,
		  state, 
		  pin, 
	      country,
	      mobile, 
		  gender,
		  dob,
		  source,
	      emc,
		  smc
        });
            newCustomer.save().then(customer => {
                req.flash(
                  'success_msg',
                  'New Customer added'
                );
                res.redirect('/customer');
              }).catch(err => console.log(err));
      }
    });

module.exports = router;
