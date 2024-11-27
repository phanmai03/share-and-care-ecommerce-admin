"use client"
import Heading from '@/app/ui/heading'
import React from 'react'
import Detail from "@/app/ui/add-product/detail-product"
import Images from "@/app/ui/add-product/image-upload"
import Properties from "@/app/ui/add-product/properties"

export default function page() {
  return (
    <div>
      <Heading title='Add Product' />
      <div>
      <form className="bg-white relative">
        {/* Form Sections */}
        <div className="space-x-0">
          {/* Product Details Section */}
          <Detail />

          {/* Horizontal Line */}
          <hr className="border-gray-100" />
          {/* Image Upload Section */}
          <Images />

          <hr className="border-gray-100" />
          <Properties />
        </div>
      </form>

      {/* Submit Button */}
      <div className="flex items-center justify-end mt-5">
        <button
          type="submit"
          className="px-6 py-2 bg-[#38A59F] text-white rounded-lg shadow hover:bg-[#2F8F8A]"
        >
          Add Product
        </button>
        </div>
      </div>
    </div>
  )
}
