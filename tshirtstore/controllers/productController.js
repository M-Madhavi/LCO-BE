const BigPromise = require('../middlewares/bigPromise')
const Product = require('../models/product')
const cloudinary = require('cloudinary');
const CustomError = require('../utils/customError');
const whereClause = require('../utils/whereClause');

exports.addProduct = BigPromise( async(req,res,next) => {
    //images
    let imagesArr =[];
    if(!req.files){
        return next(new CustomError("Images are required",401));
    }

    if(req.files){
        for (let index = 0; index < req.files.photos; index++) {
            let result = await cloudinary.v2.uploader(req.files.photos[index].tempFilepath,{
                folder:"products"
            })
            imagesArr.push({
                id:result.public_id,
                secure_url:result.secure_url
            })
        }
    }

    req.body.photos = imagesArr;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(200).json({
        success:true,
        product
    })
 next();

})

exports.getAllProducts = BigPromise(async(req,res,next) =>{

    const resultPerPage = 6;
    const totalProductsCount = await Product.countDocument();
    const products = new whereClause(Product.find(),req.query).search().filter();//await Product.find();
    const filterProductCount = products.length;
    products.pager(resultPerPage);
    console.log("products",products)
    products = await products.base;


    res.status(200).json({
        success:true,
        products,
        filterProductCount,
        totalProductsCount
    })

})

