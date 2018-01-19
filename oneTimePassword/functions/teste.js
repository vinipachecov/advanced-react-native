module.exports = function(req,res) {

    const totalvoice = require('totalvoice-node');
    const token = require('./credentials').totalvoiceToken;
    const client = new totalvoice(token);
    

    var resdados = {};
    client.sms.enviar("5599995848", "A mensagem salvadora")
        .then(function (dados, reject) {          
            console.log('Dados = ' + dados);
            console.log(dados);
            resdados = dados;
            
        })
        .catch(function (error) {
            console.log(error);            
        });
    return res.send(resdados);
    
}