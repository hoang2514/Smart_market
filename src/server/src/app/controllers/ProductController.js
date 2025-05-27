const Product = require("../models/Product");

class ProductController {
    isWithinPromotionPeriod = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);
        return now >= start && now <= end; // Kiểm tra nếu now nằm trong khoảng start đến end
    };

    // GET all products
    getAllProducts = async (req, res) => {
        try {
            const products = await Product.find().populate({
                path: "promotions",
                select: "_id, startTime endTime discount",
            });

            const enrichedProducts = products.map((product) => {
                let discountRate = 0;

                // Lọc các khuyến mãi hợp lệ
                const validPromotions = product.promotions.filter((promotion) =>
                    this.isWithinPromotionPeriod(
                        promotion.startTime,
                        promotion.endTime
                    )
                );

                validPromotions.forEach((promotion) => {
                    const rate = parseFloat(
                        promotion.discount.replace("%", "")
                    );
                    discountRate += rate;
                });

                // Giới hạn discountRate không vượt quá 100%
                discountRate = Math.min(discountRate, 100);

                // Tính giá sau khi giảm giá
                const discountedPrice =
                    product.prices.price * (1 - discountRate / 100);

                return {
                    ...product.toObject(),
                    discountRate: `${discountRate}%`,
                    discountedPrice: discountedPrice.toFixed(0),
                };
            });

            res.status(200).json(enrichedProducts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error", error });
        }
    };

    // GET product by id
    getProductsByID = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id).populate({
                path: "promotions",
                select: "_id, startTime endTime discount",
            });

            if (!product) {
                return res
                    .status(404)
                    .json({ message: "Product not found !!!" });
            }

            let discountRate = 0;
            const validPromotions = product.promotions.filter((promotion) =>
                this.isWithinPromotionPeriod(
                    promotion.startTime,
                    promotion.endTime
                )
            );

            validPromotions.forEach((promotion) => {
                const rate = parseFloat(promotion.discount.replace("%", ""));
                discountRate += rate; // Cộng dồn
            });

            // Giới hạn discountRate không vượt quá 100%
            discountRate = Math.min(discountRate, 100);

            // Tính giá sau khi giảm giá
            const discountedPrice =
                product.prices.price * (1 - discountRate / 100);

            res.status(200).json({
                ...product.toObject(),
                discountRate: `${discountRate}%`,
                discountedPrice: discountedPrice.toFixed(0),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error" });
        }
    };

    getProductsByIDs = async (req, res) => {
        try {
            // Lấy danh sách ID từ body request
            const { ids } = req.body; // ids là mảng chứa các ID
    
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: "Invalid product IDs!" });
            }
    
            // Lấy danh sách sản phẩm dựa trên danh sách ID
            const products = await Product.find({ _id: { $in: ids } }).populate({
                path: "promotions",
                select: "_id startTime endTime discount",
            });
    
            // Nếu không tìm thấy sản phẩm nào
            if (products.length === 0) {
                return res.status(404).json({ message: "No products found!" });
            }
    
            // Tính toán discount cho từng sản phẩm
            const response = products.map((product) => {
                let discountRate = 0;
                const validPromotions = product.promotions.filter((promotion) =>
                    this.isWithinPromotionPeriod(
                        promotion.startTime,
                        promotion.endTime
                    )
                );
    
                validPromotions.forEach((promotion) => {
                    const rate = parseFloat(promotion.discount.replace("%", ""));
                    discountRate += rate; // Cộng dồn
                });
    
                // Giới hạn discountRate không vượt quá 100%
                discountRate = Math.min(discountRate, 100);
    
                // Tính giá sau khi giảm giá
                const discountedPrice =
                    product.prices.price * (1 - discountRate / 100);
    
                return {
                    ...product.toObject(),
                    discountRate: `${discountRate}%`,
                    discountedPrice: discountedPrice.toFixed(0),
                };
            });
    
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error" });
        }
    };
    

    //POST post product
    addProduct = async (req, res) => {
        try {
            //Create new product
            const newProduct = await new Product({
                productID: req.body.productID,
                name: req.body.name,
                prices: {
                    price: req.body.prices.price,
                    purchasePrice: req.body.prices.purchasePrice,
                },
                productInfo: {
                    mfg: req.body.productInfo.mfg,
                    exp: req.body.productInfo.exp,
                    description: req.body.productInfo.description,
                    bracode: req.body.productInfo.bracode,
                },
                stock: req.body.stock,
                warnningLevel: req.body.warnningLevel,
            });

            //Save Database
            const product = await newProduct.save();
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json(error);
        }
    };

    searchProductByNameOrID = async (req, res) => {
        try {
            const data = req.body.data;
            const data1 = await Product.find({
                productID: { $regex: data, $options: "i" },
            }).limit(5); // Chỉ trả về 5 ptu

            // console.log(data1);

            if (data1.length == 0) {
                const data2 = await Product.find({
                    name: { $regex: data, $options: "i" },
                }).limit(5); // Chỉ trả về 5 ptu
                // console.log(data1);
                return res.status(200).json(data2);
            }
            return res.status(200).json(data1);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    deleteProduct = async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({
                mesage: "DELETE successfully !",
                auth: req.user.username,
                product: product,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    };

    updateProduct = async (req, res) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true } // Trả về tài liệu đã được cập nhật
            );

            if (!updatedProduct) {
                return res
                    .status(404)
                    .json({ message: "sản phẩm không tìm thấy" });
            }
            return res.status(200).json("UPDATE successfully !");
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    sellProduct = async (req, res) => {
        try {
            const { items } = req.body; // Lấy thông tin sản phẩm từ request body

            var check_bill = true;

            // Lặp qua từng sản phẩm trong đơn bán
            for (let item of items) {
                const product = await Product.findOne({
                    productID: item.productID,
                });

                if (!product) {
                    check_bill = false;
                    return res.status(400).json({
                        message: `ProductID ${item.productID} not found`,
                    });
                }

                if (product.stock < item.quantity) {
                    check_bill = false;
                    return res.status(400).json({
                        message: `Not enough stock for ${item.product}`,
                    });
                }
            }

            if (check_bill) {
                for (let item of items) {
                    const product = await Product.findOne({
                        productID: item.productID,
                    });

                    // Trừ số lượng sản phẩm trong kho
                    product.stock -= item.quantity;

                    // Cập nhật lại thông tin sản phẩm trong cơ sở dữ liệu
                    await product.save();
                }
                return res.status(200).json({ status: "ok" });
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    };
}

module.exports = new ProductController();
