import couponService from "../services/coupon.service.js";

const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    return res.status(201).send(coupon);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    // Return format expected by frontend Action.js: { coupons: [...] }
    return res.status(200).send({ coupons });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  const couponId = req.params.id;
  try {
    await couponService.deleteCoupon(couponId);
    return res
      .status(200)
      .send({ message: "Coupon deleted successfully", status: true });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateCoupon = async (req, res) => {
  const couponId = req.params.id;
  try {
    const coupon = await couponService.updateCoupon(couponId, req.body);
    return res.status(200).send(coupon);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
};