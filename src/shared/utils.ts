import { randomUUID } from 'crypto'

export const genReqId = (req: any) =>
  req.headers['x-request-id'] || randomUUID()

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function shorterAddress(address: string, show = 4) {
  return `${address.slice(0, show)}...${address.slice(-show)}`
}

export function generateInviteCode(userId: number | string) {
  const userIdString = userId.toString()
  const buffer = Buffer.from(userIdString, 'utf-8')
  const inviteCode = buffer.toString('base64')
  return inviteCode.replace(/=+$/, '')
}

export function decodeInviteCode(inviteCode: string) {
  const padding = '='.repeat((4 - (inviteCode.length % 4)) % 4)
  const inviteCodeWithPadding = inviteCode + padding
  const buffer = Buffer.from(inviteCodeWithPadding, 'base64')
  return buffer.toString('utf-8')
}
