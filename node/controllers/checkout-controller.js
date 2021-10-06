const mercadopago = require('mercadopago')

const env = require('../utils/env')
const mailer = require('../utils/mailer')
const reviewSubmittedEmail = require('../email-templates/review-submitted-staff')

const shared = require('../utils/cart-checkout-shared')

mercadopago.configurations.setAccessToken(env.MERCADOPAGO_ACCESS_TOKEN)

// models
const Order = require('../models/Order')
const Coupon = require('../models/Coupon')
const Product = require('../models/Product')

// templates
const orderTemplate = require('../models/templates/order')
const stdRes = require('../utils/errors')

const staffNewOrderEmail = require('../email-templates/new-order-to-staff-email')
const customerNewOrderEmail = require('../email-templates/new-order-to-customer-email')

exports.postCheckout = async (req, res, next) => {
  try {
    const items = shared.getItems(req)

    if (items.length === 0) {
      return res.status(400).json({
        error: 'No hay items que comprar'
      })
    }    

    // TODO: check if there is enough stock
    const { 
      totalPrice,
      itemsExpanded: orderProducts,
      missingProducts,
      missingVariants,
      outOfStockItems,
    } = await shared.expandedItems(items, (product, variant, quantity) => {
      // TODO: add a cover image here
      return {
        originalProduct: product._id,
        handle: product.handle,
        title: product.title,
        variant: variant?.values.join(', '),
        unitPrice: (variant || product).price,
        quantity: quantity
      }
    })

    if (missingProducts.concat(missingVariants).concat(outOfStockItems).length > 0) {
      return res.status(400).json({
        error: 'Hay algun producto agotado o que ha sido modificado. Vuelve al carrito de compras para corregir los errores.'
      })
    }
  
    let discountedPrice, coupon, couponError
  
    const couponCode = req.body.coupon
    if (couponCode) {
      // if last parameter is true, it modifies the orderProducts items price and adds discountedFrom property
      ({ discountedPrice, coupon, couponError } = await shared.applyCoupon(couponCode, orderProducts, totalPrice, false)) 
    }


    billed = discountedPrice || discountedPrice === 0? discountedPrice : totalPrice

    if (couponError) {
      return res.status(400).json({
        error: 'El cupón ya no es válido. Vuelve al carrito de compras para quitarlo o cambiarlo'
      })
    }
    
    let MPstatus
    let paymentMethod
    if (billed > 0) {
      paymentMethod = req.body.payment.method
      let paymentData
      let paymentStatus

      if (paymentMethod === 'card') {
        paymentData = {
          transaction_amount: billed,
          token: req.body.payment.token,
          description: req.body.payment.description || 'Orden de Tiendu',
          payment_method_id: req.body.payment.paymentMethodId,
          installments: Number(req.body.payment.installments),
          issuer_id: req.body.payment.issuer? String(req.body.payment.issuer) : undefined,
          payer: {
            email: req.body.contact.email,
            identification: {
              type: req.body.document.type,
              number: req.body.document.number
            }
          }
        }
        paymentStatus = await mercadopago.payment.save(paymentData)
      } else {
        // Is Abitab or Redpagos
        paymentData = {
          transaction_amount: billed,
          description: req.body.payment.description || 'Orden de Tiendu',
          payment_method_id: paymentMethod,
          payer: {
            email: req.body.contact.email,
            identification: {
              type: req.body.document.type,
              number: req.body.document.number
            }
          }
        }

        paymentStatus = await mercadopago.payment.create(paymentData)
      }

      if (paymentStatus.body.status === 'rejected') {
        const rejectedMessages = {
          cc_rejected_bad_filled_card_number: 'Revisa el número de tarjeta.',
          cc_rejected_bad_filled_date: 'Revisa la fecha de vencimiento de la tarjeta.',
          cc_rejected_bad_filled_other: 'Revisa los datos de la tarjeta.',
          cc_rejected_bad_filled_security_code: 'Revisa el código de seguridad de la tarjeta.',
          cc_rejected_blacklist: 'No pudimos procesar tu pago.',
          cc_rejected_call_for_authorize: 'Debes comunicarte con la compañía de tu tarjeta para autorizar el pago del total de la orden.',
          cc_rejected_card_disabled: 'Llama a a la compañia de tu tarjeta para activar tu tarjeta o usa otro medio de pago.',
          cc_rejected_card_error: 'No pudimos procesar tu pago.',
          cc_rejected_duplicated_payment: 'Ya hiciste un pago por ese valor. Si necesitas volver a pagar usa otra tarjeta u otro medio de pago.',
          cc_rejected_high_risk: 'Tu pago fue rechazado. Elige otro de los medios de pago.',
          cc_rejected_insufficient_amount: 'Tu tarjeta no tiene fondos suficientes.',
          cc_rejected_invalid_installments: 'Tu tarjeta no permite pagar en cuotas.',
          cc_rejected_max_attempts: 'Llegaste al límite de intentos permitidos. Elige otra tarjeta u otro medio de pago.',
          cc_rejected_other_reason: 'Tu compañía de tarjeta no procesó el pago.'
        }

        const statusDetail = paymentStatus.body.status_detail
        return stdRes._400(res, statusDetail in rejectedMessages ? rejectedMessages[statusDetail] : 'cc_rejected_card_error')
      }

      MPstatus = paymentStatus.body.status

      // status approved for card or pending for payment network
    } else {
      paymentMethod = 'free'
      MPstatus = 'approved'
    }

    const order = new Order({
      paymentMethod,
      user: req.user,
      status: paymentMethod === 'card' || paymentMethod === 'free' ? (MPstatus === 'approved' ? 'a confirmar' : 'procesando pago') : 'impaga',
      billed,
      discount: coupon && {
        coupon,
        code: coupon.code,
        description: coupon.description,
      },
      personal: {
        firstName: req.body.contact.firstName,
        lastName: req.body.contact.lastName,
        email: req.body.contact.email,
        phone: req.body.contact.phone,
        idType: req.body.payment?.docType,
        idNumber: req.body.payment?.docNumber,
      },
      shipping: {
        state: req.body.shipping.state,
        neighborhood: req.body.shipping.neighborhood,
        address: req.body.shipping.address
      },
      items: orderProducts
    })

    await order.save()
    if (req.user) await req.user.resetCart()

    
    // update stock and product sales
    if (MPstatus === 'approved') {
      for (itemSlim of items) {
        const product = await Product.findById(itemSlim.productId)
        product.sold += itemSlim.quantity
        let item
        if (itemSlim.variantId) {
          item = product.variants[itemSlim.variantId - 1]
        } else {
          item = product
        }
        // if not a number, then stock is not tracked
        if (typeof item.stock === 'number') {
          item.stock = Math.max(item.stock - itemSlim.quantity, 0) // it should never be negative, but just in case
        }
        product.save()
      }
    }

    if (coupon) {
      coupon.timesUsed += 1
      await coupon.save()
    }

    mailer(
      env.ADMIN_EMAILS,
      staffNewOrderEmail.subject(order),
      staffNewOrderEmail.body(order)
    )
    mailer(
      req.body.email,
      customerNewOrderEmail.subject(order),
      customerNewOrderEmail.body(order)
    )
    res.json({
      order: orderTemplate(order)
    })
  } catch (error) {
    console.error('error', error)
    // stdRes._500(res, error.message)
  }
}