const admin = require('firebase-admin');

module.exports = (req,res) => {
  //check if there is a code and a phone in the request
  if(!req.body.phone || !req.body.code) {
    return res.status(422).send( { error: 'Phone and code must e provided'});
  }
    
  //take the phone and the code from the body of the request
  const phone = String(req.body.phone).replace(/[^\d]/g, '');
  const code = parseInt(req.body.code);
   

  //here we will get the reference of the user based on the phone number
  // check if the code is valid
  admin.auth().getUser(phone)
  .then(() => {    
    const ref =  admin.database().ref('users/' + phone );
    ref.on('value', snapshot => {     
      ref.off();
      const user = snapshot.val();     

      if (user.code !== code || !user.codeValid) {
        return res.status(422).send({ error: 'Code not valid'});
      }

      //mark the existing code as being invalid
      ref.update({ codeValid: false });

      //generate our JSON cstom token
      admin.auth().createCustomToken(phone)
        .then(token => res.send({ token: token }));
      
    });
  })
  .catch((err) => {
    res.status(422).send({ error: `Deu pau ${err}` });
  })
}