import { PrismaClient } from '../../prisma/.prisma/prismaclient'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { hashPasswordMiddleware } from './passwordMiddleware'

const _createContext = ((): ContextType => {
    const prisma = new PrismaClient()
    prisma.$use(hashPasswordMiddleware)
    return {
        prisma
    }
})()

export const CreateContext = () => _createContext
export interface ContextType {
    prisma: PrismaClient
}

export type MockContext = {
    prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
    return {
        prisma: mockDeep<PrismaClient>(),
    }
}