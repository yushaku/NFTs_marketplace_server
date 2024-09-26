import { PrismaClient } from '@prisma/client'
// import * as bcrypt from 'bcrypt'
// import { faker } from '@faker-js/faker'
const prisma = new PrismaClient()

async function main() {}
main()
  .then(async () => {
    console.log('Done seeding database')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
