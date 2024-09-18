import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
const prisma = new PrismaClient()

async function main() {
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  const hash = await bcrypt.hash('ssdakhf123@-dsf=@12', 10)
  const userList = new Array(100).fill(null).map(() => {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: hash,
    }
  })
  userList.unshift({
    id: faker.string.uuid(),
    email: 'levanson@gmail.com',
    name: 'levanson',
    password: hash,
  })

  await prisma.user.createMany({
    data: userList,
  })

  const postList = new Array(1500).fill(null).map(() => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    published: faker.datatype.boolean(),
    authorId: faker.helpers.arrayElement(userList).id,
  }))

  await prisma.post.createMany({
    data: postList,
  })
}
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
