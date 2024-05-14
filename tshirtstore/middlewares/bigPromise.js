
//try catch and async-await || use promise evrywhere
module.exports = func => (req,res,next) => 
    Promise.resolve(func(req,res,next)).catch(next);