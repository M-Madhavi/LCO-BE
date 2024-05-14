const BigPromise = require('../middlewares/bigPromise')

// exports.home = (req,res) =>{
//     res.status(200).json({
//         success:true,
//         greeting:"Hello from API"
//     })
// }

exports.home = BigPromise(async(req,res) =>{
    //db = await something();
    res.status(200).json({
        success:true,
        greeting:"Hello from API"
    })
})

exports.homeDummy = async(req,res) =>{
    try {
        //db = await something();
        res.status(200).json({
            success:true,
            greeting:"Hello from API,this is homeDummy"
        })
        
    } catch (error) {
        console.log(error);
        
    }
  
}