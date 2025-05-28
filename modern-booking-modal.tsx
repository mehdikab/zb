"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, Clock, MapPin, Star, ShoppingCart } from "lucide-react"

interface ModernBookingModalProps {
  tour: any
  isOpen: boolean
  onClose: () => void
  onProceedToCheckout: (bookingData: any) => void
  isActivity?: boolean
}

export default function ModernBookingModal({
  tour,
  isOpen,
  onClose,
  onProceedToCheckout,
  isActivity = false,
}: ModernBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [travelers, setTravelers] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [discountInfo, setDiscountInfo] = useState({ discount: 0, discountAmount: 0, originalTotal: 0 })

  useEffect(() => {
    if (tour?.price) {
      const basePrice = Number.parseInt(tour.price.replace(/[^0-9]/g, ""))
      let discount = 0

      // Apply discounts based on number of travelers
      if (travelers === 2) {
        discount = 15 // 15% for couples
      } else if (travelers >= 10) {
        discount = 30 // 30% for groups of 10+
      } else if (travelers >= 5) {
        discount = 25 // 25% for groups of 5+
      }

      const discountAmount = (basePrice * discount) / 100
      const discountedPrice = basePrice - discountAmount
      const total = discountedPrice * travelers

      setTotalPrice(total)
      setDiscountInfo({ discount, discountAmount: discountAmount * travelers, originalTotal: basePrice * travelers })
    }
  }, [tour?.price, travelers])

  const handleAddToCart = () => {
    const bookingData = {
      tour,
      selectedDate,
      travelers,
      totalPrice,
      isActivity,
    }
    onProceedToCheckout(bookingData)
  }

  if (!tour) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-6xl h-[95vh] sm:h-[90vh] overflow-hidden p-0 m-2">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side - Tour Details */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-white shrink-0">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                <span className="lg:hidden">Book Tour</span>
                <span className="hidden lg:inline">Tour Details</span>
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Tour Image */}
              <div className="relative mb-4 sm:mb-6">
                <img
                  src={tour.image || "/placeholder.svg?height=300&width=500&text=Desert+Adventure"}
                  alt={tour.title}
                  className="w-full h-48 sm:h-64 object-cover rounded-lg"
                />
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <Badge className="bg-amber-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    {tour.rating || "4.5"}
                  </Badge>
                </div>
              </div>

              {/* Tour Info */}
              <div className="mb-4 sm:mb-6">
                <Badge className="bg-amber-100 text-amber-800 mb-2 sm:mb-3 text-xs">
                  {tour.category?.toUpperCase() || "TOUR"}
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                <p className="text-amber-600 font-medium text-sm sm:text-base mb-3">{tour.subtitle}</p>
                <p className="text-gray-600 mb-4 text-sm sm:text-base hidden lg:block">{tour.description}</p>

                <div className="flex items-center space-x-4 sm:space-x-6 text-sm text-gray-600 mb-4 sm:mb-6">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>Morocco</span>
                  </div>
                </div>
              </div>

              {/* Tour Highlights - Hidden on mobile to save space */}
              <div className="hidden lg:block mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Tour Highlights</h4>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {(tour.highlights || ["Marrakech", "Dades Valley", "Ait Ben Haddou", "Sahara Desert"]).map(
                    (highlight: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Route - Hidden on mobile */}
              <div className="hidden lg:block">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Route</h4>
                <p className="text-sm text-gray-600">
                  {tour.route || "Marrakech → Dades → Merzouga (+ flexible endings)"}
                </p>
              </div>

              {/* Mobile-only booking form */}
              <div className="lg:hidden space-y-4">
                {/* Price Display */}
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  {discountInfo.discount > 0 ? (
                    <div>
                      <div className="text-lg text-gray-500 line-through">
                        {formatPrice(discountInfo.originalTotal)}
                      </div>
                      <div className="text-2xl font-bold text-amber-600">{formatPrice(totalPrice)}</div>
                      <div className="text-sm text-green-600 font-medium">
                        {discountInfo.discount}% discount applied!
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-bold text-amber-600">
                        {formatPrice(Number.parseInt(tour.price?.replace(/[^0-9]/g, "") || "599"))}
                      </div>
                      <div className="text-xs text-gray-500">per person</div>
                    </div>
                  )}
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Number of Travelers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                  <div className="flex items-center justify-center space-x-4 p-4 border rounded-lg">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      disabled={travelers <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{travelers}</span>
                    <Button variant="outline" size="icon" onClick={() => setTravelers(travelers + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Discount Information */}
                {travelers >= 2 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-green-800 font-medium">
                      {travelers === 2 && "💕 Couples Discount: 15% off!"}
                      {travelers >= 10 && "🎉 Large Group Discount: 30% off!"}
                      {travelers >= 5 && travelers < 10 && "👥 Group Discount: 25% off!"}
                    </div>
                    {discountInfo.discount > 0 && (
                      <div className="text-xs text-green-700 mt-1">
                        You save {formatPrice(discountInfo.discountAmount)} on this booking!
                      </div>
                    )}
                  </div>
                )}

                {/* Total Price */}
                <div className="p-4 bg-white rounded-lg border-2 border-amber-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-amber-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Footer - Fixed */}
            <div className="lg:hidden p-4 bg-white border-t shrink-0">
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 mb-3"
                onClick={handleAddToCart}
                disabled={!selectedDate}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Book Now
              </Button>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Need help? Contact us via WhatsApp</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open("https://wa.me/34697926348", "_blank")}
                >
                  WhatsApp Support
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Desktop Booking Form */}
          <div className="hidden lg:flex lg:w-96 bg-gray-50 border-l flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Morocco Story</h3>
              <p className="text-gray-600 mb-6">Select your preferred date and number of travelers</p>

              {/* Price Display with Discounts */}
              <div className="text-center mb-6">
                {discountInfo.discount > 0 ? (
                  <div>
                    <div className="text-lg text-gray-500 line-through">{formatPrice(discountInfo.originalTotal)}</div>
                    <div className="text-2xl font-bold text-amber-600">{formatPrice(totalPrice)}</div>
                    <div className="text-sm text-green-600 font-medium">
                      {discountInfo.discount}% discount applied! Save {formatPrice(discountInfo.discountAmount)}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-amber-600">
                      {formatPrice(Number.parseInt(tour.price?.replace(/[^0-9]/g, "") || "599"))}
                    </div>
                    <div className="text-xs text-gray-500">per person</div>
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Number of Travelers */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    disabled={travelers <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{travelers}</span>
                  <Button variant="outline" size="icon" onClick={() => setTravelers(travelers + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Discount Information */}
              {travelers >= 2 && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-800 font-medium">
                    {travelers === 2 && "💕 Couples Discount: 15% off!"}
                    {travelers >= 10 && "🎉 Large Group Discount: 30% off!"}
                    {travelers >= 5 && travelers < 10 && "👥 Group Discount: 25% off!"}
                  </div>
                  {discountInfo.discount > 0 && (
                    <div className="text-xs text-green-700 mt-1">
                      You save {formatPrice(discountInfo.discountAmount)} on this booking!
                    </div>
                  )}
                </div>
              )}

              {/* Total Price */}
              <div className="mb-6 p-4 bg-white rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-xl font-bold text-amber-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Desktop Footer */}
            <div className="p-6 bg-gray-50 border-t">
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 mb-4"
                onClick={handleAddToCart}
                disabled={!selectedDate}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>

              {/* WhatsApp Contact */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Contact us for special offers via WhatsApp</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open("https://wa.me/34697926348", "_blank")}
                >
                  WhatsApp Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
