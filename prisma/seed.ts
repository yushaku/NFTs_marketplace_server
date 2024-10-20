import { Prisma, PrismaClient } from '@prisma/client'
// import * as bcrypt from 'bcrypt'
// import { faker } from '@faker-js/faker'
const prisma = new PrismaClient()

async function main() {}
main()
  .then(async () => {
    await prisma.product.deleteMany()

    const products = [
      {
        name: 'Bluetooth Mouse',
        description: '',
        price: new Prisma.Decimal(19.99),
        stock_quantity: 25,
        banner:
          'https://down-vn.img.susercontent.com/file/sg-11134202-7rcbx-lrybzf8aqk2p9c@resize_w450_nl.webp',
        image_urls: [
          'https://down-vn.img.susercontent.com/file/sg-11134202-7rcbx-lrybzf8aqk2p9c@resize_w450_nl.webp',
        ],
      },
      {
        name: 'Bluetooth headphone',
        description: '',
        price: new Prisma.Decimal(12.5),
        stock_quantity: 15,
        banner:
          'https://down-vn.img.susercontent.com/file/sg-11134201-7rdyl-lxxms3nu5xly35@resize_w450_nl.webp',
        image_urls: [
          'https://down-vn.img.susercontent.com/file/vn-11134258-7ras8-m1d6vpw1uae486',
        ],
      },
      {
        name: 'Monitor MSI PRO MP251',
        description: '',
        price: new Prisma.Decimal(9.75),
        stock_quantity: 30,
        banner:
          'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmedmbll317j21@resize_w450_nl.webp',
        image_urls: [
          'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmedmbll317j21@resize_w450_nl.webp',
        ],
      },
      {
        name: 'Keyboard Xiaozhubangchu',
        description: '',
        price: new Prisma.Decimal(15.0),
        stock_quantity: 10,
        banner:
          'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lpfxw13ems0sc4.webp',
        image_urls: [
          'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lpfxw13ems0sc4.webp',
        ],
      },
      {
        name: 'Keycap catty',
        description: '',
        price: new Prisma.Decimal(8.25),
        stock_quantity: 20,
        banner:
          'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lkw0o6xrhknxa2.webp',
        image_urls: [
          'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lkw0o6xrhknxa2.webp',
        ],
      },
      {
        name: 'Hub Xiaomi Lenovo Macbook Pro',
        description: '',
        price: new Prisma.Decimal(8.25),
        stock_quantity: 20,
        banner:
          'https://down-vn.img.susercontent.com/file/sg-11134201-7qvem-ljld4mnf7oqm1a@resize_w450_nl.webp',
        image_urls: [
          'https://down-vn.img.susercontent.com/file/sg-11134201-7qvem-ljld4mnf7oqm1a@resize_w450_nl.webp',
        ],
      },
    ]

    await prisma.product.createMany({ data: products })

    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(() => {
    console.log('Done seeding database')
  })
