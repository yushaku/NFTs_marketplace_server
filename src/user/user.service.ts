import { Inject, Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma.service'
import { PaginationDto } from '@/shared/dto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from '@nestjs/cache-manager'
import { sleep } from '@/shared/utils'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async userInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })
    return user
  }

  async getPosts({ page, perPage }: { page: number; perPage: number }) {
    await sleep(500)
    return this.prisma.post.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getPostsNoCache({ page, perPage }: PaginationDto) {
    const posts = await this.getPosts({ page, perPage })

    return {
      page,
      perPage,
      data: posts,
    }
  }

  async getPostsWithCache({ page, perPage }: PaginationDto) {
    const pageKey = `posts:${page}:${perPage}`

    const posts = await this.getOrSet(
      pageKey,
      () => this.getPosts({ page, perPage }),
      5 * 60 * 1000,
    )

    return {
      page,
      perPage,
      data: posts,
    }
  }

  async getPostsWithPromiseCache({ page, perPage }: PaginationDto) {
    const pageKey = `promise-posts:${page}:${perPage}`

    const posts = await this.getOrSetPromise(
      pageKey,
      () => this.getPosts({ page, perPage }),
      5 * 60 * 1000,
    )

    return {
      page,
      perPage,
      data: posts,
    }
  }

  async getOrSet<T>(
    key: string,
    getData: () => Promise<T>,
    ttl = 60 * 1000,
  ): Promise<T> {
    let value = (await this.cache.get(key)) as T

    if (!value) {
      value = (await getData()) as T
      await this.cache.set(key, value, ttl)
    }
    return value
  }

  callingMaps: Map<string, Promise<unknown>> = new Map()
  async getOrSetPromise<T>(
    key: string,
    getData: () => Promise<T>,
    ttl = 60 * 1000,
  ): Promise<T> {
    let value = (await this.cache.get(key)) as T

    if (!value) {
      // Check if key is being processed in callingMaps
      if (this.callingMaps.has(key)) {
        return this.callingMaps.get(key) as Promise<T>
      }
      try {
        const promise = getData()
        // Store key + promise in callingMaps
        this.callingMaps.set(key, promise)
        value = (await promise) as T
      } finally {
        // Remove key from callingMaps when done
        this.callingMaps.delete(key)
      }

      await this.cache.set(key, value, ttl)
    }

    return value as T
  }
}
